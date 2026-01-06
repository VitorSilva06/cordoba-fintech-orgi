import axios from 'axios';
import api from './api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  is_active: boolean;
  is_superuser: boolean;
  role: 'operador' | 'gerente' | 'diretor';
  tenant_id: number | null;
  created_at: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface AccessStatus {
  has_data_access: boolean;
  is_director: boolean;
  tenant_id: number | null;
  role: string;
  message: string | null;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const formData = new URLSearchParams();
    formData.append('username', credentials.email);
    formData.append('password', credentials.password);

    const response = await api.post<LoginResponse>('/auth/login', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    if (response.data.access_token) {
      localStorage.setItem('access_token', response.data.access_token);
    }

    return response.data;
  },

  async register(data: RegisterData): Promise<User> {
    const response = await api.post<User>('/users/', data);
    return response.data;
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get<User>('/auth/me');
    return response.data;
  },

  async getAccessStatus(): Promise<AccessStatus> {
    const response = await api.get<AccessStatus>('/auth/me/access-status');
    return response.data;
  },

  logout(): void {
    localStorage.removeItem('access_token');
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  },
};

// Helper para extrair mensagem de erro
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.detail || error.message || 'Erro desconhecido';
  }
  return error instanceof Error ? error.message : 'Erro desconhecido';
}

export default authService;

