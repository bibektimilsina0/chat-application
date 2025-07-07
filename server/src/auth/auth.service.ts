import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/createUser.dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { LoginUserDto } from './dto/loginUser.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwt: JwtService, private config: ConfigService) { }
    async register(createUserDto: CreateUserDto) {
        // Hash the password
        const hashedPassword = await argon.hash(createUserDto.password);
        try {
            const user = await this.prisma.user.create({
                data: {
                    name: createUserDto.name,
                    email: createUserDto.email,
                    password: hashedPassword
                },
                select: {
                    id: true,
                    email: true,
                    createdAt: true,
                    updatedAt: true
                }
            })
            return user;
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new ForbiddenException('Email already exists');
                }
            } else {
                throw error;
            }
        }

    }
    async login(loginUserDto: LoginUserDto, res: Response) {

        // Logic for handling user login
        const user = await this.prisma.user.findUnique({ where: { email: loginUserDto.email } });
        if (!user) {
            throw new ForbiddenException('Email does not exist');
        }
        const passwodMatch = await argon.verify(user.password, loginUserDto.password);
        if (!passwodMatch) {
            throw new ForbiddenException('Incorrect password');
        }

        // return this.signToken(user.id, user.email);
        const access_token = await this.signToken(user.id, user.email);

        // ✅ Set JWT in cookie
        res.cookie('access_token', access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });


        return { message: 'Login successful' };
    }
    async signToken(userId: number, email: string): Promise<String> {
        const payload = {
            sub: userId,
            email: email
        };
        const token = await this.jwt.signAsync(payload, {
            expiresIn: '1h',
            secret: this.config.get('JWT_SECRET')
        });
        return token;
    }
    async logout(res: Response) {
        // Logic for handling user logout
        res.clearCookie('access_token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
        });
        return { message: 'Logout successful' };
    }
    // Add these methods to your AuthService
    async checkAuth(userId: number) {
        // Just verify the user exists
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { id: true } // Minimal data
        });
        if (!user) {
            throw new UnauthorizedException('Invalid user');
        }
        return { authenticated: true };
    }
}
