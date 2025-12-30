import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Users, Phone, DollarSign, Target } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import { Progress } from '../ui/progress';
import { chartColors, chartConfig } from '../../config/chartColors';

export function DashboardGerente() {
  const kpiEquipe = [
    { label: 'Meta do Mês', value: '—', progress: 0, icon: Target },
    { label: 'Contatos Realizados', value: '—', change: '—', icon: Phone },
    { label: 'Pagamentos Recebidos', value: '—', change: '—', icon: DollarSign },
    { label: 'Operadores Ativos', value: '—', change: '—', icon: Users },
  ];

  const performanceEquipe: Array<{ operador: string; contatos: number; conversoes: number; receita: number }> = [];

  const metasSemana = [
    { dia: 'Seg', meta: 0, realizado: 0 },
    { dia: 'Ter', meta: 0, realizado: 0 },
    { dia: 'Qua', meta: 0, realizado: 0 },
    { dia: 'Qui', meta: 0, realizado: 0 },
    { dia: 'Sex', meta: 0, realizado: 0 },
  ];

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl md:text-3xl text-[var(--text-primary)] transition-colors duration-300">Dashboard Gerente</h1>
        <p className="text-[var(--text-secondary)] mt-1 transition-colors duration-300">Acompanhamento de equipe e metas</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {kpiEquipe.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.label} className="bg-[var(--bg-card)] border-[var(--border-primary)] transition-colors duration-300">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-[var(--brand-primary)]/20 rounded-lg flex items-center justify-center transition-colors duration-300">
                    <Icon className="w-6 h-6 text-[var(--brand-primary)]" />
                  </div>
                </div>
                <p className="text-[var(--text-secondary)] text-sm transition-colors duration-300">{kpi.label}</p>
                <p className="text-[var(--text-primary)] text-xl md:text-2xl mt-1 transition-colors duration-300">{kpi.value}</p>
                {kpi.progress && (
                  <div className="mt-3">
                    <Progress value={kpi.progress} className="h-2" />
                    <p className="text-[var(--brand-primary)] text-xs mt-1 transition-colors duration-300">{kpi.progress}% da meta</p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <Card className="bg-[var(--bg-card)] border-[var(--border-primary)] transition-colors duration-300">
          <CardHeader>
            <CardTitle className="text-[var(--text-primary)] transition-colors duration-300">Metas da Semana</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={metasSemana}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartConfig.gridColor} opacity={0.3} />
                <XAxis 
                  dataKey="dia" 
                  tick={{ fill: chartConfig.textColor, fontSize: 12 }}
                  axisLine={{ stroke: chartConfig.borderColor, opacity: 0.5 }}
                />
                <YAxis 
                  tick={{ fill: chartConfig.textColor, fontSize: 12 }}
                  axisLine={{ stroke: chartConfig.borderColor, opacity: 0.5 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: chartConfig.tooltipBg, 
                    border: `1px solid ${chartConfig.tooltipBorder}`, 
                    borderRadius: '8px',
                    color: chartConfig.textColor
                  }}
                  labelStyle={{ color: chartColors.warning }}
                />
                <Legend 
                  wrapperStyle={{ color: chartConfig.textColor }}
                  iconType="circle"
                />
                <Bar dataKey="meta" fill={chartColors.info} opacity={0.5} name="Meta" radius={[8, 8, 0, 0]} />
                <Bar dataKey="realizado" fill={chartColors.primary} name="Realizado" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-[var(--bg-card)] border-[var(--border-primary)] transition-colors duration-300">
          <CardHeader>
            <CardTitle className="text-[var(--text-primary)] transition-colors duration-300">Performance da Equipe</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
              {performanceEquipe.map((op, idx) => (
                <div 
                  key={op.operador} 
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-primary)] hover:border-[var(--brand-primary)] transition-colors duration-300"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-8 h-8 rounded-full bg-[var(--brand-primary)]/20 flex items-center justify-center text-[var(--brand-primary)] font-semibold text-sm transition-colors duration-300">
                        {idx + 1}
                      </div>
                      <p className="text-[var(--text-primary)] font-medium transition-colors duration-300">{op.operador}</p>
                    </div>
                    <p className="text-[var(--text-secondary)] text-sm ml-10 transition-colors duration-300">
                      {op.contatos} contatos • {op.conversoes} conversões
                    </p>
                  </div>
                  <div className="text-right mt-2 sm:mt-0 ml-10 sm:ml-0">
                    <p className="text-[var(--brand-primary)] font-semibold text-lg transition-colors duration-300">
                      R$ {(op.receita / 1000).toFixed(0)}k
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-[var(--bg-card)] border-[var(--border-primary)] transition-colors duration-300">
        <CardHeader>
          <CardTitle className="text-[var(--text-primary)] transition-colors duration-300">Evolução de Conversões</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceEquipe}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartConfig.gridColor} opacity={0.3} />
              <XAxis 
                dataKey="operador" 
                tick={{ fill: chartConfig.textColor, fontSize: 11 }}
                axisLine={{ stroke: chartConfig.borderColor, opacity: 0.5 }}
                angle={-15}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                tick={{ fill: chartConfig.textColor, fontSize: 12 }}
                axisLine={{ stroke: chartConfig.borderColor, opacity: 0.5 }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: chartConfig.tooltipBg, 
                  border: `1px solid ${chartConfig.tooltipBorder}`, 
                  borderRadius: '8px',
                  color: chartConfig.textColor
                }}
                labelStyle={{ color: chartColors.warning }}
              />
              <Legend 
                wrapperStyle={{ color: chartConfig.textColor }}
                iconType="circle"
              />
              <Line 
                type="monotone" 
                dataKey="contatos" 
                stroke={chartColors.info} 
                strokeWidth={2}
                dot={{ fill: chartColors.info, r: 5 }}
                name="Contatos"
              />
              <Line 
                type="monotone" 
                dataKey="conversoes" 
                stroke={chartColors.success} 
                strokeWidth={2}
                dot={{ fill: chartColors.success, r: 5 }}
                name="Conversões"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}