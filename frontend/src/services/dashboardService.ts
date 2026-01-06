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
// TYPES - Dashboard Análise de Clientes
// ============================================

export interface DistribuicaoFaixaEtaria {
  faixa: string;
  quantidade: number;
  percentual: number;
}

export interface DistribuicaoSexo {
  sexo: string;
  quantidade: number;
  percentual: number;
}

export interface ClienteRanking {
  nome: string;
  cpf_mascarado: string;
  valor_total: number;
  total_contratos: number;
  taxa_inadimplencia: number;
}

export interface PerfilDemografico {
  distribuicao_faixa_etaria: DistribuicaoFaixaEtaria[];
  distribuicao_sexo: DistribuicaoSexo[];
  top_5_maior_inadimplencia: ClienteRanking[];
  top_5_melhor_comportamento: ClienteRanking[];
}

export interface PontualidadePagamento {
  categoria: string;
  quantidade: number;
  percentual: number;
}

export interface DistribuicaoReincidencia {
  categoria: string;
  quantidade: number;
  percentual: number;
}

export interface PerfilComportamental {
  pontualidade_pagamento: PontualidadePagamento[];
  distribuicao_reincidencia: DistribuicaoReincidencia[];
}

export interface InadimplenciaPorFaixa {
  faixa_valor: string;
  quantidade: number;
  valor_total: number;
  percentual: number;
}

export interface EvolucaoMensal {
  mes: string;
  novos_inadimplentes: number;
  recuperados: number;
  taxa_recuperacao: number;
}

export interface PerfilRisco {
  nivel: string;
  descricao: string;
  percentual: number;
  quantidade: number;
}

export interface PropensaoPagamento {
  evolucao_comportamento: EvolucaoMensal[];
  perfil_risco: PerfilRisco[];
}

export interface AnaliseClientePorFaixa {
  faixa_d_plus: string;
  total_clientes: number;
  valor_total: number;
  idade_media: number;
  sexo_m: number;
  sexo_f: number;
  reincidencia: number;
}

export interface DashboardAnaliseClientes {
  // KPIs principais
  d_plus_medio: number;
  bons_pagadores: number;
  reincidentes: number;
  inadimplentes: number;
  ticket_medio: number;
  idade_media: number;
  
  // Perfis
  perfil_demografico: PerfilDemografico;
  perfil_comportamental: PerfilComportamental;
  perfil_financeiro: InadimplenciaPorFaixa[];
  propensao_pagamento: PropensaoPagamento;
  analise_por_faixa: AnaliseClientePorFaixa[];
  
  // Tenant info (para diretores)
  tenant_id?: number;
  tenant_nome?: string;
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

  /**
   * Obtém o dashboard de análise de clientes
   * @param tenantId - ID do tenant (opcional para diretores)
   */
  async getDashboardAnaliseClientes(tenantId?: number): Promise<DashboardAnaliseClientes> {
    const params = tenantId ? { tenant_id: tenantId } : {};
    const response = await api.get<DashboardAnaliseClientes>('/dashboard/analise-clientes', { params });
    return response.data;
  },
};

export default dashboardService;
