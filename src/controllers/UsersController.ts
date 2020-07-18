import {Controller, Get, Post} from "@tsed/common";

@Controller("/users")
export class UsersController {
    @Post("/")
    public async saveUser() {}
}
