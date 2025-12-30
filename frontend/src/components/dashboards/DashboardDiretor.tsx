import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { TrendingUp, TrendingDown, DollarSign, Activity, Phone } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { chartColors, chartConfig, multiColors } from '../../config/chartColors';

// Dados mock estáticos
const mockKpiData = [
  { label: 'Volume Total', value: 'R$ 2.500.000,00', change: '+12%', trend: 'up', icon: DollarSign },
  { label: 'Taxa de Recuperação', value: '32.5%', change: '+5.2%', trend: 'up', icon: TrendingUp },
  { label: 'Aging Médio', value: '45 dias', change: '-8%', trend: 'down', icon: Activity },
  { label: 'Canais Ativos', value: '4', change: '+1', trend: 'up', icon: Phone },
];

const mockFluxoCaixaData = [
  { mes: 'Jan', entrada: 180000, saida: 120000 },
  { mes: 'Fev', entrada: 195000, saida: 135000 },
  { mes: 'Mar', entrada: 165000, saida: 110000 },
  { mes: 'Abr', entrada: 220000, saida: 145000 },
  { mes: 'Mai', entrada: 245000, saida: 160000 },
  { mes: 'Jun', entrada: 198000, saida: 130000 },
];

const mockCanaisData = [
  { name: 'WhatsApp', value: 45 },
  { name: 'SMS', value: 25 },
  { name: 'Email', value: 18 },
  { name: 'Voz', value: 12 },
];

const mockTaxaRecuperacaoPorFaixa = [
  { faixa: '0-30', taxa: 68 },
  { faixa: '31-60', taxa: 52 },
  { faixa: '61-90', taxa: 38 },
  { faixa: '91-120', taxa: 24 },
  { faixa: '120+', taxa: 12 },
];

export function DashboardDiretor() {
  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl md:text-3xl text-white">Dashboard Diretor</h1>
        <p className="text-gray-300 mt-1">Visão global do sistema de cobrança</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {mockKpiData.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.label} className="bg-[#1a2942] border-[#004BFF]">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 bg-[#004BFF]/20 rounded-lg flex items-center justify-center">
                    <Icon className="w-6 h-6 text-[#004BFF]" />
                  </div>
                  <div className={`flex items-center gap-1 text-sm ${kpi.trend === 'up' ? 'text-[#00C08A]' : 'text-[#ff4444]'}`}>
                    {kpi.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    {kpi.change}
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-gray-300 text-sm">{kpi.label}</p>
                  <p className="text-white text-xl md:text-2xl mt-1">{kpi.value}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <Card className="lg:col-span-2 bg-[#1a2942] border-[#004BFF]">
          <CardHeader>
            <CardTitle className="text-white">Fluxo de Caixa</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockFluxoCaixaData}>
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
                  labelStyle={{ color: chartColors.warning }}
                />
                <Legend 
                  wrapperStyle={{ color: chartConfig.textColor }}
                  iconType="circle"
                />
                <Bar dataKey="entrada" fill={chartColors.success} name="Entrada" radius={[8, 8, 0, 0]} />
                <Bar dataKey="saida" fill={chartColors.danger} name="Saída" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-[#1a2942] border-[#004BFF]">
          <CardHeader>
            <CardTitle className="text-white">Canais Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={mockCanaisData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {mockCanaisData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={multiColors[index % multiColors.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: chartConfig.tooltipBg, 
                    border: `1px solid ${chartConfig.tooltipBorder}`, 
                    borderRadius: '8px',
                    color: chartConfig.textColor
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-[#1a2942] border-[#004BFF]">
        <CardHeader>
          <CardTitle className="text-white">Taxa de Recuperação por Faixa de Atraso</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockTaxaRecuperacaoPorFaixa}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartConfig.gridColor} opacity={0.3} />
              <XAxis 
                dataKey="faixa" 
                tick={{ fill: chartConfig.textColor, fontSize: 12 }}
                axisLine={{ stroke: chartConfig.borderColor, opacity: 0.5 }}
                label={{ value: 'Dias de Atraso', position: 'insideBottom', offset: -5, fill: chartColors.warning }}
              />
              <YAxis 
                tick={{ fill: chartConfig.textColor, fontSize: 12 }}
                axisLine={{ stroke: chartConfig.borderColor, opacity: 0.5 }}
                label={{ value: 'Taxa (%)', angle: -90, position: 'insideLeft', fill: chartColors.warning }}
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
              <Line 
                type="monotone" 
                dataKey="taxa" 
                stroke={chartColors.primary} 
                strokeWidth={3}
                dot={{ fill: chartColors.primary, r: 6 }}
                activeDot={{ r: 8, fill: chartColors.warning }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
