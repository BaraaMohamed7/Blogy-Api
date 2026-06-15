import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './providers/auth.service';
import { SignInDto } from './dtos/sign-in.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Auth } from './decorators/auth.decorator';
import { AuthType } from './enums/auth-type.enum';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /** Method to handle user sign-in */
  @Auth(AuthType.None)
  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'User Sign-In',
    description: 'Authenticate a user and return user details',
  })
  @ApiResponse({
    status: 200,
    description: 'Sign-in successful',
  })
  public async signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }
}
