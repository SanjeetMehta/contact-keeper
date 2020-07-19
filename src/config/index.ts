import * as nconf from "nconf";
import {connect} from "mongoose";
import {$log} from "@tsed/common";
export class Config {
    public static async connectToDb() {
        nconf
            .argv()
            .env("__")
            .file({file: __dirname + "/appConfig.json"});
        const mongoUri = nconf.get("mongoUri");
        try {
            await connect(mongoUri, {
                useNewUrlParser: true
            });
            $log.info("Connected to database");
        } catch (err) {
            $log.error(err);
            process.exit(1);
        }
    }

    public static get(key: string) {
        return nconf.get(key);
    }
}
