import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { Especialidade } from '../especialidades/especialidade.entity.js';
import { Localizacao } from '../localizacoes/localizacao.entity.js';
import { Usuario } from '../usuarios/usuario.entity.js';

const ESPECIALIDADES_INICIAIS = [
  'Clínica Geral',
  'Cardiologia',
  'Dermatologia',
  'Geriatria',
  'Ortopedia',
  'Pediatria',
];

const LOCALIZACOES_INICIAIS = [
  {
    nome: 'Unidade Central',
    endereco: 'Rua Principal, 100',
    cidade: 'São Paulo',
    estado: 'SP',
    cep: '01001-000',
  },
  {
    nome: 'Unidade Norte',
    endereco: 'Avenida Norte, 250',
    cidade: 'São Paulo',
    estado: 'SP',
    cep: '02020-000',
  },
];

@Injectable()
export class DadosIniciaisService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuariosRepo: Repository<Usuario>,
    @InjectRepository(Especialidade)
    private readonly especialidadesRepo: Repository<Especialidade>,
    @InjectRepository(Localizacao)
    private readonly localizacoesRepo: Repository<Localizacao>,
  ) {}

  async onApplicationBootstrap() {
    await this.criarUsuariosIniciais();
    await this.criarEspecialidadesIniciais();
    await this.criarLocalizacoesIniciais();
  }

  private async criarUsuariosIniciais() {
    await this.criarUsuarioSeNaoExistir({
      nome: process.env.ADMIN_NOME ?? 'Administrador',
      cpf: process.env.ADMIN_CPF ?? '00000000000',
      email: process.env.ADMIN_EMAIL ?? 'admin@medagenda.local',
      senha: process.env.ADMIN_SENHA ?? '111111',
      papel: 'admin',
    });

    await this.criarUsuarioSeNaoExistir({
      nome: process.env.MEDICO_NOME ?? 'Médico Padrão',
      cpf: process.env.MEDICO_CPF ?? '11111111111',
      email: process.env.MEDICO_EMAIL ?? 'medico@medagenda.local',
      senha: process.env.MEDICO_SENHA ?? '111111',
      papel: 'medico',
    });
  }

  private async criarUsuarioSeNaoExistir(dados: {
    nome: string;
    cpf: string;
    email: string;
    senha: string;
    papel: Usuario['papel'];
  }) {
    const existente = await this.usuariosRepo.findOne({
      where: [{ cpf: dados.cpf }, { email: dados.email }],
    });

    if (existente) return;

    await this.usuariosRepo.save(
      this.usuariosRepo.create({
        nome: dados.nome,
        cpf: dados.cpf,
        email: dados.email,
        senhaHash: await bcrypt.hash(dados.senha, 10),
        papel: dados.papel,
        ativo: true,
        bloqueado: false,
      }),
    );
  }

  private async criarEspecialidadesIniciais() {
    for (const nome of ESPECIALIDADES_INICIAIS) {
      const existente = await this.especialidadesRepo.findOne({ where: { nome } });
      if (!existente) {
        await this.especialidadesRepo.save(this.especialidadesRepo.create({ nome }));
      }
    }
  }

  private async criarLocalizacoesIniciais() {
    for (const localizacao of LOCALIZACOES_INICIAIS) {
      const existente = await this.localizacoesRepo.findOne({
        where: {
          nome: localizacao.nome,
          cidade: localizacao.cidade,
          estado: localizacao.estado,
        },
      });

      if (!existente) {
        await this.localizacoesRepo.save(this.localizacoesRepo.create(localizacao));
      }
    }
  }
}
