import {Property} from "@tsed/common";
import * as Joi from "@hapi/joi";

export class Contact {
    @Property()
    name: string;

    @Property()
    email: string;

    @Property()
    phone: string;

    @Property()
    type: string;

    user: any;
}

export class JoiContact {
    public static getSchema() {
        return Joi.object().keys({
            name: Joi.string().required(),
            email: Joi.string().email().optional(),
            phone: Joi.string().optional(),
            type: Joi.string().optional()
        });
    }
}
