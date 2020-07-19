import {
    Controller,
    Get,
    Post,
    Required,
    BodyParams,
    UseAfter,
    UseBefore,
    Req
} from "@tsed/common";
import {User, JoiUser, LoginUser} from "../models/User";
import UserSchema from "../models/entity/UserSchema";
import {BadRequest} from "@tsed/exceptions";
import ErrorMiddleware from "../middlewares/ErrorMiddleware";
import * as bycrypt from "bcrypt";
import * as util from "util";
import {sign} from "jsonwebtoken";
import {Config} from "../config";
import {TokenValidator} from "../middlewares/TokenValidator";
import {use} from "nconf";

@Controller("/auth")
@UseAfter(ErrorMiddleware)
export class AuthController {
    @Get("/")
    @UseBefore(TokenValidator)
    public async getLoggedInUser(@Req() req: Req) {
        try {
            const loggedInUser: any = req.headers.user;
            const user = await UserSchema.findById(loggedInUser.id).select(
                "-password"
            );
            return user;
        } catch (err) {
            throw err;
        }
    }

    @Post("/")
    public async loginUser(@Required() @BodyParams() user: LoginUser) {
        const {error} = JoiUser.getSchema().validate(user, {
            abortEarly: false,
            allowUnknown: false
        });

        if (error) {
            throw {
                status: 400,
                message: error.message
            };
        }

        try {
            let dbUser = await UserSchema.findOne({email: user.email});
            if (!dbUser) {
                throw new BadRequest("Invalid credentials");
            }
            const isMatch = await bycrypt.compare(
                user.password,
                dbUser.password
            );
            if (!isMatch) {
                throw new BadRequest("Invalid credentials");
            }
            const payload = {
                user: {
                    id: dbUser.id
                }
            };
            const jwttoken = util.promisify(sign);
            const token = await jwttoken(payload, Config.get("jwtSecret"));
            return {token};
        } catch (err) {
            throw err;
        }
    }
}
