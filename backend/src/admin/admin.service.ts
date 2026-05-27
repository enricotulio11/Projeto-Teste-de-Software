import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { Agendamento } from '../entidades/agendamento.entity';
import { ConfiguracoesSistema } from '../entidades/configuracoes-sistema.entity';
import { Dependente } from '../entidades/dependente.entity';
import { Log, TipoLog } from '../entidades/log.entity';
import { Usuario } from '../entidades/usuario.entity';
import { UpdateSettingsDto, UpdateUserStatusDto } from './dto/admin.dto';

export interface AdminPersonResponse {
  id: string;
  name: string;
  cpf: string;
  createdAt: Date;
  status: 'active' | 'inactive';
  type: 'Responsável' | 'Dependente';
  userId?: string;
  isAdmin?: boolean;
}

export interface SecurityLogResponse {
  id: string;
  type: string;
  user: string;
  cpf: string;
  timestamp: Date;
  ipAddress: string;
  details: string;
}

export interface SettingsResponse {
  systemName: string;
  maintenanceMode: boolean;
  allowRegistrations: boolean;
  emailNotifications: boolean;
  maxDependentsPerUser: number;
  sessionTimeout: number;
  enableSecurityLogs: boolean;
  requireStrongPasswords: boolean;
}

export interface DashboardResponse {
  stats: {
    totalResponsaveis: number;
    totalDependentes: number;
    consultasEsteMes: number;
    alertasSistema: number;
  };
  chartData: Array<{ day: string; agendamentos: number }>;
}

