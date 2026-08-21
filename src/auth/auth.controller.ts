import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CurrentAuthSession } from './decorators/current-auth-session.decorator';
import type { AuthSession } from './session/auth-session';
import { SignupRequestDto } from './dto/signup-request.dto';
import type { SignupResponseDto } from './dto/signup-response.dto';
import { LoginRequestDto } from './dto/login-request.dto';
import type { LoginResponseDto } from './dto/login-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() dto: SignupRequestDto): Promise<SignupResponseDto> {
    return this.authService.signup(dto);
  }

  @Post('login')
  login(
    @Body() dto: LoginRequestDto,
    @CurrentAuthSession() session: AuthSession,
  ): Promise<LoginResponseDto> {
    return this.authService.login(dto, session);
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  logout(@CurrentAuthSession() session: AuthSession): Promise<void> {
    return this.authService.logout(session);
  }
}
