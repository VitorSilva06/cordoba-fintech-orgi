/**
 * Dashboard Hook
 * Conecta com a API real de dashboards multi-tenant
 */
import { useState, useEffect, useCallback } from 'react';
import { 
  dashboardService, 
  DashboardPrincipal, 
  DashboardAnaliseClientes,
  TenantOverview 
} from '../services/dashboardService';

// Re-export types for components
export type { 
  DashboardPrincipal, 
  DashboardAnaliseClientes,
  TenantOverview, 
  FaixaAtraso, 
  DistribuicaoStatus, 
  TopDevedor,
  DistribuicaoFaixaEtaria,
  DistribuicaoSexo,
  ClienteRanking,
  PerfilDemografico,
  PontualidadePagamento,
  DistribuicaoReincidencia,
  PerfilComportamental,
  InadimplenciaPorFaixa,
  EvolucaoMensal,
  PerfilRisco,
  PropensaoPagamento,
  AnaliseClientePorFaixa,
} from '../services/dashboardService';

// Interface adaptada para manter compatibilidade com o componente Dashboard existente
export interface DashboardData {
  stats: {
    total_contratos: number;
    contratos_ativos: number;
    contratos_pagos: number;
    contratos_atrasados: number;
    valor_total_original: number;
    valor_total_pendente: number;
    media_atraso: number;
    total_devedores: number;
  };
  faixas_atraso: Array<{
    faixa: string;
    quantidade: number;
    valor: number;
    percentual: number;
  }>;
  distribuicao_status: Array<{
    status: string;
    quantidade: number;
    valor: number;
  }>;
  top_devedores: Array<{
    id?: number;
    nome: string;
    cpf_masked: string;
    total_contratos: number;
    valor_pendente: number;
    max_atraso: number;
  }>;
  updated_at: string;
  tenant_nome?: string;
}

/**
 * Converte dados da API para o formato esperado pelo componente Dashboard
 */
function transformApiResponse(apiData: DashboardPrincipal): DashboardData {
  return {
    stats: {
      total_contratos: apiData.total_contratos,
      contratos_ativos: apiData.contratos_ativos,
      contratos_pagos: apiData.contratos_pagos,
      contratos_atrasados: apiData.contratos_atrasados,
      valor_total_original: apiData.valor_total,
      valor_total_pendente: apiData.valor_total_carteira,
      media_atraso: apiData.media_atraso,
      total_devedores: apiData.total_devedores,
    },
    faixas_atraso: apiData.faixas_atraso.map(f => ({
      faixa: f.faixa,
      quantidade: f.quantidade,
      valor: f.valor_total,
      percentual: f.percentual,
    })),
    distribuicao_status: apiData.distribuicao_status.map(d => ({
      status: d.status.toLowerCase(),
      quantidade: d.quantidade,
      valor: d.valor_total,
    })),
    top_devedores: apiData.top_devedores.map((t, index) => ({
      id: index + 1,
      nome: t.nome,
      cpf_masked: t.cpf_mascarado,
      total_contratos: t.total_contratos,
      valor_pendente: t.valor_pendente,
      max_atraso: t.max_atraso,
    })),
    updated_at: new Date().toISOString(),
    tenant_nome: apiData.tenant_nome,
  };
}

interface UseDashboardOptions {
  tenantId?: number;
  consolidated?: boolean;
}

interface UseDashboardReturn {
  data: DashboardData | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useDashboard(options: UseDashboardOptions = {}): UseDashboardReturn {
  const { tenantId, consolidated = false } = options;
  
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      let apiData: DashboardPrincipal;
      
      if (consolidated) {
        // Dashboard consolidado (apenas diretores)
        apiData = await dashboardService.getDashboardConsolidado();
      } else {
        // Dashboard por tenant
        apiData = await dashboardService.getDashboardPrincipal(tenantId);
      }
      
      const transformedData = transformApiResponse(apiData);
      setData(transformedData);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar dashboard';
      
      // Trata erros específicos de autenticação
      if (typeof err === 'object' && err !== null && 'response' in err) {
        const axiosError = err as { response?: { status?: number; data?: { detail?: string } } };
        if (axiosError.response?.status === 401) {
          setError('Sessão expirada. Faça login novamente.');
        } else if (axiosError.response?.status === 403) {
          setError('Você não tem permissão para acessar esses dados.');
        } else {
          setError(axiosError.response?.data?.detail || errorMessage);
        }
      } else {
        setError(errorMessage);
      }
      
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, [tenantId, consolidated]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchDashboard,
  };
}

/**
 * Hook para listar tenants (apenas diretores)
 */
interface UseTenantsReturn {
  tenants: TenantOverview[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useTenants(): UseTenantsReturn {
  const [tenants, setTenants] = useState<TenantOverview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTenants = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await dashboardService.listTenants();
      setTenants(response.tenants);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar tenants';
      
      if (typeof err === 'object' && err !== null && 'response' in err) {
        const axiosError = err as { response?: { status?: number; data?: { detail?: string } } };
        if (axiosError.response?.status === 403) {
          setError('Apenas diretores podem visualizar todos os tenants.');
        } else {
          setError(axiosError.response?.data?.detail || errorMessage);
        }
      } else {
        setError(errorMessage);
      }
      
      setTenants([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTenants();
  }, [fetchTenants]);

  return {
    tenants,
    isLoading,
    error,
    refetch: fetchTenants,
  };
}

// Utility functions for formatting
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('pt-BR').format(value);
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

/**
 * Hook para Dashboard de Análise de Clientes
 */
interface UseAnaliseClientesOptions {
  tenantId?: number;
}

interface UseAnaliseClientesReturn {
  data: DashboardAnaliseClientes | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useAnaliseClientes(options: UseAnaliseClientesOptions = {}): UseAnaliseClientesReturn {
  const { tenantId } = options;
  
  const [data, setData] = useState<DashboardAnaliseClientes | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const apiData = await dashboardService.getDashboardAnaliseClientes(tenantId);
      setData(apiData);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar análise de clientes';
      
      if (typeof err === 'object' && err !== null && 'response' in err) {
        const axiosError = err as { response?: { status?: number; data?: { detail?: string } } };
        if (axiosError.response?.status === 401) {
          setError('Sessão expirada. Faça login novamente.');
        } else if (axiosError.response?.status === 403) {
          setError('Você não tem permissão para acessar esses dados.');
        } else {
          setError(axiosError.response?.data?.detail || errorMessage);
        }
      } else {
        setError(errorMessage);
      }
      
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, [tenantId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchData,
  };
}

export default useDashboard;
