import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CurrentAuthSession } from './decorators/current-auth-session.decorator';
import type { AuthSession } from './session/auth-session';
import { SignupRequestDto } from './dto/signup-request.dto';
import { SignupResponseDto } from './dto/signup-response.dto';
import { LoginRequestDto } from './dto/login-request.dto';
import { LoginResponseDto } from './dto/login-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() dto: SignupRequestDto): Promise<SignupResponseDto> {
    const user = await this.authService.signup(dto);
    return SignupResponseDto.from(user);
  }

  @Post('login')
  async login(
    @Body() dto: LoginRequestDto,
    @CurrentAuthSession() session: AuthSession,
  ): Promise<LoginResponseDto> {
    const user = await this.authService.login(dto, session);
    return LoginResponseDto.from(user);
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  logout(@CurrentAuthSession() session: AuthSession): Promise<void> {
    return this.authService.logout(session);
  }
}
