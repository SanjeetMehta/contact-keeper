import {BodyParams, Controller, Post, Required, UseAfter} from "@tsed/common";
import {BadRequest, Exception} from "@tsed/exceptions";
import * as bycrypt from "bcrypt";
import UserSchema from "../models/entity/UserSchema";
import {JoiUser, User} from "../models/User";
import ErrorMiddleware from "../middlewares/ErrorMiddleware";
@Controller("/users")
@UseAfter(ErrorMiddleware)
export class UsersController {
    @Post("/")
    public async saveUser(@Required() @BodyParams() user: User) {
        console.log("");
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
            if (dbUser) {
                throw new BadRequest("User already present");
            }
            const salt = await bycrypt.genSalt(10);
            user.password = await bycrypt.hash(user.password, salt);
            const userToBeSaved = new UserSchema(user);
            userToBeSaved.save();
            return user;
        } catch (err) {
            throw err;
        }
    }
}
