import {
  IsBoolean,
  IsInt,
  IsIn,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class UpdateUserStatusDto {
  @IsIn(['active', 'inactive'])
  status: 'active' | 'inactive';
}

export class UpdateSettingsDto {
  @IsOptional()
  @IsString()
  systemName?: string;

  @IsOptional()
  @IsBoolean()
  maintenanceMode?: boolean;

  @IsOptional()
  @IsBoolean()
  allowRegistrations?: boolean;

  @IsOptional()
  @IsBoolean()
  emailNotifications?: boolean;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(20)
  maxDependentsPerUser?: number;

  @IsOptional()
  @IsInt()
  @Min(5)
  @Max(120)
  sessionTimeout?: number;

  @IsOptional()
  @IsBoolean()
  enableSecurityLogs?: boolean;

  @IsOptional()
  @IsBoolean()
  requireStrongPasswords?: boolean;
}
