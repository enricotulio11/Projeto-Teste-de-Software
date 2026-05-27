import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AdminGuard } from '../auth/admin.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CatalogosService } from './catalogos.service';
import type { LocationResponse, SpecialtyResponse } from './catalogos.service';
import {
  CreateLocationDto,
  CreateSpecialtyDto,
  UpdateLocationDto,
  UpdateSpecialtyDto,
} from './dto/catalogo.dto';

@Controller()
export class CatalogosController {
  constructor(private readonly service: CatalogosService) {}

  @Get('especialidades')
  specialties(): Promise<SpecialtyResponse[]> {
    return this.service.listSpecialties();
  }

  @Get('localizacoes')
  locations(): Promise<LocationResponse[]> {
    return this.service.listLocations();
  }
}

@Controller('admin')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminCatalogosController {
  constructor(private readonly service: CatalogosService) {}

  @Get('especialidades')
  specialties(): Promise<SpecialtyResponse[]> {
    return this.service.listSpecialties(false);
  }

  @Post('especialidades')
  createSpecialty(@Body() dto: CreateSpecialtyDto): Promise<SpecialtyResponse> {
    return this.service.createSpecialty(dto);
  }

  @Patch('especialidades/:id')
  updateSpecialty(
    @Param('id') id: string,
    @Body() dto: UpdateSpecialtyDto,
  ): Promise<SpecialtyResponse> {
    return this.service.updateSpecialty(id, dto);
  }

  @Delete('especialidades/:id')
  @HttpCode(204)
  deleteSpecialty(@Param('id') id: string): Promise<void> {
    return this.service.deleteSpecialty(id);
  }

  @Get('localizacoes')
  locations(): Promise<LocationResponse[]> {
    return this.service.listLocations(false);
  }

  @Post('localizacoes')
  createLocation(@Body() dto: CreateLocationDto): Promise<LocationResponse> {
    return this.service.createLocation(dto);
  }

  @Patch('localizacoes/:id')
  updateLocation(
    @Param('id') id: string,
    @Body() dto: UpdateLocationDto,
  ): Promise<LocationResponse> {
    return this.service.updateLocation(id, dto);
  }

  @Delete('localizacoes/:id')
  @HttpCode(204)
  deleteLocation(@Param('id') id: string): Promise<void> {
    return this.service.deleteLocation(id);
  }
}
