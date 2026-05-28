import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Localizacao } from './localizacao.entity.js';
import { CriarLocalizacaoDto } from './dto/criar-localizacao.dto.js';
import { AtualizarLocalizacaoDto } from './dto/atualizar-localizacao.dto.js';

@Injectable()
export class LocalizacoesService {
  constructor(
    @InjectRepository(Localizacao)
    private readonly repo: Repository<Localizacao>,
  ) {}

  buscarTodos(): Promise<Localizacao[]> {
    return this.repo.find({ order: { nome: 'ASC' } });
  }

  buscarAtivas(): Promise<Localizacao[]> {
    return this.repo.find({ where: { ativo: true }, order: { nome: 'ASC' } });
  }

  async buscarUm(id: string): Promise<Localizacao> {
    const localizacao = await this.repo.findOne({ where: { id } });
    if (!localizacao) throw new NotFoundException('Localização não encontrada');
    return localizacao;
  }

  criar(dto: CriarLocalizacaoDto): Promise<Localizacao> {
    return this.repo.save(this.repo.create(dto));
  }

  async atualizar(id: string, dto: AtualizarLocalizacaoDto): Promise<Localizacao> {
    const localizacao = await this.buscarUm(id);
    Object.assign(localizacao, dto);
    return this.repo.save(localizacao);
  }

  async remover(id: string): Promise<void> {
    const localizacao = await this.buscarUm(id);
    await this.repo.remove(localizacao);
  }
}
