import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Log, TipoLog } from './log.entity.js';

@Injectable()
export class LogsService {
  constructor(
    @InjectRepository(Log)
    private readonly repo: Repository<Log>,
  ) {}

  async registrar(dados: {
    tipo: TipoLog;
    usuarioId?: string;
    cpfUsuario?: string;
    enderecoIp?: string;
    detalhes?: string;
  }): Promise<void> {
    const log = this.repo.create(dados);
    await this.repo.save(log);
  }

  async buscarTodos(filtros: {
    tipo?: TipoLog;
    usuarioId?: string;
    cpf?: string;
    de?: string;
    ate?: string;
    pagina?: number;
    limite?: number;
  }) {
    const pagina = filtros.pagina ?? 1;
    const limite = filtros.limite ?? 20;

    const qb = this.repo
      .createQueryBuilder('log')
      .orderBy('log.criadoEm', 'DESC')
      .skip((pagina - 1) * limite)
      .take(limite);

    if (filtros.tipo) qb.andWhere('log.tipo = :tipo', { tipo: filtros.tipo });
    if (filtros.usuarioId) qb.andWhere('log.usuarioId = :usuarioId', { usuarioId: filtros.usuarioId });
    if (filtros.cpf) qb.andWhere('log.cpfUsuario = :cpf', { cpf: filtros.cpf });
    if (filtros.de) qb.andWhere('log.criadoEm >= :de', { de: filtros.de });
    if (filtros.ate) qb.andWhere('log.criadoEm <= :ate', { ate: filtros.ate });

    const [dados, total] = await qb.getManyAndCount();
    return {
      dados,
      meta: { total, pagina, limite, totalPaginas: Math.ceil(total / limite) },
    };
  }

  async buscarEstatisticas(dias = 30) {
    const desde = new Date();
    desde.setDate(desde.getDate() - dias);

    const contagens = await this.repo
      .createQueryBuilder('log')
      .select('log.tipo', 'tipo')
      .addSelect('COUNT(*)', 'total')
      .where('log.criadoEm >= :desde', { desde })
      .groupBy('log.tipo')
      .getRawMany<{ tipo: TipoLog; total: string }>();

    return contagens.reduce(
      (acc, row) => ({ ...acc, [row.tipo]: Number(row.total) }),
      {} as Record<TipoLog, number>,
    );
  }
}
