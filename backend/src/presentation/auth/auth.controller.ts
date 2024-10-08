import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Res,
  UseFilters,
} from '@nestjs/common';
import { AuthService } from 'src/application/services/auth.service';
import { RegisterDto } from '../../application/dto/auth/register.dto';
import { LoginDto } from '../../application/dto/auth/login.dto';
import { Response } from 'express';
import { EmailService } from 'src/application/services/email.service';
import { QueryExceptionFilter } from 'src/common/filters/query-exception.filter';

@Controller('auth')
@UseFilters(QueryExceptionFilter)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly emailService: EmailService,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    try {
      const { accessToken, user } = await this.authService.login(loginDto);
      response.cookie('token', accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 60 * 60 * 1000,
      });

      return { message: 'Login Successfully', user };
    } catch (error) {
      throw error;
    }
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('token', {
      httpOnly: true,
      secure: true,
      sameSite: 'none'
    });

    return { message: 'Logout successful' };
  }

  @Get('verify-email')
  @HttpCode(HttpStatus.OK)
  async verifyEmail(@Query('token') token: string) {
    try {
      const response = await this.emailService.verifyEmail(token);
      return response;
    } catch (error) {
      throw error;
    }
  }
}
