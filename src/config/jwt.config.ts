import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => {
  return {
    secret: process.env.JWT_SECRET,
    audience: process.env.JWT_TOKEN_AUDIENCE,
    issuer: process.env.JWT_TOKEN_ISSUER,
    access_token_ttl: parseInt(process.env.JWT_ACCESS_TOKEN_TTL ?? '3600', 10), // Default to 1 hour if not set
    refresh_token_ttl: parseInt(
      process.env.JWT_REFRESH_TOKEN_TTL ?? '86400',
      10,
    ), // Default to 1 day if not set
  };
});
