import { UsersService } from './../../users/providers/users.service';
import { Injectable, Inject, forwardRef } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly userservice: UsersService,
  ) {}
}
