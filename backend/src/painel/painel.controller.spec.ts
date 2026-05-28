import { Test, TestingModule } from '@nestjs/testing';
import { PainelController } from './painel.controller';
import { PainelService } from './painel.service';
import { JwtAutenticacaoGuard } from '../autenticacao/guardas/jwt-autenticacao.guard';
import { PapeisGuard } from '../autenticacao/guardas/papeis.guard';

describe('PainelController', () => {
  let controller: PainelController;

  const mockService = {
    resumo: jest.fn().mockResolvedValue({}),
    agendamentosHoje: jest.fn().mockResolvedValue([]),
    proximosAgendamentos: jest.fn().mockResolvedValue([]),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PainelController],
      providers: [{ provide: PainelService, useValue: mockService }],
    })
      .overrideGuard(JwtAutenticacaoGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(PapeisGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<PainelController>(PainelController);
  });

  it('deve ser definido', () => {
    expect(controller).toBeDefined();
  });

  it('resumo delega ao service', async () => {
    await controller.resumo();
    expect(mockService.resumo).toHaveBeenCalled();
  });

  it('agendamentosHoje delega ao service', async () => {
    await controller.agendamentosHoje();
    expect(mockService.agendamentosHoje).toHaveBeenCalled();
  });

  it('proximosAgendamentos usa limite 10 por padrão', async () => {
    await controller.proximosAgendamentos(undefined);
    expect(mockService.proximosAgendamentos).toHaveBeenCalledWith(10);
  });

  it('proximosAgendamentos converte limite da query string', async () => {
    await controller.proximosAgendamentos('5');
    expect(mockService.proximosAgendamentos).toHaveBeenCalledWith(5);
  });
});
