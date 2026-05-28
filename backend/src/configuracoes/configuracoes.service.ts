import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfiguracoesSistema } from './configuracoes-sistema.entity.js';
import { AtualizarConfiguracoesDto } from './dto/atualizar-configuracoes.dto.js';

const CONFIGURACOES_ID = 1;

@Injectable()
export class ConfiguracoesService {
  constructor(
    @InjectRepository(ConfiguracoesSistema)
    private readonly repo: Repository<ConfiguracoesSistema>,
  ) {}

  async buscarConfiguracoes(): Promise<ConfiguracoesSistema> {
    const config = await this.repo.findOne({ where: { id: CONFIGURACOES_ID } });
    if (config) return config;
    return this.repo.save(this.repo.create({ id: CONFIGURACOES_ID }));
  }

  async atualizar(dto: AtualizarConfiguracoesDto): Promise<ConfiguracoesSistema> {
    const config = await this.buscarConfiguracoes();
    Object.assign(config, dto);
    return this.repo.save(config);
  }

  async buscarValor<K extends keyof ConfiguracoesSistema>(
    chave: K,
  ): Promise<ConfiguracoesSistema[K]> {
    const config = await this.buscarConfiguracoes();
    return config[chave];
  }
}
