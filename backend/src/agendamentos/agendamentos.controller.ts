import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { AuthenticatedRequest } from '../auth/jwt-auth.guard';
import { AgendamentosService } from './agendamentos.service';
import type { AppointmentResponse } from './agendamentos.service';
import {
  CreateAgendamentoDto,
  UpdateAgendamentoDto,
} from './dto/agendamento.dto';

@Controller('agendamentos')
@UseGuards(JwtAuthGuard)
export class AgendamentosController {
  constructor(private readonly service: AgendamentosService) {}

  @Get()
  findAll(
    @Req() request: AuthenticatedRequest,
  ): Promise<AppointmentResponse[]> {
    return this.service.findAll(request.auth!.sub);
  }

  @Post()
  create(
    @Req() request: AuthenticatedRequest,
    @Body() dto: CreateAgendamentoDto,
  ): Promise<AppointmentResponse> {
    return this.service.create(request.auth!.sub, request.auth!.cpf, dto);
  }

  @Patch(':id')
  update(
    @Req() request: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() dto: UpdateAgendamentoDto,
  ): Promise<AppointmentResponse> {
    return this.service.update(request.auth!.sub, request.auth!.cpf, id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(
    @Req() request: AuthenticatedRequest,
    @Param('id') id: string,
  ): Promise<void> {
    return this.service.remove(request.auth!.sub, request.auth!.cpf, id);
  }
}
