import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario } from './usuario.entity.js';
import { CriarUsuarioDto } from './dto/criar-usuario.dto.js';
import { AtualizarUsuarioDto } from './dto/atualizar-usuario.dto.js';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly repo: Repository<Usuario>,
  ) {}

  buscarTodos() {
    return this.repo.find({
      select: {
        id: true,
        nome: true,
        cpf: true,
        email: true,
        papel: true,
        ativo: true,
        bloqueado: true,
        criadoEm: true,
      },
    });
  }

  async buscarUm(id: string) {
    const usuario = await this.repo.findOne({ where: { id } });
    if (!usuario) throw new NotFoundException('Usuário não encontrado');
    const { senhaHash: _, ...rest } = usuario;
    return rest;
  }

  async buscarPorCpf(cpf: string): Promise<Usuario | null> {
    return this.repo.findOne({ where: { cpf } });
  }

  async criar(dto: CriarUsuarioDto) {
    const existente = await this.repo.findOne({
      where: [{ cpf: dto.cpf }, { email: dto.email }],
    });
    if (existente) throw new ConflictException('CPF ou e-mail já cadastrado');

    const senhaHash = await bcrypt.hash(dto.senha, 10);
    const usuario = this.repo.create({
      nome: dto.nome,
      cpf: dto.cpf,
      email: dto.email,
      senhaHash,
      papel: (dto.papel as Usuario['papel']) ?? 'paciente',
    });
    const salvo = await this.repo.save(usuario);
    const { senhaHash: _, ...rest } = salvo;
    return rest;
  }

  async atualizar(id: string, dto: AtualizarUsuarioDto) {
    const usuario = await this.repo.findOne({ where: { id } });
    if (!usuario) throw new NotFoundException('Usuário não encontrado');

    Object.assign(usuario, dto);
    const salvo = await this.repo.save(usuario);
    const { senhaHash: _, ...rest } = salvo;
    return rest;
  }

  async remover(id: string): Promise<void> {
    const usuario = await this.repo.findOne({ where: { id } });
    if (!usuario) throw new NotFoundException('Usuário não encontrado');
    await this.repo.remove(usuario);
  }

  async incrementarTentativasLogin(id: string): Promise<void> {
    await this.repo.increment({ id }, 'tentativasLogin', 1);
  }

  async resetarTentativasLogin(id: string): Promise<void> {
    await this.repo.update(id, { tentativasLogin: 0 });
  }

  async bloquear(id: string): Promise<void> {
    await this.repo.update(id, { bloqueado: true });
  }
}
