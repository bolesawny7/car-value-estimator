import { Test } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { UsersService } from "./users.service";
import { User } from "./user.entity";
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { emitWarning } from "process";

describe('AuthService', () => {
    let service: AuthService;
    let fakeUsersService: Partial<UsersService>;

    beforeEach(async () => {
        const users: User[] = [];
        //create fake copy of users service
        //partial to not define every method but if we define a method we should define it correctly
        fakeUsersService = {
            find: (email: string) => {
                const filteredUsers = users.filter(user => user.email === email)
                return Promise.resolve(filteredUsers)
            },
            create: (email: string, password: string) => {
                const user = {
                    id: Math.floor(Math.random() * 99999),
                    email,
                    password
                } as User
                users.push(user)
                return Promise.resolve({ id: 1, email, password } as User)
            }
        }
        const module = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    //ovverride the actual usersservice dependency with this fake object
                    provide: UsersService,
                    useValue: fakeUsersService
                }
            ]
        }).compile();
        //di container will create instance of authservice with all of its dependencies
        service = module.get(AuthService);

    })

    // it('can create an instance of auth service', async () => {
    //     make sure that we successfully created this service here
    //     expect(service).toBeDefined();
    // })

    it('creates a new user with a salted and and hashed password', async () => {
        const user = await service.signup('asdf@asdf.com', 'asdf')
        expect(user.password).not.toEqual('asdf')
        const [salt, hash] = user.password.split('.')
        expect(salt).toBeDefined()
        expect(hash).toBeDefined()
    })


    it('throws an error if user signs up with email that is already in use', async () => {
        await service.signup('asdf@asdf.com', 'asdf');
        await expect(service.signup('asdf@asdf.com', 'asdf')).rejects.toThrow(
            BadRequestException,
        );
    });

    it("throws if signin is called with an unused email", async () => {
        await expect(service.signin("asdf", "asdf")).rejects.toThrow(
            NotFoundException,
        )
    })

    it('throws if an invalid password is provided', async () => {
        await service.signup("laskdjf@alskdfj.com", "123456")
        await expect(
            service.signin('laskdjf@alskdfj.com', 'password'),
        ).rejects.toThrow(BadRequestException);
    });

    it('returns a user if correct password is provided', async () => {
        await service.signup("asdf@asdf.com", "testPassword")
        const user = await service.signin('asdf@asdf.com', 'testPassword');
        expect(user).toBeDefined();
    });


})
