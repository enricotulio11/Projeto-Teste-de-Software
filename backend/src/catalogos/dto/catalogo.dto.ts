import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';

export class CreateSpecialtyDto {
  @IsString()
  name: string;
}

export class UpdateSpecialtyDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}

export class CreateLocationDto {
  @IsString()
  name: string;

  @IsString()
  city: string;

  @IsString()
  @Length(2, 2)
  state: string;
}

export class UpdateLocationDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  @Length(2, 2)
  state?: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
