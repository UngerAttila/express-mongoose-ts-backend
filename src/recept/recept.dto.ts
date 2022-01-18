import { IsArray, IsString } from "class-validator";

export default class CreatePostDto {
    @IsString()
    public receptNev: string;

    @IsString()
    public discription: string;

    @IsArray()
    public ingredients: string[];
}
