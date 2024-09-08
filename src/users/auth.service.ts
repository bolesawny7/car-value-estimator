import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { UsersService } from "./users.service";
//change callback based functions to promise based
import { promisify } from "util";
import { randomBytes, scrypt as _scrypt } from "crypto";

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
    constructor(private readonly userService: UsersService) { }

    async signup(email: string, password: string) {
        //email already in use?
        const users = await this.userService.find(email);
        if (users.length) throw new BadRequestException("email already in use")
        //hash user password
        //generate a salt
        const salt = randomBytes(8).toString('hex');
        //hash the salt and password together
        const hash = (await scrypt(password, salt, 32)) as Buffer
        //join the hashed result and the salt together 
        //change buffer (array of random bytes to characters)
        const result = salt + '.' + hash.toString('hex');
        //create new user and save it
        const user = await this.userService.create(email, result);
        //return user
        return user
    }

    async signin(email: string, password: string) {
        // get the only user inside the returned array
        const [user] = await this.userService.find(email);
        if (!user) throw new NotFoundException("User Not Found")
        const [salt, stored] = user.password.split('.');
        const hash = (await scrypt(password, salt, 32)) as Buffer;
        if (stored !== hash.toString('hex')) {
            throw new BadRequestException('bad password')
        } else {
            return user;
        }
    }
}