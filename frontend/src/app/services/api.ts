import {
  AdminDashboardData,
  AdminPerson,
  Appointment,
  Dependent,
  Location,
  SecurityLog,
  Specialty,
  SystemSettings,
  User,
} from '../types';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';
const TOKEN_KEY = 'medagenda_auth_token';
const USER_KEY = 'medagenda_auth_user';

interface AuthResponse {
  accessToken: string;
  user: User;
}

export class ApiError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem(TOKEN_KEY);
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as {
      message?: string | string[];
    } | null;
    const message = Array.isArray(body?.message)
      ? body.message[0]
      : body?.message;
    throw new ApiError(message ?? 'Erro ao comunicar com o servidor.', response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

function saveSession(response: AuthResponse): User {
  localStorage.setItem(TOKEN_KEY, response.accessToken);
  localStorage.setItem(USER_KEY, JSON.stringify(response.user));
  return response.user;
}

export function getStoredAuthUser(): User | null {
  const user = localStorage.getItem(USER_KEY);
  return user ? (JSON.parse(user) as User) : null;
}

export function clearAuthSession(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export const authApi = {
  async login(cpf: string, password: string, pin: string): Promise<User> {
    const response = await request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ cpf, password, pin }),
    });
    return saveSession(response);
  },

  async register(
    name: string,
    cpf: string,
    password: string,
    pin: string,
  ): Promise<User> {
    const response = await request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, cpf, password, pin }),
    });
    return saveSession(response);
  },

  me(): Promise<User> {
    return request<User>('/auth/me');
  },
};

export const dependentsApi = {
  list(): Promise<Dependent[]> {
    return request<Dependent[]>('/dependentes');
  },

  create(name: string, cpf: string): Promise<Dependent> {
    return request<Dependent>('/dependentes', {
      method: 'POST',
      body: JSON.stringify({ name, cpf }),
    });
  },

  remove(id: string): Promise<void> {
    return request<void>(`/dependentes/${id}`, { method: 'DELETE' });
  },
};

type AppointmentInput = Pick<
  Appointment,
  'date' | 'time' | 'patientId' | 'specialtyId' | 'locationId'
>;

export const appointmentsApi = {
  list(): Promise<Appointment[]> {
    return request<Appointment[]>('/agendamentos');
  },

  create(data: AppointmentInput): Promise<Appointment> {
    return request<Appointment>('/agendamentos', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update(id: string, data: Partial<AppointmentInput>): Promise<Appointment> {
    return request<Appointment>(`/agendamentos/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  remove(id: string): Promise<void> {
    return request<void>(`/agendamentos/${id}`, { method: 'DELETE' });
  },
};

export const catalogsApi = {
  specialties(): Promise<Specialty[]> {
    return request<Specialty[]>('/especialidades');
  },

  locations(): Promise<Location[]> {
    return request<Location[]>('/localizacoes');
  },
};

export const adminApi = {
  users(): Promise<AdminPerson[]> {
    return request<AdminPerson[]>('/admin/usuarios');
  },

  updateUserStatus(id: string, status: 'active' | 'inactive'): Promise<AdminPerson> {
    return request<AdminPerson>(`/admin/usuarios/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  resetUserPin(id: string): Promise<{ pin: string }> {
    return request<{ pin: string }>(`/admin/usuarios/${id}/pin`, {
      method: 'PATCH',
    });
  },

  logs(): Promise<SecurityLog[]> {
    return request<SecurityLog[]>('/admin/logs');
  },

  settings(): Promise<SystemSettings> {
    return request<SystemSettings>('/admin/configuracoes');
  },

  updateSettings(settings: SystemSettings): Promise<SystemSettings> {
    return request<SystemSettings>('/admin/configuracoes', {
      method: 'PATCH',
      body: JSON.stringify(settings),
    });
  },

  dashboard(): Promise<AdminDashboardData> {
    return request<AdminDashboardData>('/admin/dashboard');
  },

  specialties(): Promise<Specialty[]> {
    return request<Specialty[]>('/admin/especialidades');
  },

  locations(): Promise<Location[]> {
    return request<Location[]>('/admin/localizacoes');
  },

  createSpecialty(name: string): Promise<Specialty> {
    return request<Specialty>('/admin/especialidades', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
  },

  updateSpecialty(id: string, name: string): Promise<Specialty> {
    return request<Specialty>(`/admin/especialidades/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ name }),
    });
  },

  removeSpecialty(id: string): Promise<void> {
    return request<void>(`/admin/especialidades/${id}`, { method: 'DELETE' });
  },

  createLocation(name: string, city: string, state: string): Promise<Location> {
    return request<Location>('/admin/localizacoes', {
      method: 'POST',
      body: JSON.stringify({ name, city, state }),
    });
  },

  updateLocation(id: string, data: Partial<Location>): Promise<Location> {
    return request<Location>(`/admin/localizacoes/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  removeLocation(id: string): Promise<void> {
    return request<void>(`/admin/localizacoes/${id}`, { method: 'DELETE' });
  },
};
