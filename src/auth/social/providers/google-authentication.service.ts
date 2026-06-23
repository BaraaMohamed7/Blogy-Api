import {
  forwardRef,
  Inject,
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import jwtConfig from '../../../config/jwt.config';
import { type ConfigType } from '@nestjs/config';
import { GoogleTokenDto } from '../dtos/google-token.dto';
import { UsersService } from '../../../users/providers/users.service';
import { GenerateTokensProvider } from '../../providers/generate-tokens.provider';

@Injectable()
export class GoogleAuthenticationService implements OnModuleInit {
  private oauthClient: OAuth2Client;
  constructor(
    @Inject(jwtConfig.KEY)
    private readonly jwtConfigration: ConfigType<typeof jwtConfig>,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly generateTokenProvider: GenerateTokensProvider,
  ) {}

  onModuleInit() {
    const clientId = this.jwtConfigration.googleClientId;
    const clientSecret = this.jwtConfigration.googleClientSecret;
    this.oauthClient = new OAuth2Client(clientId, clientSecret);
  }

  public async authenticate(googleTokenDto: GoogleTokenDto) {
    try {
      const loginTicket = await this.oauthClient.verifyIdToken({
        idToken: googleTokenDto.token,
      });

      const payload = loginTicket.getPayload();

      const {
        email,
        sub: googleId,
        given_name: firstName,
        family_name: lastName,
      } = payload!;

      if (!googleId) {
        throw new UnauthorizedException('Invalid Google token');
      }

      if (!email || !firstName || !lastName) {
        throw new UnauthorizedException('Invalid auth data');
      }

      const user = await this.usersService.findOneByGoogleId(googleId);

      if (user) {
        return this.generateTokenProvider.generateTokens(user);
      }
      const newUser = await this.usersService.createGoogleUser({
        email,
        googleId,
        firstName,
        lastName,
      });
      return this.generateTokenProvider.generateTokens(newUser);
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
