/**
 * Dashboard Hook
 * Mock version - no API connection
 */
import { useState, useEffect, useCallback } from 'react';

// Types
export interface DashboardStats {
  total_contratos: number;
  contratos_ativos: number;
  contratos_pagos: number;
  contratos_atrasados: number;
  valor_total_original: number;
  valor_total_pendente: number;
  media_atraso: number;
  total_devedores: number;
}

export interface FaixaAtraso {
  faixa: string;
  quantidade: number;
  valor: number;
  percentual: number;
}

export interface DistribuicaoStatus {
  status: string;
  quantidade: number;
  valor: number;
}

export interface EvolucaoMensal {
  mes: string;
  novos_contratos: number;
  valor_total: number;
}

export interface TopDevedor {
  id: number;
  nome: string;
  cpf_masked: string;
  total_contratos: number;
  valor_pendente: number;
  max_atraso: number;
}

export interface DashboardData {
  stats: DashboardStats;
  faixas_atraso: FaixaAtraso[];
  distribuicao_status: DistribuicaoStatus[];
  evolucao_mensal: EvolucaoMensal[];
  top_devedores: TopDevedor[];
  updated_at: string;
}

// Mock data
const MOCK_DASHBOARD: DashboardData = {
  stats: {
    total_contratos: 1250,
    contratos_ativos: 890,
    contratos_pagos: 280,
    contratos_atrasados: 80,
    valor_total_original: 2500000,
    valor_total_pendente: 1800000,
    media_atraso: 32,
    total_devedores: 650,
  },
  faixas_atraso: [
    { faixa: '0-30 dias', quantidade: 320, valor: 450000, percentual: 36 },
    { faixa: '31-60 dias', quantidade: 280, valor: 520000, percentual: 31.5 },
    { faixa: '61-90 dias', quantidade: 180, valor: 380000, percentual: 20.2 },
    { faixa: '91-120 dias', quantidade: 70, valor: 280000, percentual: 7.9 },
    { faixa: '120+ dias', quantidade: 40, valor: 170000, percentual: 4.5 },
  ],
  distribuicao_status: [
    { status: 'pendente', quantidade: 450, valor: 850000 },
    { status: 'atrasado', quantidade: 280, valor: 520000 },
    { status: 'pago', quantidade: 380, valor: 680000 },
    { status: 'negociacao', quantidade: 140, valor: 250000 },
  ],
  evolucao_mensal: [
    { mes: 'Jul/24', novos_contratos: 85, valor_total: 180000 },
    { mes: 'Ago/24', novos_contratos: 92, valor_total: 195000 },
    { mes: 'Set/24', novos_contratos: 78, valor_total: 165000 },
    { mes: 'Out/24', novos_contratos: 105, valor_total: 220000 },
    { mes: 'Nov/24', novos_contratos: 118, valor_total: 245000 },
    { mes: 'Dez/24', novos_contratos: 95, valor_total: 198000 },
  ],
  top_devedores: [
    { id: 1, nome: 'João Silva', cpf_masked: '***.***.***-12', total_contratos: 5, valor_pendente: 45000, max_atraso: 95 },
    { id: 2, nome: 'Maria Santos', cpf_masked: '***.***.***-34', total_contratos: 3, valor_pendente: 38000, max_atraso: 72 },
    { id: 3, nome: 'Carlos Oliveira', cpf_masked: '***.***.***-56', total_contratos: 4, valor_pendente: 32000, max_atraso: 58 },
    { id: 4, nome: 'Ana Pereira', cpf_masked: '***.***.***-78', total_contratos: 2, valor_pendente: 28000, max_atraso: 45 },
    { id: 5, nome: 'Pedro Costa', cpf_masked: '***.***.***-90', total_contratos: 3, valor_pendente: 25000, max_atraso: 38 },
  ],
  updated_at: new Date().toISOString(),
};

interface UseDashboardReturn {
  data: DashboardData | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useDashboard(): UseDashboardReturn {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Return mock data
    setData({ ...MOCK_DASHBOARD, updated_at: new Date().toISOString() });
    setIsLoading(false);
  }, []);

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

export default useDashboard;
