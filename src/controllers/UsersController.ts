import {BodyParams, Controller, Post, Required, UseAfter} from "@tsed/common";
import {BadRequest, Exception} from "@tsed/exceptions";
import * as bycrypt from "bcrypt";
import UserSchema from "../models/entity/UserSchema";
import {JoiUser, User} from "../models/User";
import ErrorMiddleware from "../middlewares/ErrorMiddleware";
import {sign} from "jsonwebtoken";
import {Config} from "../config/index";
import * as util from "util";
@Controller("/users")
@UseAfter(ErrorMiddleware)
export class UsersController {
    @Post("/")
    public async registerUser(@Required() @BodyParams() user: User) {
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
            const payload = {
                user: {
                    id: userToBeSaved.id
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
