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
    BodyParams,
    PathParams
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
    public async updateContactById(
        @PathParams("id") contactId: string,
        @Required() @BodyParams() updatedContact: Contact,
        @Req() req: Req
    ) {
        try {
            const loggedInUser: any = req.headers.user;
            const {error} = JoiContact.getSchema().validate(updatedContact, {
                abortEarly: false,
                allowUnknown: false
            });
            if (error) {
                throw {
                    status: 400,
                    message: error.message
                };
            }
            const contacts = await ContactSchema.findById(contactId);
            if (contacts && contacts.user == loggedInUser.id) {
                contacts.name = updatedContact.name;
                contacts.email = updatedContact.email;
                contacts.phone = updatedContact.phone;
                contacts.save();
            } else {
                throw {
                    status: 404,
                    message: "contact not found"
                };
            }
            return contacts;
        } catch (err) {
            throw err;
        }
    }

    @Delete("/:id")
    public async deleteContactById(
        @PathParams("id") contactId: string,
        @Req() req: Req
    ) {
        try {
            const loggedInUser: any = req.headers.user;
            const contacts = await ContactSchema.findById(contactId);
            if (contacts && contacts.user == loggedInUser.id) {
                await ContactSchema.findByIdAndDelete(contactId);
            } else {
                throw {
                    status: 404,
                    message: "contact not found"
                };
            }
            return contacts;
        } catch (err) {
            throw err;
        }
    }
}
