
import { Module, Global } from '@nestjs/common';
import { userModel } from './DB/models';
import { UserRepository } from './DB/Repository';
import { TokenService } from './common/service/token';
import { JwtService } from '@nestjs/jwt';


@Global()
@Module({
    imports: [userModel],
    controllers: [],
    providers: [UserRepository, TokenService, JwtService],
    exports: [UserRepository, TokenService, JwtService, userModel],
})
export class GlobalModule { }
