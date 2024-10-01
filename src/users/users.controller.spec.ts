import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { NotFoundError } from 'rxjs';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      find: (email: string) => {
        return Promise.resolve([{ email } as User])
      },
      findOne: (id: number) => {
        return Promise.resolve({ id, email: "asdf", password: "asdf" } as User)
      },
      remove: (id: number) => {
        return Promise.resolve({ id, email: "asdf", password: "asdf" } as User)
      },
      update: (id: number, body: Partial<User>) => {
        const user = fakeUsersService.findOne(id)
        Object.assign(user, body)
        return Promise.resolve(user)
      }
    }

    fakeAuthService = {
      // signup: () => { },
      signin: (email: string, password: string) => {
        return Promise.resolve({ id: 1, email, password } as User)
      },
    }
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: AuthService,
          useValue: fakeAuthService
        },
        {
          provide: UsersService,
          useValue: fakeUsersService
        }
      ]
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it("getAllUsers returns a list of users with a given email", async () => {
    const users = await controller.getAllUsers('a@a.com')
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('a@a.com');
  })

  it('findUser returns a single user with a given id', async () => {
    const user = await controller.findUser('1');
    expect(user).toBeDefined();
  })

  it('findUser throws an error if user with given id is not found', async () => {
    fakeUsersService.findOne = () => null
    await expect(controller.findUser('1')).rejects.toThrow(NotFoundException);
  })

  it('signIn updates session object and returns user', async () => {
    const session = {userId: 0};
    const user = await controller.signin({email: 'asdf', password: '123'}, session);
    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(1);
  })
});
