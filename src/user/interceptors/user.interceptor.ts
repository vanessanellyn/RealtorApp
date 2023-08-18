import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

export class UserInterceptor implements NestInterceptor {
  async intercept(
    context: ExecutionContext, // Gives info about the request
    handler: CallHandler       // Allows us to reach the route handler
  ) {
    const request = context.switchToHttp().getRequest();
    const token = request?.headers?.authorization?.split("Bearer ")[1];
    const user = await jwt.decode(token);
    request.user = user;

    return handler.handle(); // Any code inside the handler will be intercepting the request
  }
}