import {Property} from "@tsed/common";
import * as Joi from "@hapi/joi";

export class User {
    @Property()
    name: string;

    @Property()
    email: string;

    @Property()
    password: string;
}

export class JoiUser {
    public static getSchema() {
        return Joi.object().keys({
            name: Joi.string().required(),
            email: Joi.string().required().email(),
            password: Joi.string().required().min(7)
        });
    }
}
