import { PatchUserDTO } from './dtos/patch-user.dto';
import { GetUserParamDTO } from './dtos/get-user-param.dto';
import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateUserDTO } from './dtos/create-user.dto';
import { UsersService } from './providers/users.service';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateManyUsersDTO } from './dtos/create-many-users.dto';

/** Users Controller - Handles user-related requests */
@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /** Get user by ID or List of users paginated */
  @ApiOperation({
    summary: 'Get user by ID or List of users paginated',
  })
  @ApiResponse({
    status: 200,
    description: 'User(s) retrieved successfully',
  })
  @ApiQuery({
    name: 'limit',
    type: 'number',
    required: false,
    description: 'Number of users to return per query',
    example: 10,
  })
  @ApiQuery({
    name: 'page',
    type: 'number',
    required: false,
    description: 'Position of the page to return',
    example: 1,
  })
  @Get('{/:id}')
  public getUser(
    @Param() getUserParamDto: GetUserParamDTO,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ) {
    const { id } = getUserParamDto;
    if (id) {
      return this.usersService.findOneById(id);
    }
    return this.usersService.findAllUsers(limit, page);
  }

  /** Create a new user */
  @ApiOperation({
    summary: 'Create a new user',
  })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
  })
  @Post()
  public createUser(@Body() createUserDto: CreateUserDTO) {
    return this.usersService.createUser(createUserDto);
  }

  /** Create multiple users in a single request */
  @ApiOperation({
    summary: 'Create multiple users in a single request',
  })
  @ApiResponse({
    status: 201,
    description: 'The users have been successfully created.',
  })
  @Post('create-many')
  public createManyUsers(@Body() createManyUsersDto: CreateManyUsersDTO) {
    return this.usersService.createMany(createManyUsersDto);
  }

  /** Edit an existing user */
  @ApiOperation({
    summary: 'Edit an existing user',
  })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully updated.',
  })
  @Patch()
  public EditUser(@Body() patchUserDto: PatchUserDTO) {
    console.log(patchUserDto);
    return 'you sent a patch request to users endpoint';
  }

  /** Delete an existing user */
  @ApiOperation({
    summary: 'Delete an existing user',
  })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully deleted.',
  })
  @Delete()
  public deleteUser() {
    return 'you sent a delete request to users endpoint';
  }
}
