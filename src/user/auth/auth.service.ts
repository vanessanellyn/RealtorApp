import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from "bcryptjs";
import * as jwt from 'jsonwebtoken';
import { UserType } from '@prisma/client';

interface SignupParams {
  email: string;
  password: string;
  name: string;
  phone: string;
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

    // Generating token for hashing
    const token = await jwt.sign({
      name,
      id: user.id
    }, process.env.JSON_TOKEN_KEY, {
      expiresIn: 3600000
    });

    return token;
  }
}
