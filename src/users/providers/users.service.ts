import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { Injectable } from '@nestjs/common';
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
    const user = await this.usersRepository.findOne({
      where: { id },
    });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  /** Create a new user */
  public async createUser(createUserDto: CreateUserDTO) {
    const { email } = createUserDto;
    const existingUser = await this.usersRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new Error('User with this email already exists');
    }
    let newUser = this.usersRepository.create(createUserDto);
    newUser = await this.usersRepository.save(newUser);
    return newUser;
  }
}
