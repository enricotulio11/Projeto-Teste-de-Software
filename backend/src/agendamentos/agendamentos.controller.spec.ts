import { Test, TestingModule } from '@nestjs/testing';
import { AgendamentosController } from './agendamentos.controller';
import { AgendamentosService } from './agendamentos.service';
import { JwtAutenticacaoGuard } from '../autenticacao/guardas/jwt-autenticacao.guard';
import { PapeisGuard } from '../autenticacao/guardas/papeis.guard';

describe('AgendamentosController', () => {
  let controller: AgendamentosController;

  const mockService = {
    buscarTodos: jest.fn().mockResolvedValue([]),
    buscarPorPaciente: jest.fn().mockResolvedValue([]),
    buscarPorMedico: jest.fn().mockResolvedValue([]),
    buscarUm: jest.fn(),
    criar: jest.fn(),
    atualizar: jest.fn(),
    remover: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AgendamentosController],
      providers: [{ provide: AgendamentosService, useValue: mockService }],
    })
      .overrideGuard(JwtAutenticacaoGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(PapeisGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<AgendamentosController>(AgendamentosController);
  });

  it('deve ser definido', () => {
    expect(controller).toBeDefined();
  });

  it('buscarTodos delega ao service', async () => {
    await controller.buscarTodos();
    expect(mockService.buscarTodos).toHaveBeenCalled();
  });

  it('buscarPorPaciente delega ao service', async () => {
    await controller.buscarPorPaciente('p1');
    expect(mockService.buscarPorPaciente).toHaveBeenCalledWith('p1');
  });

  it('buscarPorMedico delega ao service', async () => {
    await controller.buscarPorMedico('m1');
    expect(mockService.buscarPorMedico).toHaveBeenCalledWith('m1');
  });
});
