import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Especialidade } from '../entidades/especialidade.entity';
import { Localizacao } from '../entidades/localizacao.entity';
import {
  CreateLocationDto,
  CreateSpecialtyDto,
  UpdateLocationDto,
  UpdateSpecialtyDto,
} from './dto/catalogo.dto';

export interface SpecialtyResponse {
  id: string;
  name: string;
  active: boolean;
  createdAt: Date;
}

export interface LocationResponse {
  id: string;
  name: string;
  city: string;
  state: string;
  displayName: string;
  active: boolean;
  createdAt: Date;
}

const DEFAULT_SPECIALTIES = [
  'Cardiologia',
  'Dermatologia',
  'Endocrinologia',
  'Gastroenterologia',
  'Geriatria',
  'Ginecologia',
  'Neurologia',
  'Odontologia',
  'Oftalmologia',
  'Ortopedia',
  'Otorrinolaringologia',
  'Pediatria',
  'Pneumologia',
  'Psiquiatria',
  'Reumatologia',
  'Urologia',
];

const DEFAULT_LOCATIONS = [
  ['São Paulo', 'SP'],
  ['Rio de Janeiro', 'RJ'],
  ['Belo Horizonte', 'MG'],
  ['Brasília', 'DF'],
  ['Curitiba', 'PR'],
  ['Porto Alegre', 'RS'],
  ['Salvador', 'BA'],
  ['Fortaleza', 'CE'],
  ['Recife', 'PE'],
  ['Manaus', 'AM'],
  ['Belém', 'PA'],
  ['Goiânia', 'GO'],
  ['Campinas', 'SP'],
  ['São Bernardo do Campo', 'SP'],
  ['Santos', 'SP'],
] as const;

@Injectable()
export class CatalogosService implements OnModuleInit {
  constructor(
    @InjectRepository(Especialidade)
    private readonly specialtyRepository: Repository<Especialidade>,
    @InjectRepository(Localizacao)
    private readonly locationRepository: Repository<Localizacao>,
  ) {}

  async onModuleInit(): Promise<void> {
    if ((await this.specialtyRepository.count()) === 0) {
      await this.specialtyRepository.save(
        DEFAULT_SPECIALTIES.map((nome) =>
          this.specialtyRepository.create({ nome }),
        ),
      );
    }

    if ((await this.locationRepository.count()) === 0) {
      await this.locationRepository.save(
        DEFAULT_LOCATIONS.map(([cidade, estado]) =>
          this.locationRepository.create({
            nome: `${cidade} - ${estado}`,
            cidade,
            estado,
          }),
        ),
      );
    }
  }

  async listSpecialties(activeOnly = true): Promise<SpecialtyResponse[]> {
    const specialties = await this.specialtyRepository.find({
      where: activeOnly ? { ativo: true } : {},
      order: { nome: 'ASC' },
    });
    return specialties.map((specialty) => this.mapSpecialty(specialty));
  }

  async listLocations(activeOnly = true): Promise<LocationResponse[]> {
    const locations = await this.locationRepository.find({
      where: activeOnly ? { ativo: true } : {},
      order: { cidade: 'ASC' },
    });
    return locations.map((location) => this.mapLocation(location));
  }

  async createSpecialty(dto: CreateSpecialtyDto): Promise<SpecialtyResponse> {
    const specialty = await this.specialtyRepository.save(
      this.specialtyRepository.create({ nome: dto.name.trim() }),
    );
    return this.mapSpecialty(specialty);
  }

  async updateSpecialty(
    id: string,
    dto: UpdateSpecialtyDto,
  ): Promise<SpecialtyResponse> {
    const specialty = await this.findSpecialty(id);
    if (dto.name !== undefined) specialty.nome = dto.name.trim();
    if (dto.active !== undefined) specialty.ativo = dto.active;
    return this.mapSpecialty(await this.specialtyRepository.save(specialty));
  }

  async deleteSpecialty(id: string): Promise<void> {
    const specialty = await this.findSpecialty(id);
    specialty.ativo = false;
    await this.specialtyRepository.save(specialty);
  }

  async createLocation(dto: CreateLocationDto): Promise<LocationResponse> {
    const location = await this.locationRepository.save(
      this.locationRepository.create({
        nome: dto.name.trim(),
        cidade: dto.city.trim(),
        estado: dto.state.toUpperCase(),
      }),
    );
    return this.mapLocation(location);
  }

  async updateLocation(
    id: string,
    dto: UpdateLocationDto,
  ): Promise<LocationResponse> {
    const location = await this.findLocation(id);
    if (dto.name !== undefined) location.nome = dto.name.trim();
    if (dto.city !== undefined) location.cidade = dto.city.trim();
    if (dto.state !== undefined) location.estado = dto.state.toUpperCase();
    if (dto.active !== undefined) location.ativo = dto.active;
    return this.mapLocation(await this.locationRepository.save(location));
  }

  async deleteLocation(id: string): Promise<void> {
    const location = await this.findLocation(id);
    location.ativo = false;
    await this.locationRepository.save(location);
  }

  private async findSpecialty(id: string): Promise<Especialidade> {
    const specialty = await this.specialtyRepository.findOneBy({ id });
    if (!specialty)
      throw new NotFoundException('Especialidade nao encontrada.');
    return specialty;
  }

  private async findLocation(id: string): Promise<Localizacao> {
    const location = await this.locationRepository.findOneBy({ id });
    if (!location) throw new NotFoundException('Localizacao nao encontrada.');
    return location;
  }

  private mapSpecialty(specialty: Especialidade): SpecialtyResponse {
    return {
      id: specialty.id,
      name: specialty.nome,
      active: specialty.ativo,
      createdAt: specialty.criadoEm,
    };
  }

  private mapLocation(location: Localizacao): LocationResponse {
    return {
      id: location.id,
      name: location.nome,
      city: location.cidade,
      state: location.estado,
      displayName: `${location.cidade} - ${location.estado}`,
      active: location.ativo,
      createdAt: location.criadoEm,
    };
  }
}
