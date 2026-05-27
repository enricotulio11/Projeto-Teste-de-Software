import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AdminGuard } from '../auth/admin.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { AuthenticatedRequest } from '../auth/jwt-auth.guard';
import { AdminService } from './admin.service';
import type {
  AdminPersonResponse,
  DashboardResponse,
  SecurityLogResponse,
  SettingsResponse,
} from './admin.service';
import { UpdateSettingsDto, UpdateUserStatusDto } from './dto/admin.dto';

@Controller('admin')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminController {
  constructor(private readonly service: AdminService) {}

  @Get('usuarios')
  users(): Promise<AdminPersonResponse[]> {
    return this.service.listUsers();
  }

  @Patch('usuarios/:id/status')
  updateStatus(
    @Req() request: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() dto: UpdateUserStatusDto,
  ): Promise<AdminPersonResponse> {
    return this.service.updateStatus(
      request.auth!.sub,
      request.auth!.cpf,
      id,
      dto,
    );
  }

  @Patch('usuarios/:id/pin')
  resetPin(
    @Req() request: AuthenticatedRequest,
    @Param('id') id: string,
  ): Promise<{ pin: string }> {
    return this.service.resetPin(request.auth!.sub, request.auth!.cpf, id);
  }

  @Get('logs')
  logs(): Promise<SecurityLogResponse[]> {
    return this.service.listLogs();
  }

  @Get('configuracoes')
  settings(): Promise<SettingsResponse> {
    return this.service.getSettings();
  }

  @Patch('configuracoes')
  updateSettings(@Body() dto: UpdateSettingsDto): Promise<SettingsResponse> {
    return this.service.updateSettings(dto);
  }

  @Get('dashboard')
  dashboard(): Promise<DashboardResponse> {
    return this.service.dashboard();
  }
}
