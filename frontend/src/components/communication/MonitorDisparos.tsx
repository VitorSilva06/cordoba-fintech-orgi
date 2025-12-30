import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Activity, Clock, CheckCircle2, XCircle, AlertCircle, Search, RefreshCw, Phone, MessageCircle } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { chartColors } from '../../config/chartColors';

export function MonitorDisparos() {
  const [tipoDisparo, setTipoDisparo] = useState('todos');
  const [statusFiltro, setStatusFiltro] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');

  // Dados de disparos em tempo real
  const disparosAtivos: Array<{ id: string; tipo: string; campanha: string; destino: string; status: string; progresso: number; total: number; inicio: string }> = [];

  // Estatísticas em tempo real
  const estatisticasRealTime = [
    { nome: 'Em Andamento', valor: 0, icon: Activity, cor: chartColors.primary },
    { nome: 'Na Fila', valor: 0, icon: Clock, cor: chartColors.warning },
    { nome: 'Concluídos Hoje', valor: 0, icon: CheckCircle2, cor: chartColors.success },
    { nome: 'Com Erro', valor: 0, icon: XCircle, cor: chartColors.danger },
  ];

  // Dados de performance por hora
  const performanceHora: Array<{ hora: string; whatsapp: number; voz: number; total: number }> = [];

  // Distribuição de status
  const distribuicaoStatus: Array<{ nome: string; valor: number; cor: string }> = [];

  // Taxa de sucesso por canal
  const sucessoCanal: Array<{ canal: string; sucesso: number; falha: number }> = [];

  const getStatusBadge = (status: string) => {
    const statusMap = {
      enviando: { label: 'Enviando', variant: 'default' as const, color: chartColors.primary },
      concluido: { label: 'Concluído', variant: 'default' as const, color: chartColors.success },
      pausado: { label: 'Pausado', variant: 'default' as const, color: chartColors.warning },
      fila: { label: 'Na Fila', variant: 'default' as const, color: chartColors.info },
      erro: { label: 'Erro', variant: 'destructive' as const, color: chartColors.danger },
    };
    const config = statusMap[status as keyof typeof statusMap];
    return <Badge variant={config.variant} style={{ backgroundColor: config.color }}>{config.label}</Badge>;
  };

  const getTipoIcon = (tipo: string) => {
    return tipo === 'WhatsApp' ? <MessageCircle className="w-4 h-4" /> : <Phone className="w-4 h-4" />;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-white text-2xl">Monitor de Disparos</h1>
          <p className="text-gray-300 mt-1">Acompanhamento em tempo real de campanhas ativas</p>
        </div>
        <Button className="bg-[#004BFF] hover:bg-[#0039CC]">
          <RefreshCw className="w-4 h-4 mr-2" />
          Atualizar
        </Button>
      </div>

      {/* Estatísticas em Tempo Real */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {estatisticasRealTime.map((stat, index) => (
          <Card key={index} className="bg-[#1a2942] border-[#004BFF]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm">{stat.nome}</p>
                  <p className="text-white text-3xl mt-2">{stat.valor}</p>
                </div>
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: `${stat.cor}20` }}>
                  <stat.icon className="w-6 h-6" style={{ color: stat.cor }} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Gráficos de Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance por Hora */}
        <Card className="bg-[#1a2942] border-[#004BFF]">
          <CardHeader>
            <CardTitle className="text-white">Performance por Hora</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceHora}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a3f5f" />
                <XAxis dataKey="hora" stroke="#F2F4F7" />
                <YAxis stroke="#F2F4F7" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0C1B33', border: `1px solid ${chartColors.primary}`, borderRadius: '8px' }}
                  labelStyle={{ color: '#F2F4F7' }}
                />
                <Legend />
                <Line type="monotone" dataKey="whatsapp" stroke={chartColors.success} strokeWidth={2} name="WhatsApp" />
                <Line type="monotone" dataKey="voz" stroke={chartColors.primary} strokeWidth={2} name="Voz" />
                <Line type="monotone" dataKey="total" stroke={chartColors.warning} strokeWidth={2} name="Total" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Distribuição de Status */}
        <Card className="bg-[#1a2942] border-[#004BFF]">
          <CardHeader>
            <CardTitle className="text-white">Distribuição de Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={distribuicaoStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ nome, valor, percent }) => `${nome}: ${valor} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="valor"
                >
                  {distribuicaoStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.cor} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0C1B33', border: `1px solid ${chartColors.primary}`, borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Taxa de Sucesso por Canal */}
      <Card className="bg-[#1a2942] border-[#004BFF]">
        <CardHeader>
          <CardTitle className="text-white">Taxa de Sucesso por Canal</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sucessoCanal}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a3f5f" />
              <XAxis dataKey="canal" stroke="#F2F4F7" />
              <YAxis stroke="#F2F4F7" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0C1B33', border: `1px solid ${chartColors.primary}`, borderRadius: '8px' }}
                labelStyle={{ color: '#F2F4F7' }}
              />
              <Legend />
              <Bar dataKey="sucesso" fill={chartColors.success} name="Sucesso %" />
              <Bar dataKey="falha" fill={chartColors.danger} name="Falha %" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Filtros */}
      <Card className="bg-[#1a2942] border-[#004BFF]">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-gray-300 text-sm mb-2 block">Tipo de Disparo</label>
              <Select value={tipoDisparo} onValueChange={setTipoDisparo}>
                <SelectTrigger className="bg-[#0C1B33] border-[#004BFF] text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="voz">Voz</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-gray-300 text-sm mb-2 block">Status</label>
              <Select value={statusFiltro} onValueChange={setStatusFiltro}>
                <SelectTrigger className="bg-[#0C1B33] border-[#004BFF] text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="enviando">Enviando</SelectItem>
                  <SelectItem value="concluido">Concluído</SelectItem>
                  <SelectItem value="pausado">Pausado</SelectItem>
                  <SelectItem value="fila">Na Fila</SelectItem>
                  <SelectItem value="erro">Erro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-gray-300 text-sm mb-2 block">Buscar</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="ID ou campanha..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-[#0C1B33] border-[#004BFF] text-white"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Disparos Ativos */}
      <Card className="bg-[#1a2942] border-[#004BFF]">
        <CardHeader>
          <CardTitle className="text-white">Disparos Ativos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {disparosAtivos.map((disparo) => (
              <div key={disparo.id} className="bg-[#0C1B33] p-4 rounded-lg border border-[#004BFF]">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#004BFF20] flex items-center justify-center">
                      {getTipoIcon(disparo.tipo)}
                    </div>
                    <div>
                      <p className="text-white">{disparo.campanha}</p>
                      <p className="text-gray-400 text-sm">ID: {disparo.id} • Início: {disparo.inicio}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(disparo.status)}
                    <Button size="sm" variant="outline" className="border-[#004BFF] text-white">
                      <AlertCircle className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">Progresso: {disparo.progresso}/{disparo.total}</span>
                    <span className="text-gray-300">{Math.round((disparo.progresso / disparo.total) * 100)}%</span>
                  </div>
                  <div className="w-full bg-[#2a3f5f] rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all"
                      style={{ 
                        width: `${(disparo.progresso / disparo.total) * 100}%`,
                        backgroundColor: disparo.status === 'erro' ? chartColors.danger : chartColors.success
                      }}
                    />
                  </div>
                  <p className="text-gray-400 text-sm">Destino: {disparo.destino}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
