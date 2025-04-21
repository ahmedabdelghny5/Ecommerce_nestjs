
// import { PipeTransform, Injectable, ArgumentMetadata, HttpException } from '@nestjs/common';

// @Injectable()
// export class CustomValidationPipe implements PipeTransform {
//     transform(value: any, metadata: ArgumentMetadata) {
//         console.log({ value, metadata });
//         if (value.password !== value.confirmPassword) {
//             throw new HttpException("Invalid password", 400)
//         }

//         return value;
//     }
// }


import { PipeTransform, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { ZodSchema } from 'zod';

export class ZodValidationPipe implements PipeTransform {
    constructor(private schema: ZodSchema) { }

    transform(value: unknown, metadata: ArgumentMetadata) {
        try {
            const parsedValue = this.schema.parse(value);
            return parsedValue;
        } catch (error) {
            throw new BadRequestException(error);
        }
    }
}
