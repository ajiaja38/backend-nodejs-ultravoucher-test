import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/createUser.dto';
import { Role, User } from './schema/user.schema';
import { PaginationResponseInterface } from 'src/utils/interface/pageResponse.interface';
import { UpdateUserDto } from './dto/updateUser.dto';
import { UpdatePasswordDto } from './dto/updatePassword.dto';
import { JwtAuthGuard } from 'src/utils/guard/auth.guard';
import { RoleGuard } from 'src/utils/guard/role.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUserHandler(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.userService.createUser(createUserDto, Role.USER);
  }

  @Post('admin')
  async createAdminHandler(
    @Body() createUserDto: CreateUserDto,
  ): Promise<User> {
    return await this.userService.createUser(createUserDto, Role.ADMIN);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RoleGuard)
  async getAllUserHandler(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
    @Query('search') search: string,
  ): Promise<PaginationResponseInterface<User>> {
    return await this.userService.getAllUsersPagination(search, page, limit);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getUserByIdHandler(@Param('id') id: string): Promise<User> {
    return await this.userService.getUserById(id);
  }

  @Put(':id')
  async updateUserHandler(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<string> {
    return await this.userService.updateUser(id, updateUserDto);
  }

  @Put(':id/password')
  async updatePasswordHandler(
    @Param('id') id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ): Promise<User> {
    return await this.userService.updatePassword(id, updatePasswordDto);
  }

  @Delete(':id')
  async deleteUserHandler(@Param('id') id: string): Promise<string> {
    return await this.userService.deleteUser(id);
  }
}
