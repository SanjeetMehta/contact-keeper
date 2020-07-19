import {$log, Middleware, Next, Req, Res} from "@tsed/common";
import * as querystring from "querystring";
import {Config} from "../config/index";
import {verify} from "jsonwebtoken";
@Middleware()
export class TokenValidator {
    public use(@Req() req: Req, @Next() next: Next, @Res() res: Res) {
        const accessToken: string | undefined = req.header("x-auth-token");
        try {
            if (accessToken) {
                const decoded: any = verify(
                    accessToken,
                    Config.get("jwtSecret")
                );
                req.headers.user = decoded.user;
                next();
            } else {
                throw {
                    status: 401,
                    message: "Unauthorized"
                };
            }
        } catch (err) {
            throw {
                status: 401,
                message: "Unauthorized"
            };
        }
    }
}
