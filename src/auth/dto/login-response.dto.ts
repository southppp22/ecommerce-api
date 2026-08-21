import type { User } from '../../users/entities/user.entity';

export class LoginResponseDto {
  id!: number;
  email!: string;
  name!: string;

  static from(user: User): LoginResponseDto {
    const dto = new LoginResponseDto();
    dto.id = user.id;
    dto.email = user.email;
    dto.name = user.name;
    return dto;
  }
}
