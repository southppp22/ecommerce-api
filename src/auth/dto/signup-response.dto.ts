import type { User } from '../../users/entities/user.entity';

export class SignupResponseDto {
  id!: number;
  email!: string;
  name!: string;

  static from(user: User): SignupResponseDto {
    const dto = new SignupResponseDto();
    dto.id = user.id;
    dto.email = user.email;
    dto.name = user.name;
    return dto;
  }
}
