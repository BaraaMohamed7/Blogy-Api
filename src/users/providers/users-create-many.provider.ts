import {
  BadRequestException,
  ConflictException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { User } from '../user.entity';
import { DataSource } from 'typeorm';
import { CreateManyUsersDTO } from '../dtos/create-many-users.dto';

/** Users Create Many Provider - Handles bulk user creation with transaction management */
@Injectable()
export class UsersCreateManyProvider {
  /** Constructor to inject the DataSource for database operations */
  constructor(private readonly dataSource: DataSource) {}

  /** Creates multiple users in a single transaction */
  public async createMany(createManyUsersDto: CreateManyUsersDTO) {
    const newUsers: User[] = [];

    const querryRunner = this.dataSource.createQueryRunner();
    try {
      await querryRunner.connect();
      await querryRunner.startTransaction();
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to connect to the database at this time. Please try again later.',
        {
          description: 'Error connecting to the database',
        },
      );
    }

    try {
      for (const user of createManyUsersDto.users) {
        const existingUser = await querryRunner.manager.findOne(User, {
          where: { email: user.email },
        });
        if (existingUser) {
          throw new BadRequestException(
            `User with email ${user.email} already exists`,
          );
        }
        let newUser = querryRunner.manager.create(User, user);
        newUser = await querryRunner.manager.save(newUser);
        newUsers.push(newUser);
      }

      await querryRunner.commitTransaction();
    } catch (error) {
      await querryRunner.rollbackTransaction();
      throw new ConflictException(
        'One or more users could not be created due to a conflict. Please check the input data and try again.',
        { description: String(error) },
      );
    } finally {
      await querryRunner.release();
    }
    return newUsers;
  }
}
