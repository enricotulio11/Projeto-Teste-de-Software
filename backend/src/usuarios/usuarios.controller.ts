import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsuariosService } from './usuarios.service.js';
import { CriarUsuarioDto } from './dto/criar-usuario.dto.js';
import { AtualizarUsuarioDto } from './dto/atualizar-usuario.dto.js';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post()
  criar(@Body() dto: CriarUsuarioDto) {
    return this.usuariosService.criar(dto);
  }

  @Get()
  buscarTodos() {
    return this.usuariosService.buscarTodos();
  }

  @Get(':id')
  buscarUm(@Param('id') id: string) {
    return this.usuariosService.buscarUm(id);
  }

  @Patch(':id')
  atualizar(@Param('id') id: string, @Body() dto: AtualizarUsuarioDto) {
    return this.usuariosService.atualizar(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remover(@Param('id') id: string) {
    return this.usuariosService.remover(id);
  }
}
