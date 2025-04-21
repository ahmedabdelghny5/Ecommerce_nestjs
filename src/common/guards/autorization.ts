
import { Injectable, CanActivate, ExecutionContext, BadRequestException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRoles } from '../types/types';
import { ROLES_KEY } from './../decorator/role.decortaor';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {


        const requiredRoles = this.reflector.get<UserRoles[]>(ROLES_KEY, context.getHandler());


        if (!requiredRoles.length) {
            throw new BadRequestException("roles must be specified")
        }
        let user;
        if (context["contextType"] === "graphql") {
            const request = GqlExecutionContext.create(context).getContext()
            console.log({ user: request.req.user });

             user = request.req.user;
        } else if (context["contextType"] === "http") {
            const request = context.switchToHttp().getRequest();
            console.log({ user: request.user });

             user = request['user'];
        }


        if (!requiredRoles.includes(user.role)) {
            throw new BadRequestException("Unauthorized user")
        }
        return true;
    }
}
