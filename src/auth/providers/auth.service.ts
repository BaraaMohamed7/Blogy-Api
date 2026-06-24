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
import { GenerateTokensProvider } from './generate-tokens.provider';
import { RefreshTokensProvider } from './refresh-tokens.provider';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';
import { MailService } from '../../mail/providers/mail.service';

/** Authentication service for handling user authentication logic */
@Injectable()
export class AuthService {
  /** Constructor to inject dependencies */
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly userservice: UsersService,
    private readonly hashingProvider: HashingProvider,
    private readonly generateTokensProvider: GenerateTokensProvider,
    private readonly refreshTokensProvider: RefreshTokensProvider,
    private readonly mailService: MailService,
  ) {}

  /** Method to handle user sign-in logic */
  @Post('sign-in')
  public async signIn(signInDto: SignInDto) {
    const existingUser = await this.userservice.findOneByEmail(signInDto.email);

    if (!existingUser) {
      throw new UnauthorizedException('Invalid email');
    }

    let isPasswordEqual: boolean;

    if (existingUser.password) {
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
    }

    return await this.generateTokensProvider.generateTokens(existingUser);
  }

  public async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    return await this.refreshTokensProvider.refreshTokens(refreshTokenDto);
  }
}
