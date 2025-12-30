import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { CreditCard, Barcode, QrCode, Link2, DollarSign, Calendar, Plus, Search, CheckCircle2 } from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { chartColors } from '../../config/chartColors';

export function EmissaoPagamento() {
  const [metodoPagamento, setMetodoPagamento] = useState('pix');
  const [valor, setValor] = useState('');
  const [vencimento, setVencimento] = useState('');
  const [descricao, setDescricao] = useState('');

  // Estatísticas de emissão
  const estatisticas = [
    { nome: 'Emitidos Hoje', valor: '—', variacao: '—', icon: QrCode, cor: chartColors.primary },
    { nome: 'Valor Total', valor: '—', variacao: '—', icon: DollarSign, cor: chartColors.success },
    { nome: 'Taxa de Conversão', valor: '—', variacao: '—', icon: CheckCircle2, cor: chartColors.info },
    { nome: 'Pendentes', valor: '—', variacao: '—', icon: Calendar, cor: chartColors.warning },
  ];

  // Métodos de pagamento disponíveis
  const metodosPagamento = [
    { id: 'pix', nome: 'PIX', icon: QrCode, descricao: 'Pagamento instantâneo', cor: chartColors.success },
    { id: 'boleto', nome: 'Boleto', icon: Barcode, descricao: 'Vencimento em até 30 dias', cor: chartColors.warning },
    { id: 'cartao', nome: 'Cartão', icon: CreditCard, descricao: 'Crédito ou débito', cor: chartColors.primary },
    { id: 'link', nome: 'Link de Pagamento', icon: Link2, descricao: 'Compartilhável por WhatsApp', cor: chartColors.info },
  ];

  // Dados de emissões por método
  const emissoesPorMetodo: Array<{ metodo: string; quantidade: number; valor: number; cor: string }> = [];

  // Conversão por método
  const conversaoPorMetodo: Array<{ metodo: string; taxa: number }> = [];

  // Últimas emissões
  const ultimasEmissoes: Array<{ id: string; cliente: string; valor: number; metodo: string; status: string; data: string }> = [];

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pago: { label: 'Pago', color: chartColors.success },
      pendente: { label: 'Pendente', color: chartColors.warning },
      processando: { label: 'Processando', color: chartColors.info },
      cancelado: { label: 'Cancelado', color: chartColors.danger },
    };
    const config = statusMap[status as keyof typeof statusMap];
    return <Badge style={{ backgroundColor: config.color }}>{config.label}</Badge>;
  };

  const handleEmitirPagamento = () => {
    // Intencionalmente vazio: integração/backend removidos.
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-white text-2xl">Emissão de Pagamento</h1>
        <p className="text-gray-300 mt-1">Gere cobranças via PIX, boleto, cartão ou link de pagamento</p>
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
                  <p className="text-green-400 text-sm mt-1">{stat.variacao}</p>
                </div>
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: `${stat.cor}20` }}>
                  <stat.icon className="w-6 h-6" style={{ color: stat.cor }} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulário de Emissão */}
        <div className="lg:col-span-2">
          <Card className="bg-[#1a2942] border-[#004BFF]">
            <CardHeader>
              <CardTitle className="text-white">Nova Cobrança</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Métodos de Pagamento */}
              <div>
                <label className="text-gray-300 text-sm mb-3 block">Método de Pagamento</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {metodosPagamento.map((metodo) => (
                    <div
                      key={metodo.id}
                      onClick={() => setMetodoPagamento(metodo.id)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        metodoPagamento === metodo.id
                          ? 'border-[#004BFF] bg-[#004BFF20]'
                          : 'border-[#2a3f5f] bg-[#0C1B33] hover:border-[#004BFF50]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${metodo.cor}20` }}>
                          <metodo.icon className="w-5 h-5" style={{ color: metodo.cor }} />
                        </div>
                        <div>
                          <p className="text-white">{metodo.nome}</p>
                          <p className="text-gray-400 text-xs">{metodo.descricao}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dados do Pagamento */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-300 text-sm mb-2 block">Valor</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">R$</span>
                    <Input
                      type="text"
                      placeholder="0,00"
                      value={valor}
                      onChange={(e) => setValor(e.target.value)}
                      className="pl-10 bg-[#0C1B33] border-[#004BFF] text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-gray-300 text-sm mb-2 block">Vencimento</label>
                  <Input
                    type="date"
                    value={vencimento}
                    onChange={(e) => setVencimento(e.target.value)}
                    className="bg-[#0C1B33] border-[#004BFF] text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-300 text-sm mb-2 block">Cliente</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Buscar cliente por nome ou CPF..."
                    className="pl-10 bg-[#0C1B33] border-[#004BFF] text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-300 text-sm mb-2 block">Descrição</label>
                <Textarea
                  placeholder="Descrição da cobrança..."
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  className="bg-[#0C1B33] border-[#004BFF] text-white min-h-[100px]"
                />
              </div>

              {/* Opções Adicionais */}
              {metodoPagamento === 'boleto' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-300 text-sm mb-2 block">Multa (%)</label>
                    <Input
                      type="text"
                      placeholder="2"
                      className="bg-[#0C1B33] border-[#004BFF] text-white"
                    />
                  </div>
                  <div>
                    <label className="text-gray-300 text-sm mb-2 block">Juros ao mês (%)</label>
                    <Input
                      type="text"
                      placeholder="1"
                      className="bg-[#0C1B33] border-[#004BFF] text-white"
                    />
                  </div>
                </div>
              )}

              {metodoPagamento === 'cartao' && (
                <div>
                  <label className="text-gray-300 text-sm mb-2 block">Parcelas</label>
                  <Select defaultValue="1">
                    <SelectTrigger className="bg-[#0C1B33] border-[#004BFF] text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 6, 12].map((parcela) => (
                        <SelectItem key={parcela} value={parcela.toString()}>
                          {parcela}x sem juros
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <Button 
                onClick={handleEmitirPagamento}
                className="w-full bg-[#00C08A] hover:bg-[#00A876]"
              >
                <Plus className="w-4 h-4 mr-2" />
                Emitir Cobrança
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Resumo e Visualização */}
        <div className="space-y-6">
          <Card className="bg-[#1a2942] border-[#004BFF]">
            <CardHeader>
              <CardTitle className="text-white">Resumo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-[#0C1B33] rounded-lg border border-[#004BFF]">
                <p className="text-gray-400 text-sm mb-1">Método Selecionado</p>
                <p className="text-white">
                  {metodosPagamento.find(m => m.id === metodoPagamento)?.nome}
                </p>
              </div>
              <div className="p-4 bg-[#0C1B33] rounded-lg border border-[#004BFF]">
                <p className="text-gray-400 text-sm mb-1">Valor</p>
                <p className="text-white text-2xl">R$ {valor || '0,00'}</p>
              </div>
              <div className="p-4 bg-[#0C1B33] rounded-lg border border-[#004BFF]">
                <p className="text-gray-400 text-sm mb-1">Vencimento</p>
                <p className="text-white">{vencimento || 'Não definido'}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1a2942] border-[#004BFF]">
            <CardHeader>
              <CardTitle className="text-white text-sm">Integrações Ativas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">Mercado Pago</span>
                <Badge style={{ backgroundColor: chartColors.success }}>Ativo</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">PicPay</span>
                <Badge style={{ backgroundColor: chartColors.success }}>Ativo</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Gráficos de Análise */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-[#1a2942] border-[#004BFF]">
          <CardHeader>
            <CardTitle className="text-white">Emissões por Método</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={emissoesPorMetodo}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ metodo, quantidade }) => `${metodo}: ${quantidade}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="quantidade"
                >
                  {emissoesPorMetodo.map((entry, index) => (
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

        <Card className="bg-[#1a2942] border-[#004BFF]">
          <CardHeader>
            <CardTitle className="text-white">Taxa de Conversão</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={conversaoPorMetodo}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a3f5f" />
                <XAxis dataKey="metodo" stroke="#F2F4F7" />
                <YAxis stroke="#F2F4F7" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0C1B33', border: `1px solid ${chartColors.primary}`, borderRadius: '8px' }}
                  labelStyle={{ color: '#F2F4F7' }}
                />
                <Bar dataKey="taxa" fill={chartColors.success} name="Taxa de Conversão %" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Últimas Emissões */}
      <Card className="bg-[#1a2942] border-[#004BFF]">
        <CardHeader>
          <CardTitle className="text-white">Últimas Emissões</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#004BFF]">
                  <th className="text-left text-gray-300 pb-3">ID</th>
                  <th className="text-left text-gray-300 pb-3">Cliente</th>
                  <th className="text-left text-gray-300 pb-3">Valor</th>
                  <th className="text-left text-gray-300 pb-3">Método</th>
                  <th className="text-left text-gray-300 pb-3">Status</th>
                  <th className="text-left text-gray-300 pb-3">Data</th>
                </tr>
              </thead>
              <tbody>
                {ultimasEmissoes.map((emissao) => (
                  <tr key={emissao.id} className="border-b border-[#2a3f5f]">
                    <td className="py-3 text-white">{emissao.id}</td>
                    <td className="py-3 text-white">{emissao.cliente}</td>
                    <td className="py-3 text-white">R$ {emissao.valor.toFixed(2)}</td>
                    <td className="py-3 text-white">{emissao.metodo}</td>
                    <td className="py-3">{getStatusBadge(emissao.status)}</td>
                    <td className="py-3 text-gray-300">{emissao.data}</td>
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
