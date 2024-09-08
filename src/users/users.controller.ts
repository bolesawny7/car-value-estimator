import {
    Body,
    Controller,
    Post,
    Get,
    Patch,
    Param,
    Query,
    Delete,
    Session,
    UseGuards
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { updateUserDto } from './dtos/update-user.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './user.entity';
import { AuthGuard } from 'src/guards/auth.guard';

// @UseInterceptors(SerializeInterceptor)
@Controller('auth')
@Serialize(UserDto)
export class UsersController {
    constructor(
        private readonly userService: UsersService,
        private readonly authService: AuthService
    ) { }

    //Session Train
    // @Get('/colors/:color')
    // setColor(@Param('color') color: string, @Session() session: any) {
    //     session.color = color;
    // }
    // @Get('/colors')
    // getColor(@Session() session: any) {
    //     return session.color
    // }

    // @Get('/whoami')
    // WhoAmI(@Session() session: any) {
    //     return this.userService.findOne(session.userId)
    // }
    @Get('/whoami')
    @UseGuards(AuthGuard)
    WhoAmI(@CurrentUser() user: User) {
        return user;
    }
    
    @Post('/signup')
    async createUser(@Body() body: CreateUserDto, @Session() session: any) {
        const user = await this.authService.signup(body.email, body.password);
        session.userId = user.id;
        return user;
    }
    @Post('/signin')
    async signin(@Body() body: CreateUserDto, @Session() session: any) {
        const user = await this.authService.signin(body.email, body.password);
        session.userId = user.id;
        return user;
    }

    @Post('/signout')
    signOut(@Session() session: any) {
        session.userId = null;
    }

    //to exclude the password by using class-transformer 
    // @UseInterceptors(new SerializeInterceptor(UserDto))
    //Function to return the @UseInterceptor() for more clean code
    @Get('/:id')
    findUser(@Param('id') id: string) {
        console.log("Handler is running");
        return this.userService.findOne(parseInt(id));
    }

    @Get()
    getAllUsers(@Query('email') email: string) {
        return this.userService.find(email);
    }

    @Delete('/:id')
    removeUser(@Param('id') id: string) {
        return this.userService.remove(parseInt(id))
    }

    @Patch('/:id')
    updateUser(@Param('id') id: string, @Body() body: updateUserDto) {
        return this.userService.update(parseInt(id), body);
    }
}
