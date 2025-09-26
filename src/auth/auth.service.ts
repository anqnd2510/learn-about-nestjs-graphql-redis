import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { LoginDto, RegisterDto } from 'src/user/dto/auth.dto';
import { hash, compare } from 'bcrypt';
import { loginResponse } from './models/auth.model';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(userData: RegisterDto): Promise<User> {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: userData.email,
      },
    });
    if (user) {
      throw new HttpException(
        { message: 'Email has been used' },
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashPass = await hash(userData.password, 10);

    const result = await this.prismaService.user.create({
      data: { ...userData, password: hashPass },
    });
    return result;
  }

  async login(userData: LoginDto): Promise<loginResponse> {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: userData.email,
      },
    });
    if (!user) {
      throw new HttpException(
        { message: 'Account not found' },
        HttpStatus.UNAUTHORIZED,
      );
    }
    const verify = await compare(userData.password, user?.password);
    if (!verify) {
      throw new HttpException(
        { message: 'Incorrect password!' },
        HttpStatus.UNAUTHORIZED,
      );
    }
    const payload = {
      id: user.id,
      name: user.username,
      email: user.email,
    };
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.ACCESS_TOKEN_KEY,
      expiresIn: '7d',
    });
    return { accessToken };
  }
}
