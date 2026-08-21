import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupRequestDto } from './dto/signup-request.dto';
import type { SignupResponseDto } from './dto/signup-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() dto: SignupRequestDto): Promise<SignupResponseDto> {
    return this.authService.signup(dto);
  }
}
