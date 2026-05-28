import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { AgendamentosService } from './agendamentos.service';
import { Agendamento } from './agendamento.entity';
import { UsuariosService } from '../usuarios/usuarios.service';
import { EspecialidadesService } from '../especialidades/especialidades.service';
import { LocalizacoesService } from '../localizacoes/localizacoes.service';
import { DependentesService } from '../dependentes/dependentes.service';
import { LogsService } from '../logs/logs.service';

const buildQb = () => ({
  select: jest.fn().mockReturnThis(),
  addSelect: jest.fn().mockReturnThis(),
  groupBy: jest.fn().mockReturnThis(),
  getRawMany: jest.fn().mockResolvedValue([]),
  where: jest.fn().mockReturnThis(),
  andWhere: jest.fn().mockReturnThis(),
  orderBy: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  getMany: jest.fn().mockResolvedValue([]),
});

describe('AgendamentosService', () => {
  let service: AgendamentosService;

  const mockRepo = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn((data) => data),
    save: jest.fn(),
    remove: jest.fn(),
    createQueryBuilder: jest.fn(() => buildQb()),
  };

  const mockUsuariosService = { buscarUm: jest.fn() };
  const mockEspecialidadesService = { buscarUm: jest.fn() };
  const mockLocalizacoesService = { buscarUm: jest.fn() };
  const mockDependentesService = { buscarUm: jest.fn() };
  const mockLogsService = { registrar: jest.fn().mockResolvedValue(undefined) };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AgendamentosService,
        { provide: getRepositoryToken(Agendamento), useValue: mockRepo },
        { provide: UsuariosService, useValue: mockUsuariosService },
        { provide: EspecialidadesService, useValue: mockEspecialidadesService },
        { provide: LocalizacoesService, useValue: mockLocalizacoesService },
        { provide: DependentesService, useValue: mockDependentesService },
        { provide: LogsService, useValue: mockLogsService },
      ],
    }).compile();

    service = module.get<AgendamentosService>(AgendamentosService);
  });

  it('deve ser definido', () => {
    expect(service).toBeDefined();
  });

  describe('buscarUm', () => {
    it('lança NotFoundException quando agendamento não existe', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      await expect(service.buscarUm('id-inexistente')).rejects.toThrow(NotFoundException);
    });

    it('retorna agendamento quando encontrado', async () => {
      const agendamento = { id: '1', pacienteId: 'p1', status: 'agendado' } as Agendamento;
      mockRepo.findOne.mockResolvedValue(agendamento);
      await expect(service.buscarUm('1')).resolves.toEqual(agendamento);
    });
  });

  describe('criar', () => {
    const dto = {
      pacienteId: 'p1',
      medicoId: 'm1',
      especialidadeId: 'e1',
      localizacaoId: 'l1',
      dataHora: '2025-06-01T10:00:00',
    };

    it('lança BadRequestException quando usuário informado como médico não tem papel "medico"', async () => {
      mockUsuariosService.buscarUm
        .mockResolvedValueOnce({ id: 'p1', nome: 'Paciente', papel: 'paciente' })
        .mockResolvedValueOnce({ id: 'm1', nome: 'Admin', papel: 'admin' });

      await expect(service.criar(dto)).rejects.toThrow(BadRequestException);
    });

    it('cria agendamento com dados válidos', async () => {
      const esperado = { id: 'ag1', ...dto, status: 'agendado' } as unknown as Agendamento;

      mockUsuariosService.buscarUm
        .mockResolvedValueOnce({ id: 'p1', nome: 'Paciente', papel: 'paciente' })
        .mockResolvedValueOnce({ id: 'm1', nome: 'Médico', papel: 'medico' });
      mockEspecialidadesService.buscarUm.mockResolvedValue({ id: 'e1' });
      mockLocalizacoesService.buscarUm.mockResolvedValue({ id: 'l1' });
      mockRepo.save.mockResolvedValue(esperado);

      const result = await service.criar(dto);
      expect(result).toEqual(esperado);
      expect(mockLogsService.registrar).toHaveBeenCalledTimes(1);
    });

    it('lança BadRequestException quando dependente não pertence ao paciente', async () => {
      mockUsuariosService.buscarUm
        .mockResolvedValueOnce({ id: 'p1', nome: 'Paciente', papel: 'paciente' })
        .mockResolvedValueOnce({ id: 'm1', nome: 'Médico', papel: 'medico' });
      mockEspecialidadesService.buscarUm.mockResolvedValue({ id: 'e1' });
      mockLocalizacoesService.buscarUm.mockResolvedValue({ id: 'l1' });
      mockDependentesService.buscarUm.mockResolvedValue({ id: 'd1', usuarioId: 'outro-usuario' });

      await expect(service.criar({ ...dto, dependenteId: 'd1' })).rejects.toThrow(BadRequestException);
    });
  });

  describe('atualizar', () => {
    it('lança BadRequestException quando agendamento está cancelado', async () => {
      mockRepo.findOne.mockResolvedValue({ id: '1', status: 'cancelado' } as Agendamento);
      await expect(service.atualizar('1', { status: 'confirmado' })).rejects.toThrow(BadRequestException);
    });
  });

  describe('remover', () => {
    it('lança NotFoundException quando agendamento não existe', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      await expect(service.remover('id-inexistente')).rejects.toThrow(NotFoundException);
    });
  });
});
