import { Appointment, Dependent, User } from '../types';
import { apiDelete, apiGet, apiPatch, apiPost } from './api';

export interface BackendUser {
  id: string;
  nome: string;
  cpf: string;
  email?: string;
  papel: 'admin' | 'medico' | 'paciente' | 'recepcionista';
  ativo?: boolean;
  bloqueado?: boolean;
  criadoEm?: string;
}

export interface BackendDependent {
  id: string;
  nome: string;
  cpf: string;
  dataNascimento: string;
  parentesco: string;
  usuarioId: string;
  ativo: boolean;
  criadoEm: string;
}

export interface BackendSpecialty {
  id: string;
  nome: string;
  ativo: boolean;
  criadoEm?: string;
}

export interface BackendLocation {
  id: string;
  nome: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep?: string | null;
  ativo: boolean;
  criadoEm?: string;
}

export interface BackendAppointment {
  id: string;
  pacienteId: string;
  medicoId: string;
  dependenteId: string | null;
  especialidadeId: string;
  localizacaoId: string;
  dataHora: string;
  duracao: number;
  status: 'agendado' | 'confirmado' | 'cancelado' | 'concluido' | 'falta';
  motivo?: string | null;
  observacoes?: string | null;
  criadoEm: string;
}

export interface PanelSummary {
  usuarios: {
    total: number;
    ativos: number;
  };
  agendamentos: {
    total: number;
    hoje: number;
    porStatus: Record<string, number>;
  };
}

export interface AppointmentLookups {
  currentUser?: User | null;
  users?: User[];
  dependents?: Dependent[];
  specialties?: BackendSpecialty[];
  locations?: BackendLocation[];
}

export function mapBackendUser(user: BackendUser): User {
  return {
    id: user.id,
    name: user.nome,
    cpf: user.cpf,
    email: user.email,
    createdAt: user.criadoEm ?? new Date().toISOString(),
    role: user.papel,
    isAdmin: user.papel === 'admin',
    status: user.ativo === false || user.bloqueado ? 'inactive' : 'active',
  };
}

export function mapBackendDependent(dependent: BackendDependent): Dependent {
  return {
    id: dependent.id,
    userId: dependent.usuarioId,
    name: dependent.nome,
    cpf: dependent.cpf,
    dateOfBirth: dependent.dataNascimento,
    relationship: dependent.parentesco,
    active: dependent.ativo,
    createdAt: dependent.criadoEm,
  };
}

export function mapBackendAppointment(
  appointment: BackendAppointment,
  lookups: AppointmentLookups = {},
): Appointment {
  const date = appointment.dataHora.slice(0, 10);
  const time = appointment.dataHora.slice(11, 16);
  const patient = appointment.dependenteId
    ? lookups.dependents?.find((dependent) => dependent.id === appointment.dependenteId)
    : lookups.currentUser;
  const doctor = lookups.users?.find((user) => user.id === appointment.medicoId);
  const specialty = lookups.specialties?.find((item) => item.id === appointment.especialidadeId);
  const location = lookups.locations?.find((item) => item.id === appointment.localizacaoId);

  return {
    id: appointment.id,
    userId: appointment.pacienteId,
    patientId: appointment.dependenteId ?? appointment.pacienteId,
    patientName: patient?.name ?? appointment.pacienteId,
    date,
    time,
    doctorId: appointment.medicoId,
    doctorName: doctor?.name,
    specialtyId: appointment.especialidadeId,
    locationId: appointment.localizacaoId,
    specialty: specialty?.nome ?? appointment.especialidadeId,
    location: location ? `${location.nome} - ${location.cidade}/${location.estado}` : appointment.localizacaoId,
    status: appointment.status,
    createdAt: appointment.criadoEm,
  };
}

export function getMe(): Promise<BackendUser> {
  return apiGet<BackendUser>('/autenticacao/me');
}

export async function fetchUsers(): Promise<User[]> {
  const users = await apiGet<BackendUser[]>('/usuarios');
  return users.map(mapBackendUser);
}

export async function fetchDoctors(): Promise<User[]> {
  const users = await apiGet<BackendUser[]>('/usuarios/medicos');
  return users.map(mapBackendUser);
}

export function updateUserById(
  id: string,
  input: Partial<{
    name: string;
    email: string;
    role: User['role'];
    active: boolean;
    blocked: boolean;
  }>,
): Promise<BackendUser> {
  return apiPatch<BackendUser>(`/usuarios/${id}`, {
    nome: input.name,
    email: input.email,
    papel: input.role,
    ativo: input.active,
    bloqueado: input.blocked,
  });
}

export async function fetchDependents(userId: string): Promise<Dependent[]> {
  const dependents = await apiGet<BackendDependent[]>(`/dependentes/usuario/${userId}`);
  return dependents.map(mapBackendDependent);
}

export async function fetchAllDependents(): Promise<Dependent[]> {
  const dependents = await apiGet<BackendDependent[]>('/dependentes');
  return dependents.map(mapBackendDependent);
}

export function createDependent(input: {
  userId: string;
  name: string;
  cpf: string;
  dateOfBirth: string;
  relationship: string;
}): Promise<BackendDependent> {
  return apiPost<BackendDependent>('/dependentes', {
    nome: input.name,
    cpf: input.cpf,
    dataNascimento: input.dateOfBirth,
    parentesco: input.relationship,
    usuarioId: input.userId,
  });
}

export function deleteDependentById(id: string): Promise<null> {
  return apiDelete<null>(`/dependentes/${id}`);
}

export function fetchSpecialties(): Promise<BackendSpecialty[]> {
  return apiGet<BackendSpecialty[]>('/especialidades');
}

export function fetchLocations(): Promise<BackendLocation[]> {
  return apiGet<BackendLocation[]>('/localizacoes');
}

export async function fetchAppointmentsByPatient(
  patientId: string,
  lookups?: AppointmentLookups,
): Promise<Appointment[]> {
  const appointments = await apiGet<BackendAppointment[]>(`/agendamentos/paciente/${patientId}`);
  return appointments
    .filter((appointment) => appointment.status !== 'cancelado')
    .map((appointment) => mapBackendAppointment(appointment, lookups));
}

export function createAppointment(input: {
  patientId: string;
  doctorId: string;
  dependentId?: string | null;
  specialtyId: string;
  locationId: string;
  dateTime: string;
}): Promise<BackendAppointment> {
  return apiPost<BackendAppointment>('/agendamentos', {
    pacienteId: input.patientId,
    medicoId: input.doctorId,
    dependenteId: input.dependentId ?? undefined,
    especialidadeId: input.specialtyId,
    localizacaoId: input.locationId,
    dataHora: input.dateTime,
  });
}

export function updateAppointmentById(
  id: string,
  input: Partial<{
    doctorId: string;
    dependentId: string | null;
    specialtyId: string;
    locationId: string;
    dateTime: string;
    status: Appointment['status'];
  }>,
): Promise<BackendAppointment> {
  return apiPatch<BackendAppointment>(`/agendamentos/${id}`, {
    medicoId: input.doctorId,
    dependenteId: input.dependentId,
    especialidadeId: input.specialtyId,
    localizacaoId: input.locationId,
    dataHora: input.dateTime,
    status: input.status,
  });
}

export function deleteAppointmentById(id: string): Promise<null> {
  return apiDelete<null>(`/agendamentos/${id}`);
}

export function fetchPanelSummary(): Promise<PanelSummary> {
  return apiGet<PanelSummary>('/painel/resumo');
}
