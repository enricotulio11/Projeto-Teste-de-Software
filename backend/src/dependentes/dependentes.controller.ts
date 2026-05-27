import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { AuthenticatedRequest } from '../auth/jwt-auth.guard';
import { DependentesService } from './dependentes.service';
import type { DependentResponse } from './dependentes.service';
import { CreateDependenteDto } from './dto/create-dependente.dto';

@Controller('dependentes')
@UseGuards(JwtAuthGuard)
export class DependentesController {
  constructor(private readonly service: DependentesService) {}

  @Get()
  findAll(@Req() request: AuthenticatedRequest): Promise<DependentResponse[]> {
    return this.service.findAll(request.auth!.sub);
  }

  @Post()
  create(
    @Req() request: AuthenticatedRequest,
    @Body() dto: CreateDependenteDto,
  ): Promise<DependentResponse> {
    return this.service.create(request.auth!.sub, request.auth!.cpf, dto);
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
