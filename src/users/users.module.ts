import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';

@Module({
  providers: [UsersService],
  controllers: [UsersController],
  //creating the repository
  imports: [TypeOrmModule.forFeature([User])]
})
export class UsersModule {}
