import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { CreateUserDTO } from '../dtos/create-user.dto';
import { User } from '../user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HashingProvider } from '../../auth/providers/hashing.provider';
import { MailService } from '../../mail/providers/mail.service';

@Injectable()
export class CreateUserProvider {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>, // Replace 'any' with your User entity repository
    @Inject(forwardRef(() => HashingProvider))
    private readonly hashingProvider: HashingProvider,
    private readonly mailService: MailService,
  ) {}

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
    let newUser = this.usersRepository.create({
      ...createUserDto,
      password: await this.hashingProvider.hashPassword(createUserDto.password),
    });
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

    void this.mailService.sendUserWelcomeEmail(newUser).catch((error) => {
      console.error('Error sending welcome email:', error);
    });

    return newUser;
  }
}
