import { Module } from "@nestjs/common";
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtService } from "@nestjs/jwt";
import { OTPModel, userModel } from "src/DB/models";
import { OTPRepositoryService, UserRepository } from "src/DB/Repository";
import { TokenService } from "src/common/service/token";

@Module({
    imports: [userModel, OTPModel],
    controllers: [UserController],
    providers: [UserService, UserRepository, JwtService, TokenService, OTPRepositoryService]
})
export class UserModule { }