import { HttpException, HttpStatus } from "@nestjs/common";

export class customException extends HttpException {
    constructor(message: string, statusCode: HttpStatus) {
        super(message, statusCode);
    }
}