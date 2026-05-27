import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { AutenticacaoService } from './autenticacao.service.js';
import { LoginDto } from './dto/login.dto.js';
import { CadastroDto } from './dto/cadastro.dto.js';
import { JwtAutenticacaoGuard } from './guardas/jwt-autenticacao.guard.js';
import { UsuarioAtual } from './decoradores/usuario-atual.decorator.js';

@Controller('autenticacao')
export class AutenticacaoController {
  constructor(private readonly autenticacaoService: AutenticacaoService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDto, @Req() req: Request) {
    return this.autenticacaoService.login(dto, req.ip);
  }

  @Post('cadastro')
  cadastro(@Body() dto: CadastroDto) {
    return this.autenticacaoService.cadastro(dto);
  }

  @Post('logout')
  @UseGuards(JwtAutenticacaoGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  logout(
    @UsuarioAtual() usuario: { id: string; cpf: string },
    @Req() req: Request,
  ) {
    return this.autenticacaoService.logout(usuario.id, usuario.cpf, req.ip);
  }
}
