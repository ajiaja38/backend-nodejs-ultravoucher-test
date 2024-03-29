import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refreshToken.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async loginHandler(
    @Body() loginDto: LoginDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return this.authService.login(loginDto);
  }

  @Get(':id/refresh-token')
  async getRefreshTokenHandler(
    @Param('id') id: string,
  ): Promise<{ refreshToken: string }> {
    return this.authService.getRefreshTokenByUserId(id);
  }

  @Put('refresh-token')
  async refreshTokenHandler(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.refreshToken(refreshTokenDto);
  }

  @Delete('logout')
  async logoutHandler(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<string> {
    return this.authService.logout(refreshTokenDto);
  }
}
