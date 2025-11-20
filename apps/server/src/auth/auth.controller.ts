import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/createUser.dto';
import { LoginUserDto } from './dto/loginUser.dto';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { User } from './decorator/user.decorator';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('register')
    register(@Body() createUserDto: CreateUserDto) {
        return this.authService.register(createUserDto);
    }
    @HttpCode(HttpStatus.OK)
    @Post('login')
    login(@Body() loginUserDto: LoginUserDto, @Res({ passthrough: true }) res: Response) {
        return this.authService.login(loginUserDto, res);
    }
    @Get('logout')
    logout(@Res({ passthrough: true }) res: Response) {
        return this.authService.logout(res);
    }
    @UseGuards(AuthGuard('jwt'))
    @Get('check')
    checkAuth(@User() user) {
        console.log("checkAuth user", user);
        return this.authService.checkAuth(user.userId);
    }

}
