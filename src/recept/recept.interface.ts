import { Types } from "mongoose";
export default interface Recept {
    _id: Types.ObjectId | string;
    author: Types.ObjectId | string;
    receptNev: string;
    discription: string;
    ingredients: string[];
}
