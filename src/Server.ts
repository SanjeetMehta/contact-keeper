import {Configuration, Inject} from "@tsed/di";
import {PlatformApplication} from "@tsed/common";
import "@tsed/platform-express"; // /!\ keep this import
import {GlobalAcceptMimesMiddleware} from "@tsed/platform-express";
import * as bodyParser from "body-parser";
import * as compress from "compression";
import * as cookieParser from "cookie-parser";
import * as methodOverride from "method-override";
import * as cors from "cors";
import "@tsed/ajv";
import "@tsed/swagger";
import {Config} from "../config/index";
export const rootDir = __dirname;

@Configuration({
    rootDir,
    acceptMimes: ["application/json"],
    httpPort: process.env.PORT || 8083,
    httpsPort: false, // CHANGE
    mount: {
        "/api/v1": [`${rootDir}/controllers/**/*.ts`]
    },
    swagger: [
        {
            path: "/docs"
        }
    ],
    exclude: ["**/*.spec.ts"]
})
export class Server {
    @Inject()
    app: PlatformApplication;

    @Configuration()
    settings: Configuration;

    $beforeRoutesInit() {
        this.app
            .use(cors())
            .use(GlobalAcceptMimesMiddleware)
            .use(cookieParser())
            .use(compress({}))
            .use(methodOverride())
            .use(bodyParser.json())
            .use(
                bodyParser.urlencoded({
                    extended: true
                })
            );

        return null;
    }
    public $onInit(): Promise<any> {
        return new Promise((resolve, reject) => {
            new Config()
                .connectToDb()
                .then(resolve)
                .catch(error => {
                    console.log(error);
                    process.exit(1);
                });
        });
    }
    public $onServerInitError(): any {
        console.error("Server encountered an error");
    }
}
