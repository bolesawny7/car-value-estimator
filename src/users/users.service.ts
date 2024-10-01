import { BadRequestException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { User } from './user.entity';
import { customException } from '../shared/customException';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private repo: Repository<User>) { }

    create(email: string, password: string) {
        const user = this.repo.create({ email, password })
        return this.repo.save(user)
    }

    async findOne(id: number) {
        // if (!id) throw new customException("id not provided", HttpStatus.BAD_REQUEST);
        // if (!id) return null;
        const user = await this.repo.findOne({ where: { id } });
        if (!user) throw new NotFoundException('User Not Found')
        return user
    }

    async find(email?: string): Promise<User[]> {
        if (email) {
            const users: User[] = await this.repo.find({ where: { email: Like(`%${email}%`) } });
            // if (users.length == 0) throw new NotFoundException('No Such email Found')
            return users
        } else return await this.repo.find();
    }

    async update(id: number, attrs: Partial<User>) {
        //didn't choose to use the .update() function so I can use the hooks
        const user = await this.findOne(id);
        if (!user) throw new NotFoundException('user not found')
        Object.assign(user, attrs);
        return this.repo.save(user)
    }

    async remove(id: number) {
        const user = await this.findOne(id);
        if (!user) throw new NotFoundException('user not found')
        return this.repo.remove(user)
    }
}