const LOG_TYPE_MAP: Record<TipoLog, string> = {
  login: 'login',
  logout: 'logout',
  login_falhou: 'failed_login',
  senha_redefinida: 'password_reset',
  pin_redefinido: 'password_reset',
  usuario_bloqueado: 'user_blocked',
  usuario_desbloqueado: 'user_unblocked',
  usuario_criado: 'user_created',
  agendamento_criado: 'appointment_created',
  agendamento_atualizado: 'appointment_updated',
  agendamento_cancelado: 'appointment_cancelled',
  dependente_criado: 'dependent_created',
  dependente_removido: 'dependent_removed',
};

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usersRepository: Repository<Usuario>,
    @InjectRepository(Dependente)
    private readonly dependentsRepository: Repository<Dependente>,
    @InjectRepository(Agendamento)
    private readonly appointmentsRepository: Repository<Agendamento>,
    @InjectRepository(Log)
    private readonly logsRepository: Repository<Log>,
    @InjectRepository(ConfiguracoesSistema)
    private readonly settingsRepository: Repository<ConfiguracoesSistema>,
  ) {}

  async listUsers(): Promise<AdminPersonResponse[]> {
    const [users, dependents] = await Promise.all([
      this.usersRepository.find({ order: { criadoEm: 'ASC' } }),
      this.dependentsRepository.find({ order: { criadoEm: 'ASC' } }),
    ]);

    return [
      ...users.map((user) => ({
        id: user.id,
        name: user.nome,
        cpf: user.cpf,
        createdAt: user.criadoEm,
        status:
          user.status === 'ativo' ? ('active' as const) : ('inactive' as const),
        type: 'Responsável' as const,
        isAdmin: user.isAdmin,
      })),
      ...dependents.map((dependent) => ({
        id: dependent.id,
        name: dependent.nome,
        cpf: dependent.cpf,
        createdAt: dependent.criadoEm,
        status: 'active' as const,
        type: 'Dependente' as const,
        userId: dependent.usuarioId,
      })),
    ];
  }

  async updateStatus(
    actorId: string,
    actorCpf: string,
    userId: string,
    dto: UpdateUserStatusDto,
  ): Promise<AdminPersonResponse> {
    const user = await this.findUser(userId);
    user.status = dto.status === 'active' ? 'ativo' : 'inativo';
    await this.usersRepository.save(user);
    await this.createLog(
      actorId,
      actorCpf,
      dto.status === 'active' ? 'usuario_desbloqueado' : 'usuario_bloqueado',
      `Usuario ${user.nome} ${dto.status === 'active' ? 'desbloqueado' : 'bloqueado'}.`,
    );
    return {
      id: user.id,
      name: user.nome,
      cpf: user.cpf,
      createdAt: user.criadoEm,
      status: dto.status,
      type: 'Responsável',
      isAdmin: user.isAdmin,
    };
  }

  async resetPin(
    actorId: string,
    actorCpf: string,
    userId: string,
  ): Promise<{ pin: string }> {
    const user = await this.findUser(userId);
    const pin = Math.floor(1000 + Math.random() * 9000).toString();
    user.pin = await bcrypt.hash(pin, 10);
    await this.usersRepository.save(user);
    await this.createLog(
      actorId,
      actorCpf,
      'pin_redefinido',
      `PIN de ${user.nome} redefinido pelo administrador.`,
    );
    return { pin };
  }

  async listLogs(): Promise<SecurityLogResponse[]> {
    const logs = await this.logsRepository.find({
      relations: { usuario: true },
      order: { criadoEm: 'DESC' },
      take: 100,
    });
    return logs.map((log) => ({
      id: log.id,
      type: LOG_TYPE_MAP[log.tipo],
      user: log.usuario?.nome ?? 'Sistema',
      cpf: log.cpfUsuario ?? '',
      timestamp: log.criadoEm,
      ipAddress: log.enderecoIp ?? '-',
      details: log.detalhes ?? '',
    }));
  }

  async getSettings(): Promise<SettingsResponse> {
    return this.mapSettings(await this.findOrCreateSettings());
  }

  async updateSettings(dto: UpdateSettingsDto): Promise<SettingsResponse> {
    const settings = await this.findOrCreateSettings();
    if (dto.systemName !== undefined) settings.nomeSistema = dto.systemName;
    if (dto.maintenanceMode !== undefined)
      settings.modoManutencao = dto.maintenanceMode;
    if (dto.allowRegistrations !== undefined)
      settings.permitirCadastros = dto.allowRegistrations;
    if (dto.emailNotifications !== undefined)
      settings.habilitarNotificacoesEmail = dto.emailNotifications;
    if (dto.maxDependentsPerUser !== undefined)
      settings.limiteDependentes = dto.maxDependentsPerUser;
    if (dto.sessionTimeout !== undefined)
      settings.tempoSessao = dto.sessionTimeout;
    if (dto.enableSecurityLogs !== undefined)
      settings.habilitarLogsSeguranca = dto.enableSecurityLogs;
    if (dto.requireStrongPasswords !== undefined)
      settings.exigirSenhaForte = dto.requireStrongPasswords;
    return this.mapSettings(await this.settingsRepository.save(settings));
  }

  async dashboard(): Promise<DashboardResponse> {
    const [totalResponsaveis, totalDependentes, appointments, alertasSistema] =
      await Promise.all([
        this.usersRepository.count({ where: { isAdmin: false } }),
        this.dependentsRepository.count(),
        this.appointmentsRepository.find(),
        this.usersRepository.count({ where: { status: 'inativo' } }),
      ]);
    const now = new Date();
    const monthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const consultasEsteMes = appointments.filter((appointment) =>
      appointment.data.startsWith(monthPrefix),
    ).length;
    const chartData = Array.from({ length: 7 }, (_, index) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - index));
      const dateString = date.toISOString().slice(0, 10);
      return {
        day: date.toLocaleDateString('pt-BR', {
          weekday: 'short',
          day: '2-digit',
          month: '2-digit',
        }),
        agendamentos: appointments.filter(
          (appointment) => appointment.data === dateString,
        ).length,
      };
    });

    return {
      stats: {
        totalResponsaveis,
        totalDependentes,
        consultasEsteMes,
        alertasSistema,
      },
      chartData,
    };
  }

  private async findUser(userId: string): Promise<Usuario> {
    const user = await this.usersRepository.findOneBy({ id: userId });
    if (!user) throw new NotFoundException('Usuario nao encontrado.');
    return user;
  }

  private async findOrCreateSettings(): Promise<ConfiguracoesSistema> {
    const existing = await this.settingsRepository.findOneBy({ id: 1 });
    return (
      existing ??
      this.settingsRepository.save(this.settingsRepository.create({ id: 1 }))
    );
  }

  private mapSettings(settings: ConfiguracoesSistema): SettingsResponse {
    return {
      systemName: settings.nomeSistema,
      maintenanceMode: settings.modoManutencao,
      allowRegistrations: settings.permitirCadastros,
      emailNotifications: settings.habilitarNotificacoesEmail,
      maxDependentsPerUser: settings.limiteDependentes,
      sessionTimeout: settings.tempoSessao,
      enableSecurityLogs: settings.habilitarLogsSeguranca,
      requireStrongPasswords: settings.exigirSenhaForte,
    };
  }

  private async createLog(
    actorId: string,
    actorCpf: string,
    tipo: TipoLog,
    detalhes: string,
  ): Promise<void> {
    await this.logsRepository.save(
      this.logsRepository.create({
        usuarioId: actorId,
        cpfUsuario: actorCpf,
        tipo,
        detalhes,
      }),
    );
  }
}
