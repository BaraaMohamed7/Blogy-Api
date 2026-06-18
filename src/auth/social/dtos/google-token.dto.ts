import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GoogleTokenDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Google OAuth token obtained from the client',
    example: 'ya29.a0AfH6SMDtX...',
  })
  token: string;
}
