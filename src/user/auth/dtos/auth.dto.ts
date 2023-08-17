import { IsString, IsNotEmpty, IsEmail, MinLength, Matches } from "class-validator";

export class SignupDto {
  @IsString()
  @IsNotEmpty()
  name: string;   
  
  @Matches(/^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/, {message: 'phone must be valid'})
  @IsNotEmpty()
  phone: string;  

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(5)
  password: string;
}