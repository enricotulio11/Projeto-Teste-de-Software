import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Log } from './log.entity.js';
import { CriarLogDto } from './dto/criar-log.dto.js';

@Injectable()
export class LogsService {
  constructor(
    @InjectRepository(Log)
    private readonly repo: Repository<Log>,
  ) {}

  async registrar(dto: CriarLogDto): Promise<Log> {
    const log = this.repo.create({
      usuarioId: dto.usuarioId,
      acao: dto.acao,
      detalhes: dto.detalhes ?? null,
      ip: dto.ip ?? null,
    });
    return this.repo.save(log);
  }

  buscarTodos(): Promise<Log[]> {
    return this.repo.find({ order: { criadoEm: 'DESC' } });
  }

  buscarPorUsuario(usuarioId: string): Promise<Log[]> {
    return this.repo.find({
      where: { usuarioId },
      order: { criadoEm: 'DESC' },
    });
  }

  async buscarUm(id: string): Promise<Log> {
    const log = await this.repo.findOne({ where: { id } });
    if (!log) throw new NotFoundException('Log não encontrado');
    return log;
  }
}
