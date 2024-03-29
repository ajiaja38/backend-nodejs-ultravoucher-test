import { Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { TokenManagerService } from './token-manager.service';
import { MessageService } from 'src/message/message.service';
import { LoginDto } from './dto/login.dto';
import { JwtPayloadInterface } from 'src/utils/interface/jwtPayload.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Auth } from './schema/auth.schema';
import { Model } from 'mongoose';
import { RefreshTokenDto } from './dto/refreshToken.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Auth.name)
    private readonly authModel: Model<Auth>,
    private readonly tokenManagerService: TokenManagerService,
    private readonly userService: UserService,
    private readonly messageService: MessageService,
  ) {}

  async login(
    loginDto: LoginDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user: JwtPayloadInterface =
      await this.userService.validateCredentials(loginDto);

    const accessToken: string =
      await this.tokenManagerService.generateAccessToken(user);
    const refreshToken: string =
      await this.tokenManagerService.generateRefreshToken(user);

    const saveRefreshToken = new this.authModel({
      userId: user.id,
      refreshToken,
      expiredIn: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    saveRefreshToken.save();

    this.messageService.setMessage('Login successfully');
    return { accessToken, refreshToken };
  }

  async refreshToken(
    refreshTokenDto: RefreshTokenDto,
  ): Promise<{ accessToken: string }> {
    const auth: Auth = await this.authModel.findOne({
      refreshToken: refreshTokenDto.refreshToken,
    });

    if (!auth) {
      throw new NotFoundException('Refresh token not found');
    }

    const accessToken: string =
      await this.tokenManagerService.verifyRefreshToken(auth.refreshToken);

    this.messageService.setMessage('Refresh access token successfully');
    return {
      accessToken,
    };
  }

  async logout(refreshTokenDto: RefreshTokenDto): Promise<string> {
    const deletedAuth = await this.authModel.findOneAndDelete({
      refreshToken: refreshTokenDto.refreshToken,
    });

    if (!deletedAuth) {
      throw new NotFoundException('Refresh token not found');
    }

    this.messageService.setMessage('Logout successfully');
    return 'Logout successfully';
  }

  async getRefreshTokenByUserId(
    userId: string,
  ): Promise<{ refreshToken: string }> {
    const auth: Auth = await this.authModel.findOne({ userId });

    if (!auth) {
      throw new NotFoundException('Refresh token not found');
    }

    return { refreshToken: auth.refreshToken };
  }
}
