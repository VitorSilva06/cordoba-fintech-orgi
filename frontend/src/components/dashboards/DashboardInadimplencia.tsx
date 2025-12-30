import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { 
  TrendingUp, TrendingDown, Users, DollarSign, 
  AlertTriangle, CheckCircle, XCircle,
  MapPin, Calendar, AlertCircle
} from 'lucide-react';
import { chartColors, chartConfig } from '../../config/chartColors';

export function DashboardInadimplencia() {
  // KPIs Principais
  const kpis = [
    { 
      label: 'D+ Médio', 
      value: '—', 
      icon: Calendar, 
      color: chartColors.warning,
      trend: 'neutral',
      change: '—'
    },
    { 
      label: 'Bons Pagadores', 
      value: '—', 
      icon: CheckCircle, 
      color: chartColors.success,
      trend: 'neutral',
      change: '—'
    },
    { 
      label: 'Reincidentes', 
      value: '—', 
      icon: AlertCircle, 
      color: chartColors.warning,
      trend: 'neutral',
      change: '—'
    },
    { 
      label: 'Inadimplentes', 
      value: '—', 
      icon: XCircle, 
      color: chartColors.danger,
      trend: 'neutral',
      change: '—'
    },
    { 
      label: 'Ticket Médio', 
      value: '—', 
      icon: DollarSign, 
      color: chartColors.primary,
      trend: 'neutral',
      change: '—'
    },
    { 
      label: 'Idade Média', 
      value: '—', 
      icon: Users, 
      color: chartColors.info,
      trend: 'neutral',
      change: '—'
    },
  ];

  // Faixa Etária
  const faixaEtariaData: Array<{ faixa: string; clientes: number; inadimplencia: number; pagamEmDia: number }> = [];

  // Distribuição por Sexo
  const sexoData: Array<{ sexo: string; total: number; inadimplencia: number; ticketMedio: number }> = [];

  const sexoDistribuicao: Array<{ name: string; value: number; color: string }> = [];

  // Pontualidade
  const pontualidadeData: Array<{ status: string; percentual: number; quantidade: number }> = [];

  // Perfil de Risco
  const perfilRiscoData: Array<{ perfil: string; clientes: number; valor: number; percentual: number; risco: string; color: string }> = [];

  // Faixa de Atraso (D+)
  const faixaAtrasoData: Array<{ faixa: string; clientes: number; valor: number; idadeMedia: number; masculino: number; feminino: number; reincidencia: number }> = [];

  // Top Cidades - Maior Atraso
  const topCidadesAtraso: Array<{ cidade: string; estado: string; inadimplencia: number; clientes: number }> = [];

  // Top Cidades - Melhor Pagamento
  const topCidadesPagamento: Array<{ cidade: string; estado: string; pagamEmDia: number; clientes: number }> = [];

  // Faixas de Valor da Dívida
  const faixasValorData: Array<{ faixa: string; clientes: number; inadimplencia: number }> = [];

  // Reincidência
  const reincidenciaData: Array<{ categoria: string; clientes: number }> = [];

  // Comportamento ao longo do tempo
  const comportamentoTempoData: Array<{ mes: string; bosPagadores: number; moderados: number; reincidentes: number; naoPagadores: number }> = [];

  return (
    <div className="p-6 space-y-6 bg-[var(--bg-primary)] transition-colors duration-300">
      {/* Header */}
      <div>
        <h1 className="text-[var(--text-primary)] text-3xl transition-colors duration-300">Dashboard de Análise de Clientes</h1>
        <p className="text-[var(--text-secondary)] mt-1 transition-colors duration-300">Análise completa de inadimplência e comportamento de pagamento</p>
      </div>

      {/* KPIs Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <Card key={index} className="bg-[var(--bg-card)] border-[var(--border-primary)] transition-colors duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center transition-colors duration-300" style={{ backgroundColor: `${kpi.color}20` }}>
                    <Icon className="w-6 h-6" style={{ color: kpi.color }} />
                  </div>
                  {kpi.trend !== 'neutral' && (
                    <div className={`flex items-center gap-1 text-sm ${kpi.trend === 'up' ? 'text-[var(--brand-success)]' : 'text-[var(--brand-error)]'}`}>
                      {kpi.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      {kpi.change}
                    </div>
                  )}
                </div>
                <p className="text-[var(--text-secondary)] text-sm transition-colors duration-300">{kpi.label}</p>
                <p className="text-[var(--text-primary)] text-2xl mt-1 transition-colors duration-300">{kpi.value}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* SEÇÃO 1 - PERFIL DEMOGRÁFICO */}
      <div>
        <h2 className="text-[var(--text-primary)] text-2xl mb-4 transition-colors duration-300">Perfil Demográfico do Cliente</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Faixa Etária */}
          <Card className="bg-[var(--bg-card)] border-[var(--border-primary)] transition-colors duration-300">
            <CardHeader>
              <CardTitle className="text-[var(--text-primary)] transition-colors duration-300">Distribuição por Faixa Etária</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={faixaEtariaData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartConfig.gridColor} />
                  <XAxis dataKey="faixa" stroke={chartConfig.textColor} />
                  <YAxis stroke={chartConfig.textColor} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: chartConfig.tooltipBg, border: `1px solid ${chartConfig.tooltipBorder}`, borderRadius: '8px' }}
                    labelStyle={{ color: chartConfig.textColor }}
                  />
                  <Legend />
                  <Bar dataKey="clientes" fill={chartColors.primary} name="Clientes" />
                  <Bar dataKey="inadimplencia" fill={chartColors.danger} name="Inadimplência %" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Distribuição por Sexo */}
          <Card className="bg-[var(--bg-card)] border-[var(--border-primary)] transition-colors duration-300">
            <CardHeader>
              <CardTitle className="text-[var(--text-primary)] transition-colors duration-300">Distribuição por Sexo</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={sexoDistribuicao}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {sexoDistribuicao.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: chartConfig.tooltipBg, border: `1px solid ${chartConfig.tooltipBorder}`, borderRadius: '8px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-3">
                {sexoData.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-[var(--bg-secondary)] rounded-lg transition-colors duration-300">
                    <div>
                      <p className="text-[var(--text-primary)] transition-colors duration-300">{item.sexo}</p>
                      <p className="text-[var(--text-secondary)] text-sm transition-colors duration-300">Inadimplência: {item.inadimplencia}%</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[var(--text-primary)] transition-colors duration-300">R$ {item.ticketMedio}</p>
                      <p className="text-[var(--text-secondary)] text-sm transition-colors duration-300">Ticket médio</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Localidade - Top Cidades */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Maior Atraso */}
          <Card className="bg-[var(--bg-card)] border-[var(--border-primary)] transition-colors duration-300">
            <CardHeader>
              <CardTitle className="text-[var(--text-primary)] flex items-center gap-2 transition-colors duration-300">
                <AlertTriangle className="w-5 h-5 text-[var(--brand-error)]" />
                Top 5 - Maior Inadimplência
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topCidadesAtraso.map((cidade, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-[var(--bg-secondary)] rounded-lg border-l-4 transition-colors duration-300" style={{ borderLeftColor: chartColors.danger }}>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[var(--brand-error)]/20 flex items-center justify-center transition-colors duration-300">
                        <MapPin className="w-4 h-4 text-[var(--brand-error)]" />
                      </div>
                      <div>
                        <p className="text-[var(--text-primary)] transition-colors duration-300">{cidade.cidade} - {cidade.estado}</p>
                        <p className="text-[var(--text-secondary)] text-sm transition-colors duration-300">{cidade.clientes} clientes</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[var(--brand-error)] text-xl">{cidade.inadimplencia}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Melhor Pagamento */}
          <Card className="bg-[var(--bg-card)] border-[var(--border-primary)] transition-colors duration-300">
            <CardHeader>
              <CardTitle className="text-[var(--text-primary)] flex items-center gap-2 transition-colors duration-300">
                <CheckCircle className="w-5 h-5 text-[var(--brand-success)]" />
                Top 5 - Melhor Comportamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topCidadesPagamento.map((cidade, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-[var(--bg-secondary)] rounded-lg border-l-4 transition-colors duration-300" style={{ borderLeftColor: chartColors.success }}>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[var(--brand-success)]/20 flex items-center justify-center transition-colors duration-300">
                        <MapPin className="w-4 h-4 text-[var(--brand-success)]" />
                      </div>
                      <div>
                        <p className="text-[var(--text-primary)] transition-colors duration-300">{cidade.cidade} - {cidade.estado}</p>
                        <p className="text-[var(--text-secondary)] text-sm transition-colors duration-300">{cidade.clientes} clientes</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[var(--brand-success)] text-xl">{cidade.pagamEmDia}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* SEÇÃO 2 - PERFIL COMPORTAMENTAL */}
      <div>
        <h2 className="text-[var(--text-primary)] text-2xl mb-4 transition-colors duration-300">Perfil Comportamental (Histórico do Pagador)</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pontualidade */}
          <Card className="bg-[var(--bg-card)] border-[var(--border-primary)] transition-colors duration-300">
            <CardHeader>
              <CardTitle className="text-[var(--text-primary)] transition-colors duration-300">Pontualidade de Pagamento</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={pontualidadeData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke={chartConfig.gridColor} />
                  <XAxis type="number" stroke={chartConfig.textColor} />
                  <YAxis dataKey="status" type="category" stroke={chartConfig.textColor} width={150} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: chartConfig.tooltipBg, border: `1px solid ${chartConfig.tooltipBorder}`, borderRadius: '8px' }}
                    labelStyle={{ color: chartConfig.textColor }}
                  />
                  <Bar dataKey="percentual" fill={chartColors.primary} name="%" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Reincidência */}
          <Card className="bg-[var(--bg-card)] border-[var(--border-primary)] transition-colors duration-300">
            <CardHeader>
              <CardTitle className="text-[var(--text-primary)] transition-colors duration-300">Distribuição de Reincidência</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={reincidenciaData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartConfig.gridColor} />
                  <XAxis dataKey="categoria" stroke={chartConfig.textColor} />
                  <YAxis stroke={chartConfig.textColor} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: chartConfig.tooltipBg, border: `1px solid ${chartConfig.tooltipBorder}`, borderRadius: '8px' }}
                    labelStyle={{ color: chartConfig.textColor }}
                  />
                  <Bar dataKey="clientes" fill={chartColors.warning} name="Clientes" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* SEÇÃO 3 - PERFIL FINANCEIRO */}
      <div>
        <h2 className="text-[var(--text-primary)] text-2xl mb-4 transition-colors duration-300">Perfil Financeiro</h2>
        
        <Card className="bg-[var(--bg-card)] border-[var(--border-primary)] transition-colors duration-300">
          <CardHeader>
            <CardTitle className="text-[var(--text-primary)] transition-colors duration-300">Inadimplência por Faixa de Valor</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={faixasValorData}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartConfig.gridColor} />
                <XAxis dataKey="faixa" stroke={chartConfig.textColor} />
                <YAxis stroke={chartConfig.textColor} />
                <Tooltip 
                  contentStyle={{ backgroundColor: chartConfig.tooltipBg, border: `1px solid ${chartConfig.tooltipBorder}`, borderRadius: '8px' }}
                  labelStyle={{ color: chartConfig.textColor }}
                />
                <Legend />
                <Bar dataKey="clientes" fill={chartColors.primary} name="Clientes" />
                <Bar dataKey="inadimplencia" fill={chartColors.danger} name="Inadimplência %" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* SEÇÃO 4 - PROPENSÃO AO PAGAMENTO */}
      <div>
        <h2 className="text-[var(--text-primary)] text-2xl mb-4 transition-colors duration-300">Propensão ao Pagamento (Perfil de Risco)</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
          {perfilRiscoData.map((perfil, index) => (
            <Card key={index} className="bg-[var(--bg-card)] border-[var(--border-primary)] transition-colors duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Badge style={{ backgroundColor: perfil.color }}>{perfil.risco}</Badge>
                  <p className="text-[var(--text-primary)] text-2xl transition-colors duration-300">{perfil.percentual}%</p>
                </div>
                <p className="text-[var(--text-primary)] mb-2 transition-colors duration-300">{perfil.perfil}</p>
                <p className="text-[var(--text-secondary)] text-sm transition-colors duration-300">{perfil.clientes.toLocaleString('pt-BR')} clientes</p>
                <p className="text-[var(--text-secondary)] text-sm transition-colors duration-300">R$ {(perfil.valor / 1000000).toFixed(2)}M</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-[var(--bg-card)] border-[var(--border-primary)] transition-colors duration-300">
          <CardHeader>
            <CardTitle className="text-[var(--text-primary)] transition-colors duration-300">Evolução do Comportamento (Últimos 6 Meses)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={comportamentoTempoData}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartConfig.gridColor} />
                <XAxis dataKey="mes" stroke={chartConfig.textColor} />
                <YAxis stroke={chartConfig.textColor} />
                <Tooltip 
                  contentStyle={{ backgroundColor: chartConfig.tooltipBg, border: `1px solid ${chartConfig.tooltipBorder}`, borderRadius: '8px' }}
                  labelStyle={{ color: chartConfig.textColor }}
                />
                <Legend />
                <Line type="monotone" dataKey="bosPagadores" stroke={chartColors.success} strokeWidth={2} name="Bons Pagadores %" />
                <Line type="monotone" dataKey="moderados" stroke={chartColors.info} strokeWidth={2} name="Moderados %" />
                <Line type="monotone" dataKey="reincidentes" stroke={chartColors.warning} strokeWidth={2} name="Reincidentes %" />
                <Line type="monotone" dataKey="naoPagadores" stroke={chartColors.danger} strokeWidth={2} name="Não Pagadores %" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* SEÇÃO 5 - FAIXA DE ATRASO (D+) */}
      <div>
        <h2 className="text-[var(--text-primary)] text-2xl mb-4 transition-colors duration-300">Análise por Faixa de Atraso (D+)</h2>
        
        <Card className="bg-[var(--bg-card)] border-[var(--border-primary)] transition-colors duration-300">
          <CardHeader>
            <CardTitle className="text-[var(--text-primary)] transition-colors duration-300">Detalhamento por Período de Atraso</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--border-primary)]">
                    <th className="text-left text-[var(--text-secondary)] pb-3 px-2 transition-colors duration-300">Faixa D+</th>
                    <th className="text-left text-[var(--text-secondary)] pb-3 px-2 transition-colors duration-300">Clientes</th>
                    <th className="text-left text-[var(--text-secondary)] pb-3 px-2 transition-colors duration-300">Valor Total</th>
                    <th className="text-left text-[var(--text-secondary)] pb-3 px-2 transition-colors duration-300">Idade Média</th>
                    <th className="text-left text-[var(--text-secondary)] pb-3 px-2 transition-colors duration-300">Sexo (M/F)</th>
                    <th className="text-left text-[var(--text-secondary)] pb-3 px-2 transition-colors duration-300">Reincidência</th>
                  </tr>
                </thead>
                <tbody>
                  {faixaAtrasoData.map((item, index) => (
                    <tr key={index} className="border-b border-[var(--border-primary)]">
                      <td className="py-4 px-2">
                        <Badge style={{ backgroundColor: index < 2 ? chartColors.warning : chartColors.danger }}>
                          {item.faixa}
                        </Badge>
                      </td>
                      <td className="py-4 px-2 text-[var(--text-primary)] transition-colors duration-300">{item.clientes.toLocaleString('pt-BR')}</td>
                      <td className="py-4 px-2 text-[var(--text-primary)] transition-colors duration-300">R$ {item.valor.toLocaleString('pt-BR')}</td>
                      <td className="py-4 px-2 text-[var(--text-primary)] transition-colors duration-300">{item.idadeMedia} anos</td>
                      <td className="py-4 px-2 text-[var(--text-secondary)] transition-colors duration-300">{item.masculino}% / {item.feminino}%</td>
                      <td className="py-4 px-2">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-[var(--bg-secondary)] rounded-full h-2 transition-colors duration-300">
                            <div 
                              className="h-2 rounded-full transition-colors duration-300"
                              style={{ 
                                width: `${item.reincidencia}%`,
                                backgroundColor: item.reincidencia > 50 ? chartColors.danger : chartColors.warning
                              }}
                            />
                          </div>
                          <span className="text-[var(--text-primary)] text-sm transition-colors duration-300">{item.reincidencia}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
