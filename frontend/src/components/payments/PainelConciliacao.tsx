import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { CheckCircle2, AlertTriangle, DollarSign, Clock, Search, Download } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';
import { chartColors } from '../../config/chartColors';

export function PainelConciliacao() {
  const [periodo, setPeriodo] = useState('hoje');
  const [statusFiltro, setStatusFiltro] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');

  // Estatísticas de conciliação
  const estatisticas = [
    { nome: 'Conciliados', valor: 0, percentual: '—', icon: CheckCircle2, cor: chartColors.success },
    { nome: 'Pendentes', valor: 0, percentual: '—', icon: Clock, cor: chartColors.warning },
    { nome: 'Divergentes', valor: 0, percentual: '—', icon: AlertTriangle, cor: chartColors.danger },
    { nome: 'Valor Conciliado', valor: '—', percentual: '—', icon: DollarSign, cor: chartColors.info },
  ];

  // Dados de conciliação ao longo do tempo
  const conciliacaoTempo: Array<{ data: string; conciliados: number; pendentes: number; divergentes: number }> = [];

  // Distribuição por gateway
  const distribuicaoGateway: Array<{ gateway: string; conciliados: number; pendentes: number; divergentes: number; cor: string }> = [];

  // Status por método de pagamento
  const statusMetodo: Array<{ metodo: string; total: number; conciliado: number; taxa: number }> = [];

  // Transações recentes
  const transacoes: Array<{ id: string; gateway: string; valor: number; status: string; metodo: string; data: string; clienteId: string; transacaoId: string }> = [];

  // Distribuição de status
  const statusDistribuicao: Array<{ nome: string; valor: number; cor: string }> = [];

  const getStatusBadge = (status: string) => {
    const statusMap = {
      conciliado: { label: 'Conciliado', color: chartColors.success },
      pendente: { label: 'Pendente', color: chartColors.warning },
      divergente: { label: 'Divergente', color: chartColors.danger },
    };
    const config = statusMap[status as keyof typeof statusMap];
    return <Badge style={{ backgroundColor: config.color }}>{config.label}</Badge>;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-white text-2xl">Painel de Conciliação</h1>
          <p className="text-gray-300 mt-1">Reconciliação automática de pagamentos</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-[#004BFF] text-white">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Button className="bg-[#00C08A] hover:bg-[#00A876]">
            Conciliar Manualmente
          </Button>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {estatisticas.map((stat, index) => (
          <Card key={index} className="bg-[#1a2942] border-[#004BFF]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm">{stat.nome}</p>
                  <p className="text-white text-3xl mt-2">{stat.valor}</p>
                  <p className="text-sm mt-1" style={{ color: stat.cor }}>{stat.percentual}</p>
                </div>
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: `${stat.cor}20` }}>
                  <stat.icon className="w-6 h-6" style={{ color: stat.cor }} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Gráfico de Tendência */}
      <Card className="bg-[#1a2942] border-[#004BFF]">
        <CardHeader>
          <CardTitle className="text-white">Tendência de Conciliação</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={conciliacaoTempo}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a3f5f" />
              <XAxis dataKey="data" stroke="#F2F4F7" />
              <YAxis stroke="#F2F4F7" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0C1B33', border: `1px solid ${chartColors.primary}`, borderRadius: '8px' }}
                labelStyle={{ color: '#F2F4F7' }}
              />
              <Legend />
              <Line type="monotone" dataKey="conciliados" stroke={chartColors.success} strokeWidth={2} name="Conciliados" />
              <Line type="monotone" dataKey="pendentes" stroke={chartColors.warning} strokeWidth={2} name="Pendentes" />
              <Line type="monotone" dataKey="divergentes" stroke={chartColors.danger} strokeWidth={2} name="Divergentes" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Gráficos de Análise */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribuição por Gateway */}
        <Card className="bg-[#1a2942] border-[#004BFF]">
          <CardHeader>
            <CardTitle className="text-white">Status por Gateway</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={distribuicaoGateway}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a3f5f" />
                <XAxis dataKey="gateway" stroke="#F2F4F7" />
                <YAxis stroke="#F2F4F7" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0C1B33', border: `1px solid ${chartColors.primary}`, borderRadius: '8px' }}
                  labelStyle={{ color: '#F2F4F7' }}
                />
                <Legend />
                <Bar dataKey="conciliados" fill={chartColors.success} name="Conciliados" stackId="a" />
                <Bar dataKey="pendentes" fill={chartColors.warning} name="Pendentes" stackId="a" />
                <Bar dataKey="divergentes" fill={chartColors.danger} name="Divergentes" stackId="a" />
              </BarChart>
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
                  data={statusDistribuicao}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ nome, valor, percent }) => `${nome}: ${valor} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="valor"
                >
                  {statusDistribuicao.map((entry, index) => (
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

      {/* Taxa de Conciliação por Método */}
      <Card className="bg-[#1a2942] border-[#004BFF]">
        <CardHeader>
          <CardTitle className="text-white">Taxa de Conciliação por Método</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {statusMetodo.map((metodo, index) => (
              <div key={index} className="bg-[#0C1B33] p-4 rounded-lg border border-[#004BFF]">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-white">{metodo.metodo}</p>
                    <p className="text-gray-400 text-sm">{metodo.conciliado} de {metodo.total} transações</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white text-2xl">{metodo.taxa}%</p>
                    <p className="text-gray-400 text-sm">Taxa de sucesso</p>
                  </div>
                </div>
                <div className="w-full bg-[#2a3f5f] rounded-full h-2">
                  <div 
                    className="h-2 rounded-full"
                    style={{ 
                      width: `${metodo.taxa}%`,
                      backgroundColor: chartColors.success
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filtros */}
      <Card className="bg-[#1a2942] border-[#004BFF]">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-gray-300 text-sm mb-2 block">Período</label>
              <Select value={periodo} onValueChange={setPeriodo}>
                <SelectTrigger className="bg-[#0C1B33] border-[#004BFF] text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hoje">Hoje</SelectItem>
                  <SelectItem value="semana">Esta Semana</SelectItem>
                  <SelectItem value="mes">Este Mês</SelectItem>
                  <SelectItem value="trimestre">Este Trimestre</SelectItem>
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
                  <SelectItem value="conciliado">Conciliados</SelectItem>
                  <SelectItem value="pendente">Pendentes</SelectItem>
                  <SelectItem value="divergente">Divergentes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-gray-300 text-sm mb-2 block">Buscar</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="ID da transação..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-[#0C1B33] border-[#004BFF] text-white"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Transações */}
      <Card className="bg-[#1a2942] border-[#004BFF]">
        <CardHeader>
          <CardTitle className="text-white">Transações Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#004BFF]">
                  <th className="text-left text-gray-300 pb-3">ID</th>
                  <th className="text-left text-gray-300 pb-3">Gateway</th>
                  <th className="text-left text-gray-300 pb-3">Transação ID</th>
                  <th className="text-left text-gray-300 pb-3">Valor</th>
                  <th className="text-left text-gray-300 pb-3">Método</th>
                  <th className="text-left text-gray-300 pb-3">Status</th>
                  <th className="text-left text-gray-300 pb-3">Data</th>
                  <th className="text-left text-gray-300 pb-3">Ações</th>
                </tr>
              </thead>
              <tbody>
                {transacoes.map((transacao) => (
                  <tr key={transacao.id} className="border-b border-[#2a3f5f]">
                    <td className="py-3 text-white">{transacao.id}</td>
                    <td className="py-3 text-white">{transacao.gateway}</td>
                    <td className="py-3 text-gray-300 text-sm">{transacao.transacaoId}</td>
                    <td className="py-3 text-white">R$ {transacao.valor.toFixed(2)}</td>
                    <td className="py-3 text-white">{transacao.metodo}</td>
                    <td className="py-3">{getStatusBadge(transacao.status)}</td>
                    <td className="py-3 text-gray-300">{transacao.data}</td>
                    <td className="py-3">
                      {transacao.status === 'divergente' && (
                        <Button size="sm" variant="outline" className="border-[#004BFF] text-white">
                          Resolver
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
