import { Injectable } from '@nestjs/common';
import { AgendamentosService } from '../agendamentos/agendamentos.service.js';
import { UsuariosService } from '../usuarios/usuarios.service.js';

@Injectable()
export class PainelService {
  constructor(
    private readonly agendamentosService: AgendamentosService,
    private readonly usuariosService: UsuariosService,
  ) {}

  async resumo() {
    const [totalUsuarios, ativosUsuarios, porStatus, agendamentosHoje] = await Promise.all([
      this.usuariosService.contarTotal(),
      this.usuariosService.contarAtivos(),
      this.agendamentosService.contarPorStatus(),
      this.agendamentosService.buscarAgendamentosHoje(),
    ]);

    const totalAgendamentos = Object.values(porStatus).reduce((acc, v) => acc + v, 0);

    return {
      usuarios: {
        total: totalUsuarios,
        ativos: ativosUsuarios,
      },
      agendamentos: {
        total: totalAgendamentos,
        hoje: agendamentosHoje.length,
        porStatus,
      },
    };
  }

  agendamentosHoje() {
    return this.agendamentosService.buscarAgendamentosHoje();
  }

  proximosAgendamentos(limite = 10) {
    return this.agendamentosService.buscarProximos(limite);
  }
}
