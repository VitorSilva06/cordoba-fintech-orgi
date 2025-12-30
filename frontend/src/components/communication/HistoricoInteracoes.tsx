import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { MessageCircle, Phone, Calendar as CalendarIcon, Search, Download, ChevronDown, ChevronUp, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { chartColors } from '../../config/chartColors';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function HistoricoInteracoes() {
  const [dataInicio, setDataInicio] = useState<Date>();
  const [dataFim, setDataFim] = useState<Date>();
  const [canalFiltro, setCanalFiltro] = useState('todos');
  const [statusFiltro, setStatusFiltro] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  // Histórico de interações
  const interacoes: Array<{ id: string; cliente: string; cpf: string; canal: string; tipo: string; status: string; data: string; duracao: string; operador: string; campanha: string; mensagem: string; resposta: string | null; tags: string[] }> = [];

  // Dados para gráficos
  const interacoesPorDia: Array<{ data: string; whatsapp: number; voz: number; total: number }> = [];

  const taxaResposta: Array<{ canal: string; respondidas: number; nao_respondidas: number }> = [];

  const getStatusBadge = (status: string) => {
    const statusMap = {
      entregue: { label: 'Entregue', icon: CheckCircle2, color: chartColors.success },
      completada: { label: 'Completada', icon: CheckCircle2, color: chartColors.success },
      lida: { label: 'Lida', icon: Clock, color: chartColors.info },
      nao_atendida: { label: 'Não Atendida', icon: XCircle, color: chartColors.warning },
      falha: { label: 'Falha', icon: XCircle, color: chartColors.danger },
    };
    const config = statusMap[status as keyof typeof statusMap];
    return (
      <Badge variant="default" style={{ backgroundColor: config.color }} className="flex items-center gap-1">
        <config.icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  const getCanalIcon = (canal: string) => {
    return canal === 'WhatsApp' ? 
      <MessageCircle className="w-4 h-4" style={{ color: chartColors.success }} /> : 
      <Phone className="w-4 h-4" style={{ color: chartColors.primary }} />;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-white text-2xl">Histórico de Interações</h1>
          <p className="text-gray-300 mt-1">Registro completo de todas as comunicações com clientes</p>
        </div>
        <Button className="bg-[#00C08A] hover:bg-[#00A876]">
          <Download className="w-4 h-4 mr-2" />
          Exportar Relatório
        </Button>
      </div>

      {/* Gráficos de Análise */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Interações por Dia */}
        <Card className="bg-[#1a2942] border-[#004BFF]">
          <CardHeader>
            <CardTitle className="text-white">Interações por Dia</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={interacoesPorDia}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a3f5f" />
                <XAxis dataKey="data" stroke="#F2F4F7" />
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

        {/* Taxa de Resposta */}
        <Card className="bg-[#1a2942] border-[#004BFF]">
          <CardHeader>
            <CardTitle className="text-white">Taxa de Resposta por Canal</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={taxaResposta}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a3f5f" />
                <XAxis dataKey="canal" stroke="#F2F4F7" />
                <YAxis stroke="#F2F4F7" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0C1B33', border: `1px solid ${chartColors.primary}`, borderRadius: '8px' }}
                  labelStyle={{ color: '#F2F4F7' }}
                />
                <Legend />
                <Bar dataKey="respondidas" fill={chartColors.success} name="Respondidas %" stackId="a" />
                <Bar dataKey="nao_respondidas" fill={chartColors.danger} name="Não Respondidas %" stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card className="bg-[#1a2942] border-[#004BFF]">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="text-gray-300 text-sm mb-2 block">Data Início</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left bg-[#0C1B33] border-[#004BFF] text-white">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dataInicio ? format(dataInicio, 'dd/MM/yyyy', { locale: ptBR }) : 'Selecionar'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dataInicio}
                    onSelect={setDataInicio}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <label className="text-gray-300 text-sm mb-2 block">Data Fim</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left bg-[#0C1B33] border-[#004BFF] text-white">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dataFim ? format(dataFim, 'dd/MM/yyyy', { locale: ptBR }) : 'Selecionar'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dataFim}
                    onSelect={setDataFim}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <label className="text-gray-300 text-sm mb-2 block">Canal</label>
              <Select value={canalFiltro} onValueChange={setCanalFiltro}>
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
                  <SelectItem value="entregue">Entregue</SelectItem>
                  <SelectItem value="completada">Completada</SelectItem>
                  <SelectItem value="lida">Lida</SelectItem>
                  <SelectItem value="nao_atendida">Não Atendida</SelectItem>
                  <SelectItem value="falha">Falha</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-gray-300 text-sm mb-2 block">Buscar</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Cliente ou CPF..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-[#0C1B33] border-[#004BFF] text-white"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Histórico */}
      <Card className="bg-[#1a2942] border-[#004BFF]">
        <CardHeader>
          <CardTitle className="text-white">Registro de Interações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {interacoes.map((interacao) => (
              <div key={interacao.id} className="bg-[#0C1B33] rounded-lg border border-[#004BFF] overflow-hidden">
                <div 
                  className="p-4 cursor-pointer hover:bg-[#1a2942] transition-colors"
                  onClick={() => setExpandedRow(expandedRow === interacao.id ? null : interacao.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#004BFF20] flex items-center justify-center">
                        {getCanalIcon(interacao.canal)}
                      </div>
                      <div>
                        <p className="text-white">{interacao.cliente}</p>
                        <p className="text-gray-400 text-sm">{interacao.cpf}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right hidden md:block">
                        <p className="text-white text-sm">{interacao.campanha}</p>
                        <p className="text-gray-400 text-xs">{interacao.tipo}</p>
                      </div>
                      <div className="text-right hidden lg:block">
                        <p className="text-white text-sm">{interacao.data}</p>
                        <p className="text-gray-400 text-xs">{interacao.duracao}</p>
                      </div>
                      {getStatusBadge(interacao.status)}
                      {expandedRow === interacao.id ? 
                        <ChevronUp className="w-5 h-5 text-gray-400" /> : 
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      }
                    </div>
                  </div>
                </div>

                {expandedRow === interacao.id && (
                  <div className="p-4 border-t border-[#004BFF] bg-[#0a1628] space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-400 text-sm mb-1">Operador</p>
                        <p className="text-white">{interacao.operador}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm mb-1">Data e Hora</p>
                        <p className="text-white">{interacao.data}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Mensagem Enviada</p>
                      <p className="text-white bg-[#1a2942] p-3 rounded">{interacao.mensagem}</p>
                    </div>
                    {interacao.resposta && (
                      <div>
                        <p className="text-gray-400 text-sm mb-1">Resposta do Cliente</p>
                        <p className="text-white bg-[#1a2942] p-3 rounded">{interacao.resposta}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-gray-400 text-sm mb-2">Tags</p>
                      <div className="flex gap-2 flex-wrap">
                        {interacao.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="border-[#004BFF] text-white">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
