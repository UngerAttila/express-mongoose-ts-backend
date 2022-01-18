import HttpException from "./HttpException";

export default class ReceptNotFoundException extends HttpException {
    constructor(id: string) {
        super(404, `Recept with id ${id} not found`);
    }
}
