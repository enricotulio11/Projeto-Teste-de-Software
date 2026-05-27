export interface User {
  id: string;
  name: string;
  cpf: string;
  password?: string;
  pin?: string;
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
  locationId: string;
  specialty: string;
  specialtyId: string;
  createdAt: string;
}

export interface Specialty {
  id: string;
  name: string;
  active: boolean;
  createdAt: string;
}

export interface Location {
  id: string;
  name: string;
  city: string;
  state: string;
  displayName: string;
  active: boolean;
  createdAt: string;
}

export interface AdminPerson {
  id: string;
  name: string;
  cpf: string;
  createdAt: string;
  type: 'Responsável' | 'Dependente';
  status: 'active' | 'inactive';
  userId?: string;
  isAdmin?: boolean;
}

export interface SecurityLog {
  id: string;
  type: string;
  user: string;
  cpf: string;
  timestamp: string;
  ipAddress: string;
  details: string;
}

export interface SystemSettings {
  systemName: string;
  maintenanceMode: boolean;
  allowRegistrations: boolean;
  emailNotifications: boolean;
  maxDependentsPerUser: number;
  sessionTimeout: number;
  enableSecurityLogs: boolean;
  requireStrongPasswords: boolean;
}

export interface AdminDashboardData {
  stats: {
    totalResponsaveis: number;
    totalDependentes: number;
    consultasEsteMes: number;
    alertasSistema: number;
  };
  chartData: Array<{ day: string; agendamentos: number }>;
}

export interface AuthContextType {
  currentUser: User | null;
  login: (cpf: string, password: string, pin: string) => Promise<User | null>;
  register: (name: string, cpf: string, password: string, pin: string) => Promise<User | null>;
  logout: () => void;
  isAdmin: () => boolean;
}
