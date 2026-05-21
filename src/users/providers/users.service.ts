import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
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
      }
    ];
  }

  public findUserById(id: number) {
    return `You sent a get request to user with id ${id} endpoint`;
  }
}
