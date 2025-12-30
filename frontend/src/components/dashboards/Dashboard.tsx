/**
 * Dashboard Component
 * Main dashboard using mock data from useDashboard hook.
 */
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { 
  TrendingUp, DollarSign, Users, Clock, 
  FileText, AlertTriangle, RefreshCcw, CheckCircle
} from 'lucide-react';
import { 
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { useDashboard, formatCurrency, formatNumber } from '../../hooks/useDashboard';
import { chartColors, chartConfig } from '../../config/chartColors';

export function Dashboard() {
  const { data, isLoading, error, refetch } = useDashboard();

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--brand-primary)]" />
          <p className="text-[var(--text-secondary)]">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card className="bg-[var(--bg-card)] border-[var(--brand-error)]">
          <CardContent className="p-6 flex flex-col items-center gap-4">
            <AlertTriangle className="w-12 h-12 text-[var(--brand-error)]" />
            <p className="text-[var(--text-primary)]">Erro ao carregar dashboard</p>
            <p className="text-[var(--text-secondary)] text-sm">{error}</p>
            <button 
              onClick={refetch}
              className="px-4 py-2 bg-[var(--brand-primary)] text-white rounded-lg hover:bg-[var(--brand-primary-hover)] transition-colors flex items-center gap-2"
            >
              <RefreshCcw className="w-4 h-4" />
              Tentar novamente
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6">
        <Card className="bg-[var(--bg-card)]">
          <CardContent className="p-6 text-center">
            <p className="text-[var(--text-secondary)]">Nenhum dado disponível</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { stats, faixas_atraso, distribuicao_status, top_devedores } = data;

  // KPIs
  const kpis = [
    { 
      label: 'Total Contratos', 
      value: formatNumber(stats.total_contratos), 
      icon: FileText, 
      color: chartColors.primary 
    },
    { 
      label: 'Contratos Ativos', 
      value: formatNumber(stats.contratos_ativos), 
      icon: Clock, 
      color: chartColors.warning 
    },
    { 
      label: 'Contratos Pagos', 
      value: formatNumber(stats.contratos_pagos), 
      icon: CheckCircle, 
      color: chartColors.success 
    },
    { 
      label: 'Contratos Atrasados', 
      value: formatNumber(stats.contratos_atrasados), 
      icon: AlertTriangle, 
      color: chartColors.danger 
    },
    { 
      label: 'Valor Total', 
      value: formatCurrency(stats.valor_total_original), 
      icon: DollarSign, 
      color: chartColors.info 
    },
    { 
      label: 'Média Atraso', 
      value: `${stats.media_atraso.toFixed(0)} dias`, 
      icon: TrendingUp, 
      color: chartColors.primary 
    },
  ];

  // Prepare pie chart data for status distribution
  const statusColors: Record<string, string> = {
    'pendente': chartColors.warning,
    'pago': chartColors.success,
    'atrasado': chartColors.danger,
    'negociacao': chartColors.info,
    'cancelado': chartColors.neutral,
  };

  const pieData = distribuicao_status.map(item => ({
    name: item.status.charAt(0).toUpperCase() + item.status.slice(1),
    value: item.quantidade,
    color: statusColors[item.status] || chartColors.primary,
  }));

  // Faixas de atraso chart data
  const faixasData = faixas_atraso.map(f => ({
    faixa: f.faixa,
    quantidade: f.quantidade,
    valor: f.valor,
    percentual: f.percentual,
  }));

  return (
    <div className="p-6 space-y-6 bg-[var(--bg-primary)] transition-colors duration-300">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[var(--text-primary)] text-3xl transition-colors duration-300">Dashboard</h1>
          <p className="text-[var(--text-secondary)] mt-1 transition-colors duration-300">
            Visão geral da carteira de cobrança
          </p>
        </div>
        <button 
          onClick={refetch}
          className="px-4 py-2 bg-[var(--bg-card)] border border-[var(--border-primary)] text-[var(--text-primary)] rounded-lg hover:bg-[var(--bg-secondary)] transition-colors flex items-center gap-2"
        >
          <RefreshCcw className="w-4 h-4" />
          Atualizar
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <Card key={index} className="bg-[var(--bg-card)] border-[var(--border-primary)] transition-colors duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center transition-colors duration-300" 
                    style={{ backgroundColor: `${kpi.color}20` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: kpi.color }} />
                  </div>
                </div>
                <p className="text-[var(--text-secondary)] text-sm transition-colors duration-300">{kpi.label}</p>
                <p className="text-[var(--text-primary)] text-2xl mt-1 font-semibold transition-colors duration-300">{kpi.value}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribuição por Status */}
        <Card className="bg-[var(--bg-card)] border-[var(--border-primary)] transition-colors duration-300">
          <CardHeader>
            <CardTitle className="text-[var(--text-primary)] transition-colors duration-300">
              Distribuição por Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: chartConfig.tooltipBg, 
                      border: `1px solid ${chartConfig.tooltipBorder}`, 
                      borderRadius: '8px' 
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center">
                <p className="text-[var(--text-muted)]">Sem dados disponíveis</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Faixas de Atraso */}
        <Card className="bg-[var(--bg-card)] border-[var(--border-primary)] transition-colors duration-300">
          <CardHeader>
            <CardTitle className="text-[var(--text-primary)] transition-colors duration-300">
              Faixas de Atraso (D+)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {faixasData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={faixasData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartConfig.gridColor} />
                  <XAxis dataKey="faixa" stroke={chartConfig.textColor} />
                  <YAxis stroke={chartConfig.textColor} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: chartConfig.tooltipBg, 
                      border: `1px solid ${chartConfig.tooltipBorder}`, 
                      borderRadius: '8px' 
                    }}
                    labelStyle={{ color: chartConfig.textColor }}
                    formatter={(value: number, name: string) => {
                      if (name === 'valor') return formatCurrency(value);
                      return value;
                    }}
                  />
                  <Legend />
                  <Bar dataKey="quantidade" fill={chartColors.primary} name="Quantidade" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center">
                <p className="text-[var(--text-muted)]">Sem dados disponíveis</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top Devedores */}
      <Card className="bg-[var(--bg-card)] border-[var(--border-primary)] transition-colors duration-300">
        <CardHeader>
          <CardTitle className="text-[var(--text-primary)] flex items-center gap-2 transition-colors duration-300">
            <Users className="w-5 h-5" />
            Top Devedores
          </CardTitle>
        </CardHeader>
        <CardContent>
          {top_devedores.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--border-primary)]">
                    <th className="text-left text-[var(--text-secondary)] pb-3 px-2">Nome</th>
                    <th className="text-left text-[var(--text-secondary)] pb-3 px-2">CPF</th>
                    <th className="text-left text-[var(--text-secondary)] pb-3 px-2">Contratos</th>
                    <th className="text-left text-[var(--text-secondary)] pb-3 px-2">Valor Pendente</th>
                    <th className="text-left text-[var(--text-secondary)] pb-3 px-2">Max Atraso</th>
                  </tr>
                </thead>
                <tbody>
                  {top_devedores.map((devedor) => (
                    <tr key={devedor.id} className="border-b border-[var(--border-primary)] hover:bg-[var(--bg-secondary)] transition-colors">
                      <td className="py-4 px-2 text-[var(--text-primary)]">{devedor.nome}</td>
                      <td className="py-4 px-2 text-[var(--text-secondary)]">{devedor.cpf_masked}</td>
                      <td className="py-4 px-2 text-[var(--text-primary)]">{devedor.total_contratos}</td>
                      <td className="py-4 px-2 text-[var(--brand-error)] font-semibold">{formatCurrency(devedor.valor_pendente)}</td>
                      <td className="py-4 px-2">
                        <span 
                          className="px-2 py-1 rounded text-sm"
                          style={{ 
                            backgroundColor: devedor.max_atraso > 60 ? `${chartColors.danger}20` : `${chartColors.warning}20`,
                            color: devedor.max_atraso > 60 ? chartColors.danger : chartColors.warning
                          }}
                        >
                          {devedor.max_atraso} dias
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-[var(--text-muted)]">Nenhum devedor encontrado</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Last Update */}
      <p className="text-[var(--text-muted)] text-sm text-right">
        Última atualização: {new Date(data.updated_at).toLocaleString('pt-BR')}
      </p>
    </div>
  );
}

export default Dashboard;
