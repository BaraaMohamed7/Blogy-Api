import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../../config/jwt.config';
import { type ConfigType } from '@nestjs/config';
import { User } from '../../users/user.entity';
import { ActiveUserData } from '../interfaces/active-user-data.interface';
/** Provider for generating JWT tokens */
@Injectable()
export class GenerateTokensProvider {
  /** Constructor to inject dependencies */
  constructor(
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfigration: ConfigType<typeof jwtConfig>,
  ) {}

  public async signToken<T>(
    userId: number,
    expiresIn: number,
    payload?: T,
  ): Promise<string> {
    return this.jwtService.signAsync(
      {
        sub: userId,
        ...payload,
      },
      {
        secret: this.jwtConfigration.secret,
        audience: this.jwtConfigration.audience,
        issuer: this.jwtConfigration.issuer,
        expiresIn,
      },
    );
  }

  public async generateTokens(user: User): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const [accessToken, refreshToken] = await Promise.all([
      this.signToken<Partial<ActiveUserData>>(
        user.id,
        this.jwtConfigration.access_token_ttl,
        {
          email: user.email,
        },
      ),
      this.signToken(user.id, this.jwtConfigration.refresh_token_ttl),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
