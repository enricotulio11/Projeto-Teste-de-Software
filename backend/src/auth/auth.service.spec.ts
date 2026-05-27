import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { Usuario } from '../entidades/usuario.entity';
import { Log } from '../entidades/log.entity';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  const createdAt = new Date('2026-01-01T00:00:00.000Z');
  let repository: {
    findOneBy: jest.Mock;
    create: jest.Mock;
    save: jest.Mock;
  };
  let jwtService: { signAsync: jest.Mock };
  let service: AuthService;
  let storedUser: Usuario | undefined;
  let logsRepository: { create: jest.Mock; save: jest.Mock };

  beforeEach(() => {
    storedUser = undefined;
    repository = {
      findOneBy: jest.fn(),
      create: jest.fn((user: Partial<Usuario>) => ({
        ...user,
        id: 'user-id',
        criadoEm: createdAt,
      })),
      save: jest.fn((user: Usuario) => {
        storedUser = user;
        return Promise.resolve(user);
      }),
    };
    jwtService = {
      signAsync: jest.fn().mockResolvedValue('signed-token'),
    };
    logsRepository = {
      create: jest.fn((log: Partial<Log>) => log),
      save: jest.fn((log: Partial<Log>) => Promise.resolve(log)),
    };
    service = new AuthService(
      repository as unknown as Repository<Usuario>,
      logsRepository as unknown as Repository<Log>,
      jwtService as unknown as JwtService,
      new ConfigService(),
    );
  });

  it('stores password and PIN as hashes when registering', async () => {
    repository.findOneBy.mockResolvedValue(null);

    const response = await service.register({
      name: 'Usuario Teste',
      cpf: '52998224725',
      password: 'Abc123',
      pin: '1234',
    });

    expect(storedUser).toBeDefined();
    if (!storedUser) {
      throw new Error('Usuario nao foi armazenado.');
    }
    expect(await bcrypt.compare('Abc123', storedUser.senha)).toBe(true);
    expect(await bcrypt.compare('1234', storedUser.pin)).toBe(true);
    expect(storedUser.senha).not.toBe('Abc123');
    expect(storedUser.pin).not.toBe('1234');
    expect(response.accessToken).toBe('signed-token');
    expect('password' in response.user).toBe(false);
    expect('pin' in response.user).toBe(false);
  });

  it('does not allow an inactive user to log in', async () => {
    repository.findOneBy.mockResolvedValue({
      id: 'user-id',
      cpf: '52998224725',
      senha: await bcrypt.hash('Abc123', 10),
      pin: await bcrypt.hash('1234', 10),
      status: 'inativo',
      isAdmin: false,
      nome: 'Usuario Teste',
      criadoEm: createdAt,
    });

    await expect(
      service.login({
        cpf: '52998224725',
        password: 'Abc123',
        pin: '1234',
      }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
