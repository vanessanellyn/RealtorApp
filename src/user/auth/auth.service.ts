import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from "bcryptjs";
import * as jwt from 'jsonwebtoken';
import { UserType } from '@prisma/client';


interface SigninParams {
  email: string;
  password: string;
}

interface SignupParams {
  email: string;
  password: string;
  name: string;
  phone: string;
}

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService){}

  async signup({email, password, name, phone}: SignupParams, userType: UserType) {
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
        user_type: userType
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

  // To identify user as realtor
  generateProductKey(email: string, userType: UserType) {
    const string = `${email}-${userType}-${process.env.PRODUCT_KEY_SECRET}`;

    return bcrypt.hash(string, 10);
  }
}
