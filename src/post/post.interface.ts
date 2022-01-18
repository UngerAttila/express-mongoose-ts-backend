import { Types } from "mongoose";
export default interface Post {
    _id: Types.ObjectId | string;
    author: Types.ObjectId | string;
    content: string;
    title: string;
}
