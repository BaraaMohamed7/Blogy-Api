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

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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
      return this.usersService.findUserById(id);
    }
    return this.usersService.findAllUsers(limit, page);
  }

  @Post()
  public createUser(@Body() createUserDto: CreateUserDTO) {
    console.log(createUserDto);
    console.log(typeof createUserDto);
    return 'you sent a post request to users endpoint';
  }

  @Patch()
  public EditUser(@Body() patchUserDto: PatchUserDTO) {
    console.log(patchUserDto);
    return 'you sent a patch request to users endpoint';
  }

  @Delete()
  public deleteUser() {
    return 'you sent a delete request to users endpoint';
  }
}
