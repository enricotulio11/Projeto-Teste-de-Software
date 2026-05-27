import {
  BadRequestException,
  ConflictException,
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { Log } from '../entidades/log.entity';
import { Usuario } from '../entidades/usuario.entity';
import { AuthResponse, AuthenticatedUser } from './auth.types';
import { isValidCPF } from './cpf.util';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuariosRepository: Repository<Usuario>,
    @InjectRepository(Log)
    private readonly logsRepository: Repository<Log>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.createConfiguredAdministrator();
  }

  async register(dto: RegisterDto): Promise<AuthResponse> {
    if (!dto.name.trim() || !isValidCPF(dto.cpf)) {
      throw new BadRequestException('Nome ou CPF invalido.');
    }

    const existingUser = await this.usuariosRepository.findOneBy({
      cpf: dto.cpf,
    });
    if (existingUser) {
      throw new ConflictException('CPF ja cadastrado.');
    }

    const user = this.usuariosRepository.create({
      nome: dto.name.trim(),
      cpf: dto.cpf,
      senha: await bcrypt.hash(dto.password, 10),
      pin: await bcrypt.hash(dto.pin, 10),
      isAdmin: false,
      status: 'ativo',
    });

    const savedUser = await this.usuariosRepository.save(user);
    await this.addLog(savedUser, 'usuario_criado', 'Novo usuario cadastrado.');
    return this.createAuthResponse(savedUser);
  }

  async login(dto: LoginDto): Promise<AuthResponse> {
    const user = await this.usuariosRepository.findOneBy({ cpf: dto.cpf });

    if (
      !user ||
      !(await bcrypt.compare(dto.password, user.senha)) ||
      !(await bcrypt.compare(dto.pin, user.pin))
    ) {
      await this.addLog(
        user ?? null,
        'login_falhou',
        'Tentativa de login falhou.',
        dto.cpf,
      );
      throw new UnauthorizedException('CPF, senha ou PIN incorretos.');
    }

    if (user.status !== 'ativo') {
      await this.addLog(
        user,
        'login_falhou',
        'Tentativa de login para usuario inativo.',
      );
      throw new UnauthorizedException('Usuario inativo.');
    }

    await this.addLog(user, 'login', 'Login realizado com sucesso.');
    return this.createAuthResponse(user);
  }

  async findAuthenticatedUser(userId: string): Promise<AuthenticatedUser> {
    const user = await this.usuariosRepository.findOneBy({ id: userId });

    if (!user || user.status !== 'ativo') {
      throw new UnauthorizedException('Usuario nao autorizado.');
    }

    return this.toResponseUser(user);
  }

  private async createAuthResponse(user: Usuario): Promise<AuthResponse> {
    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      cpf: user.cpf,
      isAdmin: user.isAdmin,
    });

    return {
      accessToken,
      user: this.toResponseUser(user),
    };
  }

  private toResponseUser(user: Usuario): AuthenticatedUser {
    return {
      id: user.id,
      name: user.nome,
      cpf: user.cpf,
      createdAt: user.criadoEm,
      isAdmin: user.isAdmin,
      status: user.status === 'ativo' ? 'active' : 'inactive',
    };
  }

  private async createConfiguredAdministrator(): Promise<void> {
    const cpf = this.configService.get<string>('ADMIN_CPF');
    const password = this.configService.get<string>('ADMIN_PASSWORD');
    const pin = this.configService.get<string>('ADMIN_PIN');

    if (!cpf || !password || !pin) {
      return;
    }

    if (
      !isValidCPF(cpf) ||
      !/^[A-Za-z0-9]{6}$/.test(password) ||
      !/^\d{4}$/.test(pin)
    ) {
      throw new Error(
        'Variaveis ADMIN_CPF, ADMIN_PASSWORD ou ADMIN_PIN invalidas.',
      );
    }

    const existingUser = await this.usuariosRepository.findOneBy({ cpf });
    if (existingUser) {
      return;
    }

    await this.usuariosRepository.save(
      this.usuariosRepository.create({
        nome: this.configService.get<string>('ADMIN_NAME') ?? 'Administrador',
        cpf,
        senha: await bcrypt.hash(password, 10),
        pin: await bcrypt.hash(pin, 10),
        isAdmin: true,
        status: 'ativo',
      }),
    );
  }

  private async addLog(
    user: Usuario | null,
    tipo: 'usuario_criado' | 'login' | 'login_falhou',
    detalhes: string,
    cpf?: string,
  ): Promise<void> {
    await this.logsRepository.save(
      this.logsRepository.create({
        tipo,
        usuarioId: user?.id ?? null,
        cpfUsuario: cpf ?? user?.cpf ?? null,
        detalhes,
      }),
    );
  }
}
