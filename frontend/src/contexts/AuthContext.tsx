/**
 * AuthContext
 * Gerencia o estado de autenticação em toda a aplicação
 */
import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { authService, User, LoginCredentials, getErrorMessage, AccessStatus } from '../services/authService';

interface AuthContextType {
  user: User | null;
  accessStatus: AccessStatus | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  isDirector: boolean;
  isManager: boolean;
  isOperator: boolean;
  hasDataAccess: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [accessStatus, setAccessStatus] = useState<AccessStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshUser = useCallback(async () => {
    if (!authService.isAuthenticated()) {
      setUser(null);
      setAccessStatus(null);
      setIsLoading(false);
      return;
    }

    try {
      const [userData, statusData] = await Promise.all([
        authService.getCurrentUser(),
        authService.getAccessStatus()
      ]);
      setUser(userData);
      setAccessStatus(statusData);
      setError(null);
    } catch (err) {
      console.error('Erro ao carregar usuário:', err);
      setUser(null);
      setAccessStatus(null);
      // Se deu 401, limpa o token
      if (typeof err === 'object' && err !== null && 'response' in err) {
        const axiosError = err as { response?: { status?: number } };
        if (axiosError.response?.status === 401) {
          authService.logout();
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      await authService.login(credentials);
      await refreshUser();
      return true;
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setAccessStatus(null);
    setError(null);
  };

  const value: AuthContextType = {
    user,
    accessStatus,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    logout,
    refreshUser,
    isDirector: user?.role === 'diretor',
    isManager: user?.role === 'gerente',
    isOperator: user?.role === 'operador',
    hasDataAccess: accessStatus?.has_data_access ?? false,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}

export default AuthContext;
