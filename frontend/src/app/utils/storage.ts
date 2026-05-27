import { User, Dependent, Appointment } from '../types';

const STORAGE_KEYS = {
  USERS: 'medagenda_users',
  DEPENDENTS: 'medagenda_dependents',
  APPOINTMENTS: 'medagenda_appointments',
  CURRENT_USER: 'medagenda_current_user',
};

// Users
export function getUsers(): User[] {
  const data = localStorage.getItem(STORAGE_KEYS.USERS);
  return data ? JSON.parse(data) : [];
}

export function saveUser(user: User): void {
  const users = getUsers();
  const index = users.findIndex(u => u.id === user.id);
  
  if (index !== -1) {
    // Atualizar usuário existente
    users[index] = user;
  } else {
    // Adicionar novo usuário
    users.push(user);
  }
  
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
}

export function getUserByCPF(cpf: string): User | null {
  const users = getUsers();
  return users.find(u => u.cpf === cpf) || null;
}

// Current User
export function setCurrentUser(user: User): void {
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
}

export function getCurrentUser(): User | null {
  const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return data ? JSON.parse(data) : null;
}

export function clearCurrentUser(): void {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
}

// Dependents
export function getDependents(userId: string): Dependent[] {
  const data = localStorage.getItem(STORAGE_KEYS.DEPENDENTS);
  const allDependents: Dependent[] = data ? JSON.parse(data) : [];
  return allDependents.filter(d => d.userId === userId);
}

export function saveDependent(dependent: Dependent): void {
  const data = localStorage.getItem(STORAGE_KEYS.DEPENDENTS);
  const dependents: Dependent[] = data ? JSON.parse(data) : [];
  dependents.push(dependent);
  localStorage.setItem(STORAGE_KEYS.DEPENDENTS, JSON.stringify(dependents));
}

export function deleteDependent(dependentId: string): void {
  const data = localStorage.getItem(STORAGE_KEYS.DEPENDENTS);
  const dependents: Dependent[] = data ? JSON.parse(data) : [];
  const filtered = dependents.filter(d => d.id !== dependentId);
  localStorage.setItem(STORAGE_KEYS.DEPENDENTS, JSON.stringify(filtered));
}

export function getAllDependents(): Dependent[] {
  const data = localStorage.getItem(STORAGE_KEYS.DEPENDENTS);
  return data ? JSON.parse(data) : [];
}

// Appointments
export function getAppointments(userId: string): Appointment[] {
  const data = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
  const allAppointments: Appointment[] = data ? JSON.parse(data) : [];
  return allAppointments.filter(a => a.userId === userId);
}

export function saveAppointment(appointment: Appointment): void {
  const data = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
  const appointments: Appointment[] = data ? JSON.parse(data) : [];
  appointments.push(appointment);
  localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));
}

export function updateAppointment(appointmentId: string, updatedData: Partial<Appointment>): void {
  const data = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
  const appointments: Appointment[] = data ? JSON.parse(data) : [];
  const index = appointments.findIndex(a => a.id === appointmentId);
  
  if (index !== -1) {
    appointments[index] = { ...appointments[index], ...updatedData };
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));
  }
}

export function deleteAppointment(appointmentId: string): void {
  const data = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
  const appointments: Appointment[] = data ? JSON.parse(data) : [];
  const filtered = appointments.filter(a => a.id !== appointmentId);
  localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(filtered));
}

export function getAppointmentByDate(userId: string, date: string): Appointment[] {
  const appointments = getAppointments(userId);
  return appointments.filter(a => a.date === date);
}