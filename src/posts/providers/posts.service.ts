import { UsersService } from './../../users/providers/users.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PostsService {
  constructor(private readonly usersService: UsersService) {}
  public findAllPosts(userId: string) {
    const user = this.usersService.findUserById(Number(userId));

    return [
      {
        user,
        title: 'Post 1',
        content: 'Content of post 1',
      },
      {
        user,
        title: 'Post 2',
        content: 'Content of post 2',
      },
    ];
  }
}
