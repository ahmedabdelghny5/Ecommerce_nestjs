import { Type } from "class-transformer"
import { IsNotEmpty, IsNumber, IsPositive, IsString, Length, Max, Min, Validate, ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator"

@ValidatorConstraint({ async: true })
export class IsToDateAfterFromDateConstraint implements ValidatorConstraintInterface {
    validate(toDate: any, args: ValidationArguments) {
        if (toDate < args.object["fromDate"]) {
            return false
        }
        return true
    }
    defaultMessage(validationArguments?: ValidationArguments): string {
        return "toDate must be after fromDate"
    }
}

@ValidatorConstraint({ async: true })
export class IsFromDateInFutureConstraint implements ValidatorConstraintInterface {
    validate(fromDate: any, args: ValidationArguments) {

        return fromDate >= new Date()
    }
    defaultMessage(validationArguments?: ValidationArguments): string {
        return "fromDate must be in the future"
    }
}

export class createCouponDto {

    @IsString()
    @IsNotEmpty()
    @Length(1, 10)
    code: string


    @Type(() => Number)
    @IsNotEmpty()
    @IsPositive()
    @Min(1)
    @Max(100)
    @IsNumber()
    amount: number

    @Type(() => Date)
    @IsNotEmpty()
    @Validate(IsFromDateInFutureConstraint)
    fromDate: Date

    @Type(() => Date)
    @IsNotEmpty()
    @Validate(IsToDateAfterFromDateConstraint)
    toDate: Date

}
