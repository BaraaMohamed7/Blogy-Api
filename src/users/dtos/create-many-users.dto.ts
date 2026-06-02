import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';
import { CreateUserDTO } from './create-user.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateManyUsersDTO {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateUserDTO)
  @IsNotEmpty({ each: true })
  @ApiProperty({
    type: 'array',
    required: true,
    description: 'Array of user objects to be created',
    items: {
      type: 'User',
    },
    example: [
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example1.com',
        password: 'Password@123',
      },
      {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example2.com',
        password: 'Password@123',
      },
    ],
  })
  users: CreateUserDTO[];
}
