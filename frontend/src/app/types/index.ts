export interface User {
  id: string;
  name: string;
  cpf: string;
  password: string;
  pin: string;
  createdAt: string;
  isAdmin?: boolean;
  status?: 'active' | 'inactive';
}

export interface Dependent {
  id: string;
  userId: string;
  name: string;
  cpf: string;
  createdAt: string;
}

export interface Appointment {
  id: string;
  userId: string;
  patientId: string; // Can be userId (responsável) or dependentId
  patientName: string;
  date: string; // ISO format YYYY-MM-DD
  time: string; // HH:mm format
  location: string;
  specialty: string;
  createdAt: string;
}

export interface AuthContextType {
  currentUser: User | null;
  login: (cpf: string, password: string, pin: string) => boolean;
  register: (name: string, cpf: string, password: string, pin: string) => boolean;
  logout: () => void;
  isAdmin: () => boolean;
}