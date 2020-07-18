import {Controller, Get, Post, Required, BodyParams} from "@tsed/common";
import UserSchema from "../models/entity/UserSchema";
import {User, JoiUser} from "../models/User";
import {check, validationResult} from "express-validator";
import {BadRequest} from "@tsed/exceptions";
import Joi from "@hapi/joi";
@Controller("/users")
export class UsersController {
    @Post("/")
    public async saveUser(@Required() @BodyParams() user: User) {
        console.log("");
        const {error} = JoiUser.getSchema().validate(user, {
            abortEarly: false,
            allowUnknown: false
        });
        if (error) {
            throw new BadRequest(error.message);
        }
        return user;
    }
}
