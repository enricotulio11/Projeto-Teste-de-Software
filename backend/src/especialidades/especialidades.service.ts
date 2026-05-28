import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Especialidade } from './especialidade.entity.js';
import { CriarEspecialidadeDto } from './dto/criar-especialidade.dto.js';
import { AtualizarEspecialidadeDto } from './dto/atualizar-especialidade.dto.js';

@Injectable()
export class EspecialidadesService {
  constructor(
    @InjectRepository(Especialidade)
    private readonly repo: Repository<Especialidade>,
  ) {}

  buscarAtivas(): Promise<Especialidade[]> {
    return this.repo.find({ where: { ativo: true }, order: { nome: 'ASC' } });
  }

  buscarTodas(): Promise<Especialidade[]> {
    return this.repo.find({ order: { nome: 'ASC' } });
  }

  async criar(dto: CriarEspecialidadeDto): Promise<Especialidade> {
    const existe = await this.repo.findOne({ where: { nome: dto.nome } });
    if (existe) throw new ConflictException('Especialidade já cadastrada');
    return this.repo.save(this.repo.create(dto));
  }

  async atualizar(id: string, dto: AtualizarEspecialidadeDto): Promise<Especialidade> {
    const especialidade = await this.repo.findOne({ where: { id } });
    if (!especialidade) throw new NotFoundException('Especialidade não encontrada');

    if (dto.nome && dto.nome !== especialidade.nome) {
      const existe = await this.repo.findOne({ where: { nome: dto.nome } });
      if (existe) throw new ConflictException('Nome de especialidade já cadastrado');
    }

    Object.assign(especialidade, dto);
    return this.repo.save(especialidade);
  }

  async remover(id: string): Promise<void> {
    const especialidade = await this.repo.findOne({ where: { id } });
    if (!especialidade) throw new NotFoundException('Especialidade não encontrada');
    await this.repo.remove(especialidade);
  }
}
