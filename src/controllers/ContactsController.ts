import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    UseBefore,
    Req,
    UseAfter,
    Required,
    BodyParams
} from "@tsed/common";
import {TokenValidator} from "../middlewares/TokenValidator";
import ContactSchema from "../models/entity/ContactSchema";
import UserSchema from "../models/entity/UserSchema";
import ErrorMiddleware from "../middlewares/ErrorMiddleware";
import {Contact, JoiContact} from "../models/Contact";
@Controller("/contacts")
@UseBefore(TokenValidator)
@UseAfter(ErrorMiddleware)
export class ContactsController {
    @Get("/")
    public async getContacts(@Req() req: Req) {
        try {
            const loggedInUser: any = req.headers.user;
            const contacts = await ContactSchema.find({
                user: loggedInUser.id
            }).sort({date: -1});
            return contacts;
        } catch (err) {
            throw err;
        }
    }

    @Post("/")
    public async addContacts(
        @Required() @BodyParams() contact: Contact,
        @Req() req: Req
    ) {
        try {
            const loggedInUser: any = req.headers.user;
            const {error} = JoiContact.getSchema().validate(contact, {
                abortEarly: false,
                allowUnknown: false
            });
            if (error) {
                throw {
                    status: 400,
                    message: error.message
                };
            }
            contact.user = loggedInUser.id;
            const contacts = await new ContactSchema(contact);
            contacts.save();
            return contacts;
        } catch (err) {
            throw err;
        }
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
