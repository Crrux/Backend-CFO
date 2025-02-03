import {
  IsBoolean,
  IsEmail,
  IsString,
  MinLength,
  Equals,
  IsMobilePhone,
  Matches,
  IsOptional,
} from 'class-validator';

export class SendFormDto {
  @IsString()
  @MinLength(3)
  name: string;
  @IsString()
  @MinLength(3)
  firstname: string;
  @IsString()
  @IsEmail()
  email: string;
  @IsString()
  @Matches(
    /^(?:\+?\d{1,3})?[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}[-.\s]?\d{3,4}$/,
  )
  tel: string;
  @IsString()
  @MinLength(3)
  message: string;
  @IsBoolean()
  @Equals(true)
  checkbox: boolean;

  @IsOptional()
  reference: string;
}
