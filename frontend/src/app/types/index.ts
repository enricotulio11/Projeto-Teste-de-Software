export interface User {
  id: string;
  name: string;
  cpf: string;
  email?: string;
  password?: string;
  pin?: string;
  createdAt: string;
  isAdmin?: boolean;
  role?: 'admin' | 'medico' | 'paciente' | 'recepcionista';
  status?: 'active' | 'inactive';
}

export interface Dependent {
  id: string;
  userId: string;
  name: string;
  cpf: string;
  dateOfBirth?: string;
  relationship?: string;
  active?: boolean;
  createdAt: string;
}

export interface Appointment {
  id: string;
  userId: string;
  patientId: string; // Can be userId (responsável) or dependentId
  patientName: string;
  date: string; // ISO format YYYY-MM-DD
  time: string; // HH:mm format
  doctorId?: string;
  doctorName?: string;
  specialtyId?: string;
  locationId?: string;
  location: string;
  specialty: string;
  status?: 'agendado' | 'confirmado' | 'cancelado' | 'concluido' | 'falta';
  createdAt: string;
}

export interface AuthContextType {
  currentUser: User | null;
  login: (cpf: string, password: string) => Promise<User | null>;
  register: (name: string, cpf: string, email: string, password: string) => Promise<User | null>;
  logout: () => void;
  isAdmin: () => boolean;
}
