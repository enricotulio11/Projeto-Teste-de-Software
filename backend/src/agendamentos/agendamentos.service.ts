import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Agendamento } from '../entidades/agendamento.entity';
import { Dependente } from '../entidades/dependente.entity';
import { Especialidade } from '../entidades/especialidade.entity';
import { Localizacao } from '../entidades/localizacao.entity';
import { Log } from '../entidades/log.entity';
import { Usuario } from '../entidades/usuario.entity';
import {
  CreateAgendamentoDto,
  UpdateAgendamentoDto,
} from './dto/agendamento.dto';

export interface AppointmentResponse {
  id: string;
  userId: string;
  patientId: string;
  patientName: string;
  date: string;
  time: string;
  specialtyId: string;
  specialty: string;
  locationId: string;
  location: string;
  createdAt: Date;
}

@Injectable()
export class AgendamentosService {
  constructor(
    @InjectRepository(Agendamento)
    private readonly repository: Repository<Agendamento>,
    @InjectRepository(Usuario)
    private readonly usersRepository: Repository<Usuario>,
    @InjectRepository(Dependente)
    private readonly dependentsRepository: Repository<Dependente>,
    @InjectRepository(Especialidade)
    private readonly specialtiesRepository: Repository<Especialidade>,
    @InjectRepository(Localizacao)
    private readonly locationsRepository: Repository<Localizacao>,
    @InjectRepository(Log)
    private readonly logsRepository: Repository<Log>,
  ) {}

  async findAll(userId: string): Promise<AppointmentResponse[]> {
    const appointments = await this.repository.find({
      where: { usuarioId: userId },
      order: { data: 'ASC', horario: 'ASC' },
    });
    return appointments.map((appointment) => this.mapAppointment(appointment));
  }

  async create(
    userId: string,
    cpfUsuario: string,
    dto: CreateAgendamentoDto,
  ): Promise<AppointmentResponse> {
    this.validateDate(dto.date);
    const patient = await this.resolvePatient(userId, dto.patientId);
    await this.validateCatalogs(dto.specialtyId, dto.locationId);

    const appointment = await this.repository.save(
      this.repository.create({
        data: dto.date,
        horario: dto.time,
        usuarioId: userId,
        dependenteId: patient.dependentId,
        nomePaciente: patient.name,
        especialidadeId: dto.specialtyId,
        localizacaoId: dto.locationId,
      }),
    );
    const saved = await this.findOne(userId, appointment.id);
    await this.addLog(userId, cpfUsuario, 'agendamento_criado', saved);
    return this.mapAppointment(saved);
  }

  async update(
    userId: string,
    cpfUsuario: string,
    id: string,
    dto: UpdateAgendamentoDto,
  ): Promise<AppointmentResponse> {
    const appointment = await this.findOne(userId, id);
    if (dto.date) {
      this.validateDate(dto.date);
      appointment.data = dto.date;
    }
    if (dto.time) appointment.horario = dto.time;
    if (dto.patientId) {
      const patient = await this.resolvePatient(userId, dto.patientId);
      appointment.dependenteId = patient.dependentId;
      appointment.nomePaciente = patient.name;
    }
    if (dto.specialtyId || dto.locationId) {
      await this.validateCatalogs(
        dto.specialtyId ?? appointment.especialidadeId,
        dto.locationId ?? appointment.localizacaoId,
      );
      if (dto.specialtyId) appointment.especialidadeId = dto.specialtyId;
      if (dto.locationId) appointment.localizacaoId = dto.locationId;
    }

    await this.repository.save(appointment);
    const saved = await this.findOne(userId, id);
    await this.addLog(userId, cpfUsuario, 'agendamento_atualizado', saved);
    return this.mapAppointment(saved);
  }

  async remove(userId: string, cpfUsuario: string, id: string): Promise<void> {
    const appointment = await this.findOne(userId, id);
    await this.repository.remove(appointment);
    await this.addLog(userId, cpfUsuario, 'agendamento_cancelado', appointment);
  }

  private async findOne(userId: string, id: string): Promise<Agendamento> {
    const appointment = await this.repository.findOneBy({
      id,
      usuarioId: userId,
    });
    if (!appointment) {
      throw new NotFoundException('Agendamento nao encontrado.');
    }
    return appointment;
  }

  private async resolvePatient(
    userId: string,
    patientId: string,
  ): Promise<{ name: string; dependentId: string | null }> {
    if (patientId === userId) {
      const user = await this.usersRepository.findOneBy({ id: userId });
      if (!user) throw new NotFoundException('Usuario nao encontrado.');
      return { name: user.nome, dependentId: null };
    }

    const dependent = await this.dependentsRepository.findOneBy({
      id: patientId,
      usuarioId: userId,
    });
    if (!dependent) throw new NotFoundException('Paciente nao encontrado.');
    return { name: dependent.nome, dependentId: dependent.id };
  }

  private async validateCatalogs(
    specialtyId: string,
    locationId: string,
  ): Promise<void> {
    const specialty = await this.specialtiesRepository.findOneBy({
      id: specialtyId,
      ativo: true,
    });
    const location = await this.locationsRepository.findOneBy({
      id: locationId,
      ativo: true,
    });
    if (!specialty || !location) {
      throw new BadRequestException('Especialidade ou localizacao invalida.');
    }
  }

  private validateDate(date: string): void {
    const today = new Date().toISOString().slice(0, 10);
    if (date < today) {
      throw new BadRequestException(
        'Nao e possivel agendar em datas passadas.',
      );
    }
  }

  private async addLog(
    userId: string,
    cpfUsuario: string,
    tipo:
      | 'agendamento_criado'
      | 'agendamento_atualizado'
      | 'agendamento_cancelado',
    appointment: Agendamento,
  ): Promise<void> {
    await this.logsRepository.save(
      this.logsRepository.create({
        tipo,
        usuarioId: userId,
        cpfUsuario,
        detalhes: `Consulta de ${appointment.nomePaciente} em ${appointment.data}.`,
      }),
    );
  }

  private mapAppointment(appointment: Agendamento): AppointmentResponse {
    return {
      id: appointment.id,
      userId: appointment.usuarioId,
      patientId: appointment.dependenteId ?? appointment.usuarioId,
      patientName: appointment.nomePaciente,
      date: appointment.data,
      time: appointment.horario,
      specialtyId: appointment.especialidadeId,
      specialty: appointment.especialidade.nome,
      locationId: appointment.localizacaoId,
      location: `${appointment.localizacao.cidade} - ${appointment.localizacao.estado}`,
      createdAt: appointment.criadoEm,
    };
  }
}
