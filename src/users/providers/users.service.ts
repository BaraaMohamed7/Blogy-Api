import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { AuthService } from '../../auth/providers/auth.service';

@Injectable()
export class UsersService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authSerivce: AuthService,
  ) {}

  public findAllUsers(limit: number, page: number) {
    return [
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
      },
      {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
      },
      {
        firstName: 'Alice',
        lastName: 'Johnson',
        email: 'alice.johnson@example.com',
      },
    ];
  }

  public findUserById(id: number) {
    return {
      id,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
    };
  }
}
