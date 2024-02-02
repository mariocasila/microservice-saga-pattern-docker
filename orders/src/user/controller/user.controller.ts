import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { User } from '../entity/user.entity';
import * as Sentry from '@sentry/node';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  getAllUsers(): Promise<User[]> {
    return this.userService.getAllUsers();
  }

  @Get(':id')
  getUser(@Param('id') id: number): Promise<User> {
    return this.userService.getUser(id);
  }

  @Post()
  createUser(@Body() user: User): Promise<User> {
    return this.userService.createUser(user);
  }

  @Put(':id')
  updateUser(@Body() user: User): Promise<User> {
    try {
      return this.userService.updateUser(user);
    } catch (err) {
      Sentry.captureException(err);
      return Promise.reject(err);
    }
  }
}
