/**
 * VisualizacaoBase - Visualização de Clientes/Devedores
 * Lista todos os clientes com filtros e busca
 */
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { 
  Search, 
  Filter, 
  RefreshCcw, 
  Download,
  Users,
  DollarSign,
  Calendar,
  AlertTriangle
} from 'lucide-react';
import { TenantSelector } from '../dashboards/TenantSelector';
import api from '@/services/api';

interface ClienteBase {
  id: number;
  nome: string;
  cpf_masked: string;
  telefone: string | null;
  email: string | null;
  total_contratos: number;
  valor_total: number;
  status: string;
  data_cadastro: string;
}

export function VisualizacaoBase() {
  const [selectedTenantId, setSelectedTenantId] = useState<number | undefined>();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [clientes, setClientes] = useState<ClienteBase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalClientes, setTotalClientes] = useState(0);
  const [stats, setStats] = useState<{
    total_clientes: number;
    total_contratos: number;
    valor_total: number;
  } | null>(null);
  const pageSize = 20;

  const loadClientes = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams();
      params.append('pagina', page.toString());
      params.append('por_pagina', pageSize.toString());
      if (selectedTenantId) {
        params.append('tenant_id', selectedTenantId.toString());
      }
      if (searchTerm) {
        params.append('busca', searchTerm);
      }
      if (statusFilter !== 'todos') {
        params.append('status_filter', statusFilter);
      }
      
      const response = await api.get(`/base/clientes?${params.toString()}`);
      setClientes(response.data.clientes);
      setTotalClientes(response.data.total);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Erro ao carregar clientes');
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedTenantId) {
        params.append('tenant_id', selectedTenantId.toString());
      }
      
      const response = await api.get(`/base/estatisticas?${params.toString()}`);
      setStats(response.data);
    } catch (err) {
      console.error('Erro ao carregar estatísticas:', err);
    }
  };

  useEffect(() => {
    loadClientes();
    loadStats();
  }, [selectedTenantId, page, statusFilter]);

  // Debounce para busca
  useEffect(() => {
    const timer = setTimeout(() => {
      if (page === 1) {
        loadClientes();
      } else {
        setPage(1);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleTenantChange = (tenantId?: number) => {
    setSelectedTenantId(tenantId);
    setPage(1);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ativo':
        return <Badge className="bg-[var(--brand-success)] text-white">Ativo</Badge>;
      case 'inativo':
        return <Badge className="bg-[var(--text-muted)] text-white">Inativo</Badge>;
      case 'pendente':
        return <Badge className="bg-[var(--brand-warning)] text-white">Pendente</Badge>;
      case 'negativado':
        return <Badge className="bg-[var(--brand-error)] text-white">Negativado</Badge>;
      case 'atrasado':
        return <Badge className="bg-[var(--brand-error)] text-white">Atrasado</Badge>;
      case 'sem_contrato':
        return <Badge variant="outline">Sem Contrato</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('pt-BR');
  };

  const totalPages = Math.ceil(totalClientes / pageSize);

  const handleExport = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedTenantId) {
        params.append('tenant_id', selectedTenantId.toString());
      }
      
      const response = await api.get(`/base/clientes/export?${params.toString()}`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `clientes_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Erro ao exportar:', err);
    }
  };

  return (
    <div className="p-6 space-y-6 bg-[var(--bg-primary)] min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-[var(--text-primary)] text-3xl">Visualização de Base</h1>
          <p className="text-[var(--text-secondary)] mt-1">
            Consulte e filtre os registros da base de cobrança
          </p>
        </div>
        <div className="flex items-center gap-3">
          <TenantSelector selectedTenantId={selectedTenantId} onTenantChange={handleTenantChange} />
          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Estatísticas */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Card className="bg-[var(--bg-card)] border-[var(--border-primary)]">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-[var(--brand-primary)]/10">
                <Users className="w-6 h-6 text-[var(--brand-primary)]" />
              </div>
              <div>
                <p className="text-[var(--text-secondary)] text-sm">Total Clientes</p>
                <p className="text-[var(--text-primary)] text-2xl font-bold">
                  {stats.total_clientes.toLocaleString('pt-BR')}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-[var(--bg-card)] border-[var(--border-primary)]">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-[var(--brand-info)]/10">
                <Calendar className="w-6 h-6 text-[var(--brand-info)]" />
              </div>
              <div>
                <p className="text-[var(--text-secondary)] text-sm">Total Contratos</p>
                <p className="text-[var(--text-primary)] text-2xl font-bold">
                  {stats.total_contratos.toLocaleString('pt-BR')}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-[var(--bg-card)] border-[var(--border-primary)]">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-[var(--brand-success)]/10">
                <DollarSign className="w-6 h-6 text-[var(--brand-success)]" />
              </div>
              <div>
                <p className="text-[var(--text-secondary)] text-sm">Valor Total</p>
                <p className="text-[var(--text-primary)] text-2xl font-bold">
                  {formatCurrency(stats.valor_total)}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filtros */}
      <Card className="bg-[var(--bg-card)] border-[var(--border-primary)]">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
              <Input
                placeholder="Buscar por nome ou CPF..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-[var(--bg-secondary)] border-[var(--border-primary)]"
              />
            </div>
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
              <SelectTrigger className="w-[200px] bg-[var(--bg-secondary)] border-[var(--border-primary)]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os status</SelectItem>
                <SelectItem value="ativo">Ativo</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="negativado">Negativado</SelectItem>
                <SelectItem value="inativo">Inativo</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={loadClientes} disabled={isLoading}>
              <RefreshCcw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Clientes */}
      <Card className="bg-[var(--bg-card)] border-[var(--border-primary)]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-[var(--text-primary)]">Clientes</CardTitle>
              <CardDescription className="text-[var(--text-secondary)]">
                Mostrando {clientes.length} de {totalClientes} registros
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="p-4 mb-4 bg-[var(--brand-error)]/10 text-[var(--brand-error)] rounded-lg flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              {error}
            </div>
          )}
          
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCcw className="w-8 h-8 animate-spin text-[var(--brand-primary)]" />
            </div>
          ) : clientes.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 mx-auto mb-4 text-[var(--text-muted)]" />
              <p className="text-[var(--text-secondary)]">Nenhum cliente encontrado</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>CPF</TableHead>
                      <TableHead>Telefone</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Contratos</TableHead>
                      <TableHead>Valor Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Cadastro</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clientes.map((cliente) => (
                      <TableRow key={cliente.id}>
                        <TableCell className="text-[var(--text-primary)] font-medium">
                          {cliente.nome}
                        </TableCell>
                        <TableCell className="text-[var(--text-secondary)] font-mono">
                          {cliente.cpf_masked}
                        </TableCell>
                        <TableCell className="text-[var(--text-secondary)]">
                          {cliente.telefone || '-'}
                        </TableCell>
                        <TableCell className="text-[var(--text-secondary)]">
                          {cliente.email || '-'}
                        </TableCell>
                        <TableCell className="text-[var(--text-primary)]">
                          {cliente.total_contratos}
                        </TableCell>
                        <TableCell className="text-[var(--brand-primary)] font-medium">
                          {formatCurrency(cliente.valor_total)}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(cliente.status)}
                        </TableCell>
                        <TableCell className="text-[var(--text-secondary)] text-sm">
                          {formatDate(cliente.data_cadastro)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Paginação */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-[var(--border-primary)]">
                  <p className="text-[var(--text-secondary)] text-sm">
                    Página {page} de {totalPages}
                  </p>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      disabled={page === 1}
                      onClick={() => setPage(p => p - 1)}
                    >
                      Anterior
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      disabled={page === totalPages}
                      onClick={() => setPage(p => p + 1)}
                    >
                      Próxima
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
