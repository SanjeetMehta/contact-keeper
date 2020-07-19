import * as mongoose from "mongoose";

export interface IContactSchema extends mongoose.Document {
    user: any;
    name: string;
    email: string;
    phone: string;
    type: string;
    date: Date;
}
export const ContactSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String
    },
    type: {
        type: String,
        default: "personal"
    },
    date: {
        type: Date,
        default: Date.now()
    }
});

const User = mongoose.model<IContactSchema>("contact", ContactSchema);
export default User;
