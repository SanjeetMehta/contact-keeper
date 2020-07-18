import {Controller, Get, Post} from "@tsed/common";

@Controller("/auth")
export class AuthController {
    @Get("/")
    public async getLoggedInUser() {
        return "hello";
    }

    @Post("/")
    public async getToken() {
        return "hello";
    }
}
