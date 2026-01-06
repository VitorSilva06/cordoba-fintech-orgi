/**
 * Dashboard Service
 * Serviço para comunicação com a API de dashboards multi-tenant
 */
import api from './api';

// ============================================
// TYPES - Matching Backend Schemas
// ============================================

export interface DistribuicaoStatus {
  status: string;
  quantidade: number;
  percentual: number;
  valor_total: number;
}

export interface FaixaAtraso {
  faixa: string;
  quantidade: number;
  percentual: number;
  valor_total: number;
}

export interface TopDevedor {
  nome: string;
  cpf_mascarado: string;
  total_contratos: number;
  valor_pendente: number;
  max_atraso: number;
}

export interface DashboardPrincipal {
  // KPIs principais
  total_contratos: number;
  total_devedores: number;
  contratos_ativos: number;
  ativos: number;
  contratos_pagos: number;
  quitados: number;
  contratos_atrasados: number;
  atrasados: number;
  valor_total: number;
  valor_total_carteira: number;
  media_atraso: number;
  
  // Gráficos
  distribuicao_status: DistribuicaoStatus[];
  faixas_atraso: FaixaAtraso[];
  top_devedores: TopDevedor[];
  
  // Tenant info (para diretores)
  tenant_id?: number;
  tenant_nome?: string;
}

export interface TenantOverview {
  id: number;
  nome: string;
  cnpj: string;
  total_contratos: number;
  contratos_atrasados: number;
  valor_total: number;
}

export interface TenantsResponse {
  tenants: TenantOverview[];
}

// ============================================
// SERVICE
// ============================================

export const dashboardService = {
  /**
   * Obtém o dashboard principal
   * @param tenantId - ID do tenant (opcional para diretores)
   */
  async getDashboardPrincipal(tenantId?: number): Promise<DashboardPrincipal> {
    const params = tenantId ? { tenant_id: tenantId } : {};
    const response = await api.get<DashboardPrincipal>('/dashboard/principal', { params });
    return response.data;
  },

  /**
   * Obtém o dashboard consolidado (apenas diretores)
   */
  async getDashboardConsolidado(): Promise<DashboardPrincipal> {
    const response = await api.get<DashboardPrincipal>('/dashboard/principal/consolidado');
    return response.data;
  },

  /**
   * Lista todos os tenants com resumo (apenas diretores)
   */
  async listTenants(): Promise<TenantsResponse> {
    const response = await api.get<TenantsResponse>('/dashboard/tenants');
    return response.data;
  },
};

export default dashboardService;
