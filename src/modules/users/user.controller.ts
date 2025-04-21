import { Body, Controller, Get, HttpCode, Patch, Post, UsePipes, ValidationPipe } from "@nestjs/common";
import { UserService } from './user.service';
import { confirmEmailDto, SignUpDto } from "./DTO/user.dto";
import { UserDocument } from "src/DB/models";
import { UserDecorator } from "src/common/decorator/user.decorator";
import { Auth } from "src/common/decorator/auth.decorator";
import { UserRoles } from "src/common/types/types";


@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) { }


    @Post('signup')
    @UsePipes(new ValidationPipe())
    signup(@Body() body: SignUpDto): any {
        return this.userService.signup(body);
    }


    @Patch('confirmEmail')
    @UsePipes(new ValidationPipe())
    confirmEmail(@Body() body: confirmEmailDto): any {
        return this.userService.confirmEmail(body);
    }

    @Post('signin')
    @HttpCode(200)
    signin(@Body() body: any): any {
        return this.userService.signin(body);
    }


    @Auth(UserRoles.admin)
    @Get('profile')
    @HttpCode(200)
    profile(@UserDecorator() user: UserDocument): any {
        return { user }
    }


}