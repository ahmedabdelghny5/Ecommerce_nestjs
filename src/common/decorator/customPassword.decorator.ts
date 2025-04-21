

import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ async: true })
export class customPasswordDecoratorConstraint implements ValidatorConstraintInterface {
    validate(confirmPassword: string, args: ValidationArguments) {
       
        if (confirmPassword !== args.object[args.constraints[0]]) {
            return false; // password does not match confirmPassword
        }

        return true
    }
}

export function customPasswordDecorator(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,// class
            propertyName: propertyName,// property
            options: validationOptions,//{message: }
            constraints: ['password'],//password
            validator: customPasswordDecoratorConstraint,
        });
    };
}