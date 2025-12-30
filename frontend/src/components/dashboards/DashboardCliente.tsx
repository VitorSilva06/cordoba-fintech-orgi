import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { DollarSign, TrendingUp, Users, FileDown } from 'lucide-react';
import { Button } from '../ui/button';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { chartColors, chartConfig } from '../../config/chartColors';

// Dados mock estáticos
const mockIndicadores = [
  { label: 'Volume Contratado', value: 'R$ 2.500.000,00', icon: DollarSign },
  { label: 'Taxa de Recuperação', value: '32.5%', icon: TrendingUp },
  { label: 'Registros Ativos', value: '1.250', icon: Users },
  { label: 'Valor Recuperado', value: 'R$ 812.500,00', icon: DollarSign },
];

const mockRecuperacaoMensal = [
  { mes: 'Jan/24', valor: 120000 },
  { mes: 'Fev/24', valor: 135000 },
  { mes: 'Mar/24', valor: 128000 },
  { mes: 'Abr/24', valor: 142000 },
  { mes: 'Mai/24', valor: 155000 },
  { mes: 'Jun/24', valor: 132500 },
];

const mockStatusCarteira = [
  { faixa: '0-30 dias', quantidade: 450, percentual: 36 },
  { faixa: '31-60 dias', quantidade: 312, percentual: 25 },
  { faixa: '61-90 dias', quantidade: 238, percentual: 19 },
  { faixa: '91-120 dias', quantidade: 150, percentual: 12 },
  { faixa: '120+ dias', quantidade: 100, percentual: 8 },
];

export function DashboardCliente() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[var(--text-primary)] transition-colors duration-300">Dashboard Cliente</h1>
          <p className="text-[var(--text-secondary)] transition-colors duration-300">Indicadores da sua carteira de cobrança</p>
        </div>
        <Button className="bg-[var(--brand-primary)] hover:bg-[var(--brand-primary)]/90 gap-2 transition-colors duration-300">
          <FileDown className="w-4 h-4" />
          Exportar Relatório
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mockIndicadores.map((ind) => {
          const Icon = ind.icon;
          return (
            <Card key={ind.label} className="transition-colors duration-300">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-[var(--brand-primary)]/20 rounded-lg flex items-center justify-center transition-colors duration-300">
                    <Icon className="w-6 h-6 text-[var(--brand-primary)]" />
                  </div>
                </div>
                <p className="text-[var(--text-secondary)] text-sm transition-colors duration-300">{ind.label}</p>
                <p className="text-[var(--text-primary)] mt-1 transition-colors duration-300">{ind.value}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="transition-colors duration-300">
        <CardHeader>
          <CardTitle className="transition-colors duration-300">Evolução de Recuperação</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockRecuperacaoMensal}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartConfig.gridColor} opacity={0.3} />
              <XAxis 
                dataKey="mes" 
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
              />
              <Line 
                type="monotone" 
                dataKey="valor" 
                stroke={chartColors.primary} 
                strokeWidth={3}
                dot={{ fill: chartColors.primary, r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="transition-colors duration-300">
        <CardHeader>
          <CardTitle className="transition-colors duration-300">Status da Carteira por Faixa de Atraso</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockStatusCarteira.map((item, index) => {
              const barColors = [
                chartColors.success,
                chartColors.primary,
                chartColors.warning,
                chartColors.danger,
                chartColors.neutral
              ];
              return (
                <div key={item.faixa}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[var(--text-primary)] transition-colors duration-300">{item.faixa}</span>
                    <span className="text-[var(--text-secondary)] transition-colors duration-300">{item.quantidade} registros ({item.percentual}%)</span>
                  </div>
                  <div className="w-full bg-[var(--bg-secondary)] rounded-full h-2 transition-colors duration-300">
                    <div
                      className="h-2 rounded-full transition-colors duration-300"
                      style={{ 
                        width: `${item.percentual}%`,
                        backgroundColor: barColors[index]
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}