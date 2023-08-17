import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from "bcryptjs";
import * as jwt from 'jsonwebtoken';
import { UserType } from '@prisma/client';
import { json } from 'stream/consumers';

interface SignupParams {
  email: string;
  password: string;
  name: string;
  phone: string;
}

interface SigninParams {
  email: string;
  password: string;
}

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService){}

  async signup({email, password, name, phone}: SignupParams) {
    const userExists = await this.prismaService.user.findUnique({
      where: {
        email
      },
    });
    
    if(userExists) throw new ConflictException("Email is already in use.");

    const hashedPassword = await bcrypt.hash(password, 10)

    // Pass the user data to db
    const user = await this.prismaService.user.create({
      data: {
        email,
        name,
        phone,
        password: hashedPassword,
        user_type: UserType.BUYER
      },
    });

    return this.generateJWT(user.name, user.id);
  }

  async signin({email, password}: SigninParams) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email
      }
    })

    const hashedPassword = user.password;
    const isValidPassword = await bcrypt.compare(password, hashedPassword);

    if(!user) throw new HttpException("Invalid credentials", 400);
    if(!isValidPassword)  throw new HttpException("Invalid credentials", 400);

    return this.generateJWT(user.name, user.id);
  }

  private generateJWT(name:string, id:number) {
    return jwt.sign(
      {
        name,
        id
      },
      process.env.JSON_TOKEN_KEY,
      {
        expiresIn: 3600000,
      },
    );
  }
}
