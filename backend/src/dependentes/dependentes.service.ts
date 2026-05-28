import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Dependente } from './dependente.entity.js';
import { CriarDependenteDto } from './dto/criar-dependente.dto.js';
import { AtualizarDependenteDto } from './dto/atualizar-dependente.dto.js';
import { UsuariosService } from '../usuarios/usuarios.service.js';
import { ConfiguracoesService } from '../configuracoes/configuracoes.service.js';
import { LogsService } from '../logs/logs.service.js';

@Injectable()
export class DependentesService {
  constructor(
    @InjectRepository(Dependente)
    private readonly repo: Repository<Dependente>,
    private readonly usuariosService: UsuariosService,
    private readonly configuracoesService: ConfiguracoesService,
    private readonly logsService: LogsService,
  ) {}

  buscarTodos(): Promise<Dependente[]> {
    return this.repo.find({ order: { nome: 'ASC' } });
  }

  buscarPorUsuario(usuarioId: string): Promise<Dependente[]> {
    return this.repo.find({
      where: { usuarioId },
      order: { nome: 'ASC' },
    });
  }

  async buscarUm(id: string): Promise<Dependente> {
    const dependente = await this.repo.findOne({ where: { id } });
    if (!dependente) throw new NotFoundException('Dependente não encontrado');
    return dependente;
  }

  async criar(dto: CriarDependenteDto): Promise<Dependente> {
    await this.usuariosService.buscarUm(dto.usuarioId);

    const [jaExiste, limiteDependentes, totalAtual] = await Promise.all([
      this.repo.findOne({ where: { cpf: dto.cpf } }),
      this.configuracoesService.buscarValor('limiteDependentes'),
      this.repo.count({ where: { usuarioId: dto.usuarioId, ativo: true } }),
    ]);

    if (jaExiste) throw new ConflictException('CPF já cadastrado como dependente');
    if (totalAtual >= limiteDependentes) {
      throw new BadRequestException(
        `Limite de ${limiteDependentes} dependentes por usuário atingido`,
      );
    }

    const dependente = await this.repo.save(this.repo.create(dto));

    await this.logsService.registrar({
      usuarioId: dto.usuarioId,
      acao: 'cadastro',
      detalhes: `Dependente cadastrado: ${dependente.nome}`,
    });

    return dependente;
  }

  async atualizar(id: string, dto: AtualizarDependenteDto): Promise<Dependente> {
    const dependente = await this.buscarUm(id);

    if (dto.cpf && dto.cpf !== dependente.cpf) {
      const existe = await this.repo.findOne({ where: { cpf: dto.cpf } });
      if (existe) throw new ConflictException('CPF já cadastrado como dependente');
    }

    Object.assign(dependente, dto);
    const atualizado = await this.repo.save(dependente);

    await this.logsService.registrar({
      usuarioId: dependente.usuarioId,
      acao: 'atualizacao',
      detalhes: `Dependente atualizado: ${atualizado.nome}`,
    });

    return atualizado;
  }

  async remover(id: string): Promise<void> {
    const dependente = await this.buscarUm(id);
    await this.repo.remove(dependente);

    await this.logsService.registrar({
      usuarioId: dependente.usuarioId,
      acao: 'remocao',
      detalhes: `Dependente removido: ${dependente.nome}`,
    });
  }
}
