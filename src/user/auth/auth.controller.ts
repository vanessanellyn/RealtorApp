import { Controller, Post, Get, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto, SigninDto } from './dtos/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(public authService: AuthService) {}

  @Get()
  sigin(){}

  @Post('/signup')
  signup(@Body() body: SignupDto){
    return this.authService.signup(body);
  }

  @Post('/signin')
  signin(@Body() body: SigninDto){
    return this.authService.signin(body);
  }

}
