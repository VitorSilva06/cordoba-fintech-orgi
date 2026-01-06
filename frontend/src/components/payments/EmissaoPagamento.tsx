import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { CreditCard, Barcode, QrCode, Link2, DollarSign, Calendar, Plus, Search, CheckCircle2 } from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { chartColors, chartConfig } from '../../config/chartColors';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableEmpty } from '../ui/table';

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
      pago: { label: 'Pago', variant: 'success' as const },
      pendente: { label: 'Pendente', variant: 'warning' as const },
      processando: { label: 'Processando', variant: 'secondary' as const },
      cancelado: { label: 'Cancelado', variant: 'destructive' as const },
    };
    const config = statusMap[status as keyof typeof statusMap];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const handleEmitirPagamento = () => {
    // Intencionalmente vazio: integração/backend removidos.
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Emissão de Pagamento</h1>
          <p className="page-description">Gere cobranças via PIX, boleto, cartão ou link de pagamento</p>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {estatisticas.map((stat, index) => (
          <Card key={index} className="stats-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="stats-label">{stat.nome}</p>
                <p className="stats-value mt-2">{stat.valor}</p>
                <p className="text-success text-sm mt-1">{stat.variacao}</p>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: `${stat.cor}20` }}>
                <stat.icon className="w-6 h-6" style={{ color: stat.cor }} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulário de Emissão */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Nova Cobrança</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Métodos de Pagamento */}
              <div>
                <label className="form-label">Método de Pagamento</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                  {metodosPagamento.map((metodo) => (
                    <div
                      key={metodo.id}
                      onClick={() => setMetodoPagamento(metodo.id)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        metodoPagamento === metodo.id
                          ? 'border-primary bg-primary/10'
                          : 'border-border bg-card hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${metodo.cor}20` }}>
                          <metodo.icon className="w-5 h-5" style={{ color: metodo.cor }} />
                        </div>
                        <div>
                          <p className="text-foreground font-medium">{metodo.nome}</p>
                          <p className="text-text-muted text-xs">{metodo.descricao}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dados do Pagamento */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Valor</label>
                  <div className="relative mt-2">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted">R$</span>
                    <Input
                      type="text"
                      placeholder="0,00"
                      value={valor}
                      onChange={(e) => setValor(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <label className="form-label">Vencimento</label>
                  <Input
                    type="date"
                    value={vencimento}
                    onChange={(e) => setVencimento(e.target.value)}
                    className="mt-2"
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Cliente</label>
                <div className="relative mt-2">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <Input
                    placeholder="Buscar cliente por nome ou CPF..."
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Descrição</label>
                <Textarea
                  placeholder="Descrição da cobrança..."
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  className="mt-2 min-h-[100px]"
                />
              </div>

              {/* Opções Adicionais */}
              {metodoPagamento === 'boleto' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Multa (%)</label>
                    <Input type="text" placeholder="2" className="mt-2" />
                  </div>
                  <div>
                    <label className="form-label">Juros ao mês (%)</label>
                    <Input type="text" placeholder="1" className="mt-2" />
                  </div>
                </div>
              )}

              {metodoPagamento === 'cartao' && (
                <div>
                  <label className="form-label">Parcelas</label>
                  <Select defaultValue="1">
                    <SelectTrigger className="mt-2">
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

              <Button onClick={handleEmitirPagamento} variant="success" className="w-full">
                <Plus className="w-4 h-4" />
                Emitir Cobrança
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Resumo e Visualização */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Resumo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-secondary rounded-lg">
                <p className="text-text-muted text-sm mb-1">Método Selecionado</p>
                <p className="text-foreground font-medium">
                  {metodosPagamento.find(m => m.id === metodoPagamento)?.nome}
                </p>
              </div>
              <div className="p-4 bg-secondary rounded-lg">
                <p className="text-text-muted text-sm mb-1">Valor</p>
                <p className="text-foreground text-2xl font-bold">R$ {valor || '0,00'}</p>
              </div>
              <div className="p-4 bg-secondary rounded-lg">
                <p className="text-text-muted text-sm mb-1">Vencimento</p>
                <p className="text-foreground font-medium">{vencimento || 'Não definido'}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Integrações Ativas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-text-secondary text-sm">Mercado Pago</span>
                <Badge variant="success">Ativo</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-secondary text-sm">PicPay</span>
                <Badge variant="success">Ativo</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Gráficos de Análise */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Emissões por Método</CardTitle>
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
                  contentStyle={{ backgroundColor: chartConfig.tooltipBg, border: `1px solid ${chartConfig.tooltipBorder}`, borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Taxa de Conversão</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={conversaoPorMetodo}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartConfig.gridColor} />
                <XAxis dataKey="metodo" stroke={chartConfig.textColor} />
                <YAxis stroke={chartConfig.textColor} />
                <Tooltip 
                  contentStyle={{ backgroundColor: chartConfig.tooltipBg, border: `1px solid ${chartConfig.tooltipBorder}`, borderRadius: '8px' }}
                  labelStyle={{ color: chartConfig.textColor }}
                />
                <Bar dataKey="taxa" fill={chartColors.success} name="Taxa de Conversão %" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Últimas Emissões */}
      <Card>
        <CardHeader>
          <CardTitle>Últimas Emissões</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Método</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ultimasEmissoes.length === 0 ? (
                <TableEmpty
                  colSpan={6}
                  icon={DollarSign}
                  title="Nenhuma emissão encontrada"
                  description="Emita sua primeira cobrança para ver o histórico aqui"
                />
              ) : (
                ultimasEmissoes.map((emissao) => (
                  <TableRow key={emissao.id}>
                    <TableCell className="font-mono text-sm">{emissao.id}</TableCell>
                    <TableCell className="font-medium">{emissao.cliente}</TableCell>
                    <TableCell>R$ {emissao.valor.toFixed(2)}</TableCell>
                    <TableCell>{emissao.metodo}</TableCell>
                    <TableCell>{getStatusBadge(emissao.status)}</TableCell>
                    <TableCell className="text-text-secondary">{emissao.data}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
