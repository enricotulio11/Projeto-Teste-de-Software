import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
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
  login(@Body() dto: LoginDto) {
    return this.autenticacaoService.login(dto);
  }

  @Post('cadastro')
  cadastro(@Body() dto: CadastroDto) {
    return this.autenticacaoService.cadastro(dto);
  }

  @Get('me')
  @UseGuards(JwtAutenticacaoGuard)
  me(@UsuarioAtual() usuario: { id: string }) {
    return this.autenticacaoService.perfil(usuario);
  }

  @Post('logout')
  @UseGuards(JwtAutenticacaoGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  logout() {
    return;
  }
}
