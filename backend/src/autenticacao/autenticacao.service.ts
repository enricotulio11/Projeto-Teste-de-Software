import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsuariosService } from '../usuarios/usuarios.service.js';
import { LogsService } from '../logs/logs.service.js';
import { LoginDto } from './dto/login.dto.js';
import { CadastroDto } from './dto/cadastro.dto.js';

const MAX_TENTATIVAS = 5;

@Injectable()
export class AutenticacaoService {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly jwtService: JwtService,
    private readonly logsService: LogsService,
  ) {}

  async login(dto: LoginDto, ip?: string) {
    const usuario = await this.usuariosService.buscarPorCpf(dto.cpf);

    if (!usuario || !usuario.ativo) {
      await this.logsService.registrar({
        tipo: 'login_falhou',
        cpfUsuario: dto.cpf,
        enderecoIp: ip,
      });
      throw new UnauthorizedException('Credenciais inválidas');
    }

    if (usuario.bloqueado) {
      throw new UnauthorizedException('Conta bloqueada');
    }

    const senhaValida = await bcrypt.compare(dto.senha, usuario.senhaHash);
    if (!senhaValida) {
      await this.usuariosService.incrementarTentativasLogin(usuario.id);
      await this.logsService.registrar({
        tipo: 'login_falhou',
        cpfUsuario: dto.cpf,
        usuarioId: usuario.id,
        enderecoIp: ip,
      });

      if (usuario.tentativasLogin + 1 >= MAX_TENTATIVAS) {
        await this.usuariosService.bloquear(usuario.id);
        throw new UnauthorizedException('Conta bloqueada por excesso de tentativas');
      }

      throw new UnauthorizedException('Credenciais inválidas');
    }

    await this.usuariosService.resetarTentativasLogin(usuario.id);
    await this.logsService.registrar({
      tipo: 'login',
      cpfUsuario: usuario.cpf,
      usuarioId: usuario.id,
      enderecoIp: ip,
    });

    const payload = { sub: usuario.id, cpf: usuario.cpf, papel: usuario.papel };
    return { accessToken: this.jwtService.sign(payload) };
  }

  async cadastro(dto: CadastroDto) {
    return this.usuariosService.criar({ ...dto });
  }

  async logout(usuarioId: string, cpf: string, ip?: string): Promise<void> {
    await this.logsService.registrar({
      tipo: 'logout',
      usuarioId,
      cpfUsuario: cpf,
      enderecoIp: ip,
    });
  }
}
