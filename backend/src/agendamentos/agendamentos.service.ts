import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Agendamento } from './agendamento.entity.js';
import { CriarAgendamentoDto } from './dto/criar-agendamento.dto.js';
import { AtualizarAgendamentoDto } from './dto/atualizar-agendamento.dto.js';
import { UsuariosService } from '../usuarios/usuarios.service.js';
import { EspecialidadesService } from '../especialidades/especialidades.service.js';
import { LocalizacoesService } from '../localizacoes/localizacoes.service.js';
import { DependentesService } from '../dependentes/dependentes.service.js';
import { LogsService } from '../logs/logs.service.js';

@Injectable()
export class AgendamentosService {
  constructor(
    @InjectRepository(Agendamento)
    private readonly repo: Repository<Agendamento>,
    private readonly usuariosService: UsuariosService,
    private readonly especialidadesService: EspecialidadesService,
    private readonly localizacoesService: LocalizacoesService,
    private readonly dependentesService: DependentesService,
    private readonly logsService: LogsService,
  ) {}

  buscarTodos(): Promise<Agendamento[]> {
    return this.repo.find({ order: { dataHora: 'ASC' } });
  }

  buscarPorPaciente(pacienteId: string): Promise<Agendamento[]> {
    return this.repo.find({ where: { pacienteId }, order: { dataHora: 'ASC' } });
  }

  buscarPorMedico(medicoId: string): Promise<Agendamento[]> {
    return this.repo.find({ where: { medicoId }, order: { dataHora: 'ASC' } });
  }

  async buscarUm(id: string): Promise<Agendamento> {
    const agendamento = await this.repo.findOne({ where: { id } });
    if (!agendamento) throw new NotFoundException('Agendamento não encontrado');
    return agendamento;
  }

  async criar(dto: CriarAgendamentoDto): Promise<Agendamento> {
    const [paciente, medico] = await Promise.all([
      this.usuariosService.buscarUm(dto.pacienteId),
      this.usuariosService.buscarUm(dto.medicoId),
    ]);

    if (medico.papel !== 'medico') {
      throw new BadRequestException('O usuário informado como médico não possui o papel "medico"');
    }

    await Promise.all([
      this.especialidadesService.buscarUm(dto.especialidadeId),
      this.localizacoesService.buscarUm(dto.localizacaoId),
    ]);

    if (dto.dependenteId) {
      const dependente = await this.dependentesService.buscarUm(dto.dependenteId);
      if (dependente.usuarioId !== dto.pacienteId) {
        throw new BadRequestException('Dependente não pertence ao paciente informado');
      }
    }

    const agendamento = await this.repo.save(
      this.repo.create({
        pacienteId: dto.pacienteId,
        medicoId: dto.medicoId,
        dependenteId: dto.dependenteId ?? null,
        especialidadeId: dto.especialidadeId,
        localizacaoId: dto.localizacaoId,
        dataHora: dto.dataHora,
        duracao: dto.duracao ?? 30,
        motivo: dto.motivo ?? null,
        observacoes: dto.observacoes ?? null,
      }),
    );

    await this.logsService.registrar({
      usuarioId: dto.pacienteId,
      acao: 'cadastro',
      detalhes: `Agendamento criado para ${paciente.nome} com médico ${medico.nome} em ${dto.dataHora}`,
    });

    return agendamento;
  }

  async atualizar(id: string, dto: AtualizarAgendamentoDto): Promise<Agendamento> {
    const agendamento = await this.buscarUm(id);

    if (agendamento.status === 'cancelado') {
      throw new BadRequestException('Agendamento cancelado não pode ser alterado');
    }

    if (dto.medicoId && dto.medicoId !== agendamento.medicoId) {
      const medico = await this.usuariosService.buscarUm(dto.medicoId);
      if (medico.papel !== 'medico') {
        throw new BadRequestException('O usuário informado como médico não possui o papel "medico"');
      }
    }

    if (dto.especialidadeId && dto.especialidadeId !== agendamento.especialidadeId) {
      await this.especialidadesService.buscarUm(dto.especialidadeId);
    }

    if (dto.localizacaoId && dto.localizacaoId !== agendamento.localizacaoId) {
      await this.localizacoesService.buscarUm(dto.localizacaoId);
    }

    Object.assign(agendamento, dto);
    const atualizado = await this.repo.save(agendamento);

    await this.logsService.registrar({
      usuarioId: agendamento.pacienteId,
      acao: 'atualizacao',
      detalhes: `Agendamento ${id} atualizado`,
    });

    return atualizado;
  }

  async remover(id: string): Promise<void> {
    const agendamento = await this.buscarUm(id);
    await this.repo.remove(agendamento);

    await this.logsService.registrar({
      usuarioId: agendamento.pacienteId,
      acao: 'remocao',
      detalhes: `Agendamento ${id} removido`,
    });
  }

  async contarPorStatus(): Promise<Record<string, number>> {
    const result = await this.repo
      .createQueryBuilder('a')
      .select('a.status', 'status')
      .addSelect('COUNT(a.id)', 'total')
      .groupBy('a.status')
      .getRawMany<{ status: string; total: string }>();

    return Object.fromEntries(result.map((r) => [r.status, parseInt(r.total, 10)]));
  }

  buscarAgendamentosHoje(): Promise<Agendamento[]> {
    const hoje = new Date().toISOString().split('T')[0];
    return this.repo
      .createQueryBuilder('a')
      .where('a.dataHora LIKE :prefixo', { prefixo: `${hoje}%` })
      .orderBy('a.dataHora', 'ASC')
      .getMany();
  }

  buscarProximos(limite = 10): Promise<Agendamento[]> {
    const agora = new Date().toISOString();
    return this.repo
      .createQueryBuilder('a')
      .where('a.dataHora >= :agora', { agora })
      .andWhere('a.status IN (:...status)', { status: ['agendado', 'confirmado'] })
      .orderBy('a.dataHora', 'ASC')
      .limit(limite)
      .getMany();
  }
}
