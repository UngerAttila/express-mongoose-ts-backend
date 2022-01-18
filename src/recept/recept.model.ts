import { Schema, model } from "mongoose";
import Recept from "./recept.interface";

const receptSchema = new Schema<Recept>(
    {
        author: {
            ref: "User",
            type: Schema.Types.ObjectId,
        },
        receptNev: String,
        discription: String,
        ingredients: Array,
    },
    { versionKey: false },
);

const receptModel = model<Recept>("Recept", receptSchema);

export default receptModel;
