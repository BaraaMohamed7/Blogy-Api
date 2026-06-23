import { forwardRef, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './providers/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersCreateManyProvider } from './providers/users-create-many.provider';
import { CreateUserProvider } from './providers/create-user.provider';
import { AuthModule } from '../auth/auth.module';
import { CreateGoogleUserProvider } from './providers/create-google-user.provider';
@Module({
  imports: [TypeOrmModule.forFeature([User]), forwardRef(() => AuthModule)],
  controllers: [UsersController],
  providers: [UsersService, UsersCreateManyProvider, CreateUserProvider, CreateGoogleUserProvider],
  exports: [UsersService],
})
export class UsersModule {}
