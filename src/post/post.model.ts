import { Schema, model } from "mongoose";
import Post from "./post.interface";

const postSchema = new Schema<Post>(
    {
        author: {
            ref: "User",
            type: Schema.Types.ObjectId,
        },
        content: String,
        title: String,
    },
    { versionKey: false },
);

const postModel = model<Post>("Post", postSchema);

export default postModel;
