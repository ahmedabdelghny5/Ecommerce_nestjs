
import { IsDate, IsEmail, IsEnum, IsNotEmpty, IsString, IsStrongPassword, MaxLength, MinLength } from "class-validator";
import { Transform } from "class-transformer";
import { customPasswordDecorator } from "src/common/decorator/customPassword.decorator";
import { UserGender, UserRoles } from "src/common/types/types";


export class SignUpDto {
    @IsString()
    @MinLength(2)
    @MaxLength(10)
    @IsNotEmpty()
    name: string;

    @IsEmail()
    email: string;

    @IsDate()
    @Transform(({ value }) => new Date(value))
    DOB: Date;

    @IsStrongPassword()
    password: string;

    @customPasswordDecorator({ message: "Invalid password" })
    confirmPassword: string;

    @IsEnum(UserRoles)
    role: string
    @IsEnum(UserGender)
    gender: string
    @IsString()
    @IsNotEmpty()
    address: string

    @IsString()
    @MinLength(11)
    @MaxLength(11)
    phone: string
}
export class confirmEmailDto {

    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    otp: string

}