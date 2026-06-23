import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from '../user.entity';
import {
  BadRequestException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { CreateUserDTO } from '../dtos/create-user.dto';
import { UsersCreateManyProvider } from './users-create-many.provider';
import { CreateManyUsersDTO } from '../dtos/create-many-users.dto';
import { CreateUserProvider } from './create-user.provider';
import { CreateGoogleUserProvider } from './create-google-user.provider';
import { GoogleUser } from '../interfaces/google-user.interface';
// import { PaginationProvider } from '../../common/pagination/providers/pagination.provider';

/** Users Service - Handles user-related operations */
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>, // Replace 'any' with your User entity repository
    private readonly usersCreateManyProvider: UsersCreateManyProvider,
    private readonly createUserProvider: CreateUserProvider,
    private readonly createGoogleUserProvider: CreateGoogleUserProvider,
    // private readonly paginationProvider: PaginationProvider,
  ) {}

  /** Get all users paginated or user by ID */
  public findAllUsers(limit: number, page: number) {
    // const users = this.paginationProvider;
    return [{ id: 1, name: 'Baraa' }];
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

  /** Get user by email */
  public async findOneByEmail(email: string) {
    let user: User | null = null;
    try {
      user = await this.usersRepository.findOne({
        where: { email },
      });
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process the request at this time. Please try again later.',
        { description: 'Error connecting to the database' },
      );
    }
    return user;
  }

  public async findOneByGoogleId(googleId: string) {
    let user: User | null = null;
    try {
      user = await this.usersRepository.findOneBy({
        googleId,
      });
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process the request at this time. Please try again later.',
        { description: 'Error connecting to the database' },
      );
    }
    return user;
  }

  /** Create a new user */
  public async createUser(createUserDto: CreateUserDTO) {
    return this.createUserProvider.createUser(createUserDto);
  }

  public async createMany(createManyUsersDto: CreateManyUsersDTO) {
    return this.usersCreateManyProvider.createMany(createManyUsersDto);
  }

  public async createGoogleUser(googleUser: GoogleUser) {
    return this.createGoogleUserProvider.createGoogleUser(googleUser);
  }
}
