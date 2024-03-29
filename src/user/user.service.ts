import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Role, User } from './schema/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/createUser.dto';
import { TimezoneService } from 'src/timezone/timezone.service';
import { UuidService } from 'src/uuid/uuid.service';
import { PaginationResponseInterface } from 'src/utils/interface/pageResponse.interface';
import { MessageService } from 'src/message/message.service';
import { UpdateUserDto } from './dto/updateUser.dto';
import { UpdatePasswordDto } from './dto/updatePassword.dto';
import { LoginDto } from 'src/auth/dto/login.dto';
import { JwtPayloadInterface } from 'src/utils/interface/jwtPayload.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly timezoneService: TimezoneService,
    private readonly idService: UuidService,
    private readonly messageService: MessageService,
  ) {}

  async createUser(createUserDto: CreateUserDto, role: Role): Promise<User> {
    const id: string = this.idService.generateId('user');
    const hashedPassword: string = await bcrypt.hash(
      createUserDto.password,
      12,
    );
    const createdAt: string = this.timezoneService.getTimeZone();
    const updatedAt: string = createdAt;

    if (createUserDto.password !== createUserDto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const schema = {
      id,
      name: createUserDto.name,
      email: createUserDto.email,
      password: hashedPassword,
      role,
      phone: createUserDto.phone,
      createdAt,
      updatedAt,
    };

    const newUser = new this.userModel(schema);

    this.messageService.setMessage('User created successfully');
    return await newUser.save();
  }

  async getAllUsersPagination(
    search: string,
    page: number,
    limit: number,
  ): Promise<PaginationResponseInterface<User>> {
    const regexQuery: RegExp = new RegExp(search, 'i');
    const query = {
      $or: [{ email: regexQuery }, { name: regexQuery }, { phone: regexQuery }],
    };

    const totalData: number = await this.userModel.countDocuments(query);
    const totalPages: number = Math.ceil(totalData / limit);
    const data: User[] = await this.userModel
      .find(query)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    this.messageService.setMessage('Get all users successfully');

    return {
      totalPages,
      page,
      totalData,
      data,
    };
  }

  async getUserById(id: string): Promise<User> {
    const result: User = await this.userModel.findOne({ id });

    if (!result) {
      throw new NotFoundException('User not found');
    }

    this.messageService.setMessage('Get user successfully');
    return result;
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<string> {
    const updatedAt: string = this.timezoneService.getTimeZone();

    const userUpdated = await this.userModel.findOneAndUpdate(
      { id },
      { ...updateUserDto, updatedAt },
      { new: true },
    );

    if (!userUpdated) {
      throw new NotFoundException('User not found');
    }

    this.messageService.setMessage('User updated successfully');
    return `User ${userUpdated.id} updated successfully`;
  }

  async updatePassword(
    id: string,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<User> {
    const updatedAt: string = this.timezoneService.getTimeZone();

    const user: User = await this.userModel.findOne({ id });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!(await bcrypt.compare(updatePasswordDto.oldPassword, user.password))) {
      throw new BadRequestException('Old password is incorrect');
    }

    await this.userModel.updateOne(
      { id },
      { ...updatePasswordDto, updatedAt },
      { new: true },
    );

    this.messageService.setMessage('Password updated successfully');
    return user;
  }

  async deleteUser(id: string): Promise<string> {
    const deletedUser = await this.userModel.findOneAndDelete({ id });

    if (!deletedUser) {
      throw new NotFoundException('User not found');
    }

    this.messageService.setMessage('User deleted successfully');
    return `User ${deletedUser.name} deleted successfully`;
  }

  async validateCredentials(loginDto: LoginDto): Promise<JwtPayloadInterface> {
    const user: User = await this.userModel.findOne({ email: loginDto.email });

    if (!user) {
      throw new NotFoundException('Your email or password is incorrect');
    }

    const isMatch: boolean = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isMatch) {
      throw new NotFoundException('Your email or password is incorrect');
    }

    return {
      id: user.id,
      name: user.name,
      role: user.role,
    };
  }
}
