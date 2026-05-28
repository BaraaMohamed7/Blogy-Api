import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import {
  BadRequestException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { CreateUserDTO } from '../dtos/create-user.dto';

/** Users Service - Handles user-related operations */
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>, // Replace 'any' with your User entity repository
  ) {}

  /** Get all users paginated or user by ID */
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

  /** Get user by ID */
  public async findOneById(id: number) {
    let user: User | null = null;
    try {
      user = await this.usersRepository.findOne({
        where: { id },
      });
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process the request at this time. Please try again later.',
        { description: 'Error connecting to the database' },
      );
    }

    if (!user) {
      throw new BadRequestException(
        'User not found, please check the ID and try again',
      );
    }
    return user;
  }

  /** Create a new user */
  public async createUser(createUserDto: CreateUserDTO) {
    let existingUser: User | null = null;

    try {
      existingUser = await this.usersRepository.findOne({
        where: { email: createUserDto.email },
      });
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process the request at this time. Please try again later.',
        { description: 'Error connecting to the database' },
      );
    }

    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    let newUser = this.usersRepository.create(createUserDto);
    try {
      newUser = await this.usersRepository.save(newUser);
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to create user at this time. Please try again later.',
        {
          description: 'Error connecting to the database',
        },
      );
    }
    return newUser;
  }

  public async createMany(createUserDtos: CreateUserDTO[]) {}
}
