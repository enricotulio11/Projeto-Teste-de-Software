import { Test, TestingModule } from '@nestjs/testing';
import { PainelService } from './painel.service';
import { AgendamentosService } from '../agendamentos/agendamentos.service';
import { UsuariosService } from '../usuarios/usuarios.service';

describe('PainelService', () => {
  let service: PainelService;

  const mockAgendamentosService = {
    contarPorStatus: jest.fn(),
    buscarAgendamentosHoje: jest.fn(),
    buscarProximos: jest.fn(),
  };

  const mockUsuariosService = {
    contarTotal: jest.fn(),
    contarAtivos: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PainelService,
        { provide: AgendamentosService, useValue: mockAgendamentosService },
        { provide: UsuariosService, useValue: mockUsuariosService },
      ],
    }).compile();

    service = module.get<PainelService>(PainelService);
  });

  it('deve ser definido', () => {
    expect(service).toBeDefined();
  });

  describe('resumo', () => {
    it('retorna estatísticas consolidadas de usuários e agendamentos', async () => {
      mockUsuariosService.contarTotal.mockResolvedValue(10);
      mockUsuariosService.contarAtivos.mockResolvedValue(8);
      mockAgendamentosService.contarPorStatus.mockResolvedValue({
        agendado: 5,
        confirmado: 3,
        cancelado: 1,
        concluido: 2,
        falta: 0,
      });
      mockAgendamentosService.buscarAgendamentosHoje.mockResolvedValue([
        { id: 'a1' },
        { id: 'a2' },
      ]);

      const result = await service.resumo();

      expect(result.usuarios.total).toBe(10);
      expect(result.usuarios.ativos).toBe(8);
      expect(result.agendamentos.total).toBe(11);
      expect(result.agendamentos.hoje).toBe(2);
      expect(result.agendamentos.porStatus).toEqual({
        agendado: 5,
        confirmado: 3,
        cancelado: 1,
        concluido: 2,
        falta: 0,
      });
    });
  });

  describe('agendamentosHoje', () => {
    it('delega ao agendamentosService', () => {
      mockAgendamentosService.buscarAgendamentosHoje.mockResolvedValue([]);
      service.agendamentosHoje();
      expect(mockAgendamentosService.buscarAgendamentosHoje).toHaveBeenCalled();
    });
  });

  describe('proximosAgendamentos', () => {
    it('usa limite padrão de 10', () => {
      mockAgendamentosService.buscarProximos.mockResolvedValue([]);
      service.proximosAgendamentos();
      expect(mockAgendamentosService.buscarProximos).toHaveBeenCalledWith(10);
    });

    it('usa limite informado', () => {
      mockAgendamentosService.buscarProximos.mockResolvedValue([]);
      service.proximosAgendamentos(5);
      expect(mockAgendamentosService.buscarProximos).toHaveBeenCalledWith(5);
    });
  });
});
