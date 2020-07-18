import * as mongoose from "mongoose";

export interface IUserSchema extends mongoose.Document {
    name: string;
    email: string;
    password: string;
    date: Date;
}
export const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    }
});

const User = mongoose.model<IUserSchema>("user", UserSchema);
export default User;
