import {
  IsArray,
  IsDateString,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { Gender } from '../../users/entities/user.entity';

export class SignupRequestDto {
  @IsEmail()
  email!: string;

  @IsString()
  @Length(8, 64)
  password!: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  name!: string;

  @IsEnum(Gender)
  gender!: Gender;

  /** ISO 8601 날짜 (YYYY-MM-DD) */
  @IsDateString()
  birthDate!: string;

  /** 숫자만, 하이픈 제거된 형태 (01012345678) */
  @Matches(/^01[016789]\d{7,8}$/, {
    message: 'phone은 하이픈 없는 휴대폰 번호여야 합니다',
  })
  phone!: string;

  @IsString()
  @Length(5, 10)
  zipcode!: string;

  @IsString()
  @IsNotEmpty()
  address1!: string;

  @IsOptional()
  @IsString()
  address2?: string;

  /** 동의한 약관 버전 id 목록 (terms.id) */
  @IsArray()
  @IsInt({ each: true })
  agreedTermsIds!: number[];
}
