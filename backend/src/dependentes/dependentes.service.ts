import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { isValidCPF } from '../auth/cpf.util';
import { Dependente } from '../entidades/dependente.entity';
import { Log } from '../entidades/log.entity';
import { CreateDependenteDto } from './dto/create-dependente.dto';

export interface DependentResponse {
  id: string;
  userId: string;
  name: string;
  cpf: string;
  createdAt: Date;
}

@Injectable()
export class DependentesService {
  constructor(
    @InjectRepository(Dependente)
    private readonly repository: Repository<Dependente>,
    @InjectRepository(Log)
    private readonly logsRepository: Repository<Log>,
  ) {}

  async findAll(userId: string): Promise<DependentResponse[]> {
    const dependentes = await this.repository.find({
      where: { usuarioId: userId },
      order: { criadoEm: 'ASC' },
    });
    return dependentes.map((dependente) => this.toResponse(dependente));
  }

  async create(
    userId: string,
    cpfUsuario: string,
    dto: CreateDependenteDto,
  ): Promise<DependentResponse> {
    if (!dto.name.trim() || !isValidCPF(dto.cpf)) {
      throw new BadRequestException('Nome ou CPF invalido.');
    }

    if (await this.repository.findOneBy({ cpf: dto.cpf })) {
      throw new ConflictException('CPF ja cadastrado como dependente.');
    }

    const dependente = await this.repository.save(
      this.repository.create({
        nome: dto.name.trim(),
        cpf: dto.cpf,
        usuarioId: userId,
      }),
    );
    await this.logsRepository.save(
      this.logsRepository.create({
        tipo: 'dependente_criado',
        usuarioId: userId,
        cpfUsuario,
        detalhes: `Dependente cadastrado: ${dependente.nome}.`,
      }),
    );
    return this.toResponse(dependente);
  }

  async remove(
    userId: string,
    cpfUsuario: string,
    dependentId: string,
  ): Promise<void> {
    const dependente = await this.repository.findOneBy({
      id: dependentId,
      usuarioId: userId,
    });
    if (!dependente) {
      throw new NotFoundException('Dependente nao encontrado.');
    }

    await this.repository.remove(dependente);
    await this.logsRepository.save(
      this.logsRepository.create({
        tipo: 'dependente_removido',
        usuarioId: userId,
        cpfUsuario,
        detalhes: `Dependente removido: ${dependente.nome}.`,
      }),
    );
  }

  private toResponse(dependente: Dependente): DependentResponse {
    return {
      id: dependente.id,
      userId: dependente.usuarioId,
      name: dependente.nome,
      cpf: dependente.cpf,
      createdAt: dependente.criadoEm,
    };
  }
}
