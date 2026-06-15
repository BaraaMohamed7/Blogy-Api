import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ActiveUserData } from '../interfaces/active-user-data.interface';
import { REQUEST_USER_KEY } from '../constants/auth.constants';

export const ActiveUser = createParamDecorator(
  (field: keyof ActiveUserData | undefined, ctx: ExecutionContext) => {
    const request = ctx
      .switchToHttp()
      .getRequest<{ [REQUEST_USER_KEY]?: ActiveUserData }>();
    const user: ActiveUserData | undefined = request[REQUEST_USER_KEY];

    if (!user) {
      throw new Error('User not found in request context');
    }

    return field ? user?.[field] : user;
  },
);
