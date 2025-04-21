
import {
    CanActivate,
    ExecutionContext,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { TokenService } from './../service/token';
import { UserRepository } from 'src/DB/Repository';
import { GqlExecutionContext } from '@nestjs/graphql';



@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private TokenService: TokenService,
        private readonly UserRepository: UserRepository,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {


        if (context["contextType"] == "http") {

            const request = context.switchToHttp().getRequest();

            if (!request.headers.authorization) {
                throw new UnauthorizedException();
            }
            const token = request.headers.authorization?.split(' ')[1] ?? [];
            if (!token) {
                throw new UnauthorizedException("token not found");
            }

            const payload = await this.TokenService.verifyToken(
                token,
                {
                    secret: process.env.JWT_SECRET
                }
            );
            const user = await this.UserRepository.findOne({ email: payload.email })
            if (!user) {
                throw new NotFoundException("user not found");
            }
            request['user'] = user;


        } else if (context["contextType"] === "graphql") {
            const request = GqlExecutionContext.create(context).getContext()


            if (!request.req.headers.authorization) {
                throw new UnauthorizedException("token not found");
            }
            const token = request.req.headers.authorization?.split(' ')[1] ?? [];
            if (!token) {
                throw new UnauthorizedException("token not found");
            }

            const payload = await this.TokenService.verifyToken(
                token,
                {
                    secret: process.env.JWT_SECRET
                }
            );
            const user = await this.UserRepository.findOne({ email: payload.email })
            if (!user) {
                throw new NotFoundException("user not found");
            }
            request.req['user'] = user;


        }
        return true;
    }


}
