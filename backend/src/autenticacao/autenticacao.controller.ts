import {
  Controller,
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

  @Post('logout')
  @UseGuards(JwtAutenticacaoGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  logout() {
    return;
  }
}
