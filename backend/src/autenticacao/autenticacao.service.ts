import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsuariosService } from '../usuarios/usuarios.service.js';
import { LoginDto } from './dto/login.dto.js';
import { CadastroDto } from './dto/cadastro.dto.js';

const MAX_TENTATIVAS = 5;

@Injectable()
export class AutenticacaoService {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const usuario = await this.usuariosService.buscarPorCpf(dto.cpf);

    if (!usuario || !usuario.ativo) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    if (usuario.bloqueado) {
      throw new UnauthorizedException('Conta bloqueada');
    }

    const senhaValida = await bcrypt.compare(dto.senha, usuario.senhaHash);
    if (!senhaValida) {
      await this.usuariosService.incrementarTentativasLogin(usuario.id);

      if (usuario.tentativasLogin + 1 >= MAX_TENTATIVAS) {
        await this.usuariosService.bloquear(usuario.id);
        throw new UnauthorizedException('Conta bloqueada por excesso de tentativas');
      }

      throw new UnauthorizedException('Credenciais inválidas');
    }

    await this.usuariosService.resetarTentativasLogin(usuario.id);

    const payload = { sub: usuario.id, cpf: usuario.cpf, papel: usuario.papel };
    const { senhaHash: _, ...usuarioSemSenha } = usuario;

    return {
      accessToken: this.jwtService.sign(payload),
      usuario: usuarioSemSenha,
    };
  }

  async cadastro(dto: CadastroDto) {
    return this.usuariosService.criar({ ...dto });
  }

  perfil(usuario: { id: string }) {
    return this.usuariosService.buscarUm(usuario.id);
  }
}
