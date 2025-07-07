import { IsEmail,IsNotEmpty, IsString, MinLength } from "class-validator";

export class LoginUserDto {
    @IsEmail()
    @IsNotEmpty()
    @IsString()
    email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password: string;
}