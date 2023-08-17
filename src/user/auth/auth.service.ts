import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

interface SignupParams {
  email: string;
  password: string;
  name: string;
  phone: string;
}

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService){}

  async signup({email}: SignupParams) {
    const userExists = await this.prismaService.user.findUnique({
      where: {
        email
      },
    });
    
    if(userExists) throw new ConflictException("Email is already in use.");
  }
}
