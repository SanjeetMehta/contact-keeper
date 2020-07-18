import {Controller, Get, Post, Put, Delete} from "@tsed/common";

@Controller("/contacts")
export class ContactsController {
    @Get("/")
    public async getContacts() {
        return "hello";
    }

    @Post("/")
    public async addContacts() {
        return "hello";
    }

    @Put("/:id")
    public async updateContactById() {
        return "hello";
    }

    @Delete("/:id")
    public async deleteContactById() {
        return "hello";
    }
}
