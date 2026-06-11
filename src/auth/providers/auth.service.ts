import { SignInDto } from '../dtos/sign-in.dto';
import { UsersService } from './../../users/providers/users.service';
import {
  Injectable,
  Inject,
  forwardRef,
  Post,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { HashingProvider } from './hashing.provider';

/** Authentication service for handling user authentication logic */
@Injectable()
export class AuthService {
  /** Constructor to inject dependencies */
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly userservice: UsersService,
    private readonly hashingProvider: HashingProvider,
  ) {}

  /** Method to handle user sign-in logic */
  @Post('sign-in')
  public async signIn(signInDto: SignInDto) {
    const existingUser = await this.userservice.findOneByEmail(signInDto.email);

    if (!existingUser) {
      throw new UnauthorizedException('Invalid email');
    }

    let isPasswordEqual: boolean;

    try {
      isPasswordEqual = await this.hashingProvider.comparePassword(
        signInDto.password,
        existingUser.password,
      );
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'Error comparing passwords',
      });
    }

    if (!isPasswordEqual) {
      throw new UnauthorizedException('Invalid password');
    }
    return {
      message: 'Sign-in successful',
      user: {
        id: existingUser.id,
        email: existingUser.email,
        firstName: existingUser.firstName,
        lastName: existingUser.lastName,
      },
    };
  }
}
