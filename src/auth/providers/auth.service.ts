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
import { JwtService } from '@nestjs/jwt';
import { type ConfigType } from '@nestjs/config';
import jwtConfig from '../../config/jwt.config';

/** Authentication service for handling user authentication logic */
@Injectable()
export class AuthService {
  /** Constructor to inject dependencies */
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly userservice: UsersService,
    private readonly hashingProvider: HashingProvider,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfigration: ConfigType<typeof jwtConfig>,
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

    const accessToken = await this.jwtService.signAsync(
      {
        sub: existingUser.id,
        email: existingUser.email,
      },
      {
        secret: this.jwtConfigration.secret,
        expiresIn: this.jwtConfigration.ttl,
        audience: this.jwtConfigration.audience,
        issuer: this.jwtConfigration.issuer,
      },
    );
    return {
      message: 'Sign-in successful',
      user: {
        id: existingUser.id,
        email: existingUser.email,
        firstName: existingUser.firstName,
        lastName: existingUser.lastName,
      },
      accessToken,
    };
  }
}
