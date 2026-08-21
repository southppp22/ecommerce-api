import type { Gender } from '../entities/user.entity';

export interface CreateUserDto {
  email: string;
  passwordHash: string;
  name: string;
  gender: Gender;
  birthDate: Date;
  phone: string;
  zipcode: string;
  address1: string;
  address2?: string;
}
