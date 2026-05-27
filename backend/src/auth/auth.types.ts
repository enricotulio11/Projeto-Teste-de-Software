export interface JwtPayload {
  sub: string;
  cpf: string;
  isAdmin: boolean;
}

export interface AuthenticatedUser {
  id: string;
  name: string;
  cpf: string;
  createdAt: Date;
  isAdmin: boolean;
  status: 'active' | 'inactive';
}

export interface AuthResponse {
  accessToken: string;
  user: AuthenticatedUser;
}
