import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core'; 
import * as jwt from 'jsonwebtoken';
import { PrismaService } from 'src/prisma/prisma.service';

interface JWTPayload {
  name: string;
  id: number;
  iat: number;
  exp: number;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,  // Allows us to access metadata
    private readonly prismaService: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const roles = this.reflector.getAllAndOverride('roles', [ 
      // Where do we want to get the metadata?
      context.getHandler(),
      context.getClass(),
    ]);

    // If there are no roles, you don't need to be authenticated
    if (roles?.length) {
      const request = context.switchToHttp().getRequest();
      const token = request.headers?.authorization?.split('Bearer ')[1];
      try {
        // Verify the token
        const payload = (await jwt.verify(
          token,
          process.env.JSON_TOKEN_KEY,
        )) as JWTPayload;

        const user = await this.prismaService.user.findUnique({
          where: {
            id: payload.id,
          },
        });

        if (!user) return false;
        if (roles.includes(user.user_type)) return true;

        return false;
        
      } catch (error) {
        return false;
      }
    }

    return true;
  }
}

/*
  1. Detemine the UserTypes that can execute the called endpoint
  2. Grab the JWT from the request header and verify it
  3. Database request to get user by ID
  4. Determine if the user has permission
*/