/**
 * LogsImportacao - Histórico de Importações
 * Lista todos os logs de importação de base com filtros
 */
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  FileText, 
  RefreshCcw,
  AlertCircle,
  Users,
  FileSpreadsheet
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { TenantSelector } from '../dashboards/TenantSelector';
import api from '@/services/api';

interface LogImportacao {
  id: string;
  arquivo: string;
  tipo: string;
  status: string;
  total_linhas: number;
  processados: number;
  erros: number;
  data: string;
  usuario: string;
  tenant_nome: string | null;
}

export function LogsImportacao() {
  const [selectedTenantId, setSelectedTenantId] = useState<number | undefined>();
  const [logs, setLogs] = useState<LogImportacao[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalLogs, setTotalLogs] = useState(0);
  const pageSize = 20;

  const loadLogs = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams();
      params.append('pagina', page.toString());
      params.append('por_pagina', pageSize.toString());
      if (selectedTenantId) {
        params.append('tenant_id', selectedTenantId.toString());
      }
      
      const response = await api.get(`/base/logs?${params.toString()}`);
      setLogs(response.data.logs);
      setTotalLogs(response.data.total);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Erro ao carregar logs');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, [selectedTenantId, page]);

  const handleTenantChange = (tenantId?: number) => {
    setSelectedTenantId(tenantId);
    setPage(1);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'concluido':
        return (
          <Badge className="bg-[var(--brand-success)] text-white">
            <CheckCircle className="w-3 h-3 mr-1" />
            Concluído
          </Badge>
        );
      case 'erro':
        return (
          <Badge className="bg-[var(--brand-error)] text-white">
            <XCircle className="w-3 h-3 mr-1" />
            Erro
          </Badge>
        );
      case 'processando':
        return (
          <Badge className="bg-[var(--brand-info)] text-white">
            <Clock className="w-3 h-3 mr-1" />
            Processando
          </Badge>
        );
      case 'pendente':
        return (
          <Badge className="bg-[var(--brand-warning)] text-white">
            <Clock className="w-3 h-3 mr-1" />
            Pendente
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getTipoBadge = (tipo: string) => {
    switch (tipo) {
      case 'nova_base':
        return <Badge variant="outline" className="text-[var(--brand-primary)]">Nova Base</Badge>;
      case 'atualizacao':
        return <Badge variant="outline" className="text-[var(--brand-warning)]">Atualização</Badge>;
      case 'incremental':
        return <Badge variant="outline" className="text-[var(--brand-info)]">Incremental</Badge>;
      default:
        return <Badge variant="outline">{tipo}</Badge>;
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const totalPages = Math.ceil(totalLogs / pageSize);

  return (
    <div className="p-6 space-y-6 bg-[var(--bg-primary)] min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-[var(--text-primary)] text-3xl">Logs de Importação</h1>
          <p className="text-[var(--text-secondary)] mt-1">
            Histórico de uploads e status de processamento
          </p>
        </div>
        <div className="flex items-center gap-3">
          <TenantSelector selectedTenantId={selectedTenantId} onTenantChange={handleTenantChange} />
          <Button variant="outline" onClick={loadLogs} disabled={isLoading}>
            <RefreshCcw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Estatísticas Rápidas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-[var(--bg-card)] border-[var(--border-primary)]">
          <CardContent className="p-4 text-center">
            <FileSpreadsheet className="w-8 h-8 mx-auto mb-2 text-[var(--brand-primary)]" />
            <p className="text-[var(--text-secondary)] text-sm">Total Importações</p>
            <p className="text-[var(--text-primary)] text-2xl font-bold">{totalLogs}</p>
          </CardContent>
        </Card>
        <Card className="bg-[var(--bg-card)] border-[var(--border-primary)]">
          <CardContent className="p-4 text-center">
            <CheckCircle className="w-8 h-8 mx-auto mb-2 text-[var(--brand-success)]" />
            <p className="text-[var(--text-secondary)] text-sm">Concluídas</p>
            <p className="text-[var(--brand-success)] text-2xl font-bold">
              {logs.filter(l => l.status === 'concluido').length}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-[var(--bg-card)] border-[var(--border-primary)]">
          <CardContent className="p-4 text-center">
            <Users className="w-8 h-8 mx-auto mb-2 text-[var(--brand-info)]" />
            <p className="text-[var(--text-secondary)] text-sm">Total Processados</p>
            <p className="text-[var(--brand-info)] text-2xl font-bold">
              {logs.reduce((acc, l) => acc + l.processados, 0)}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-[var(--bg-card)] border-[var(--border-primary)]">
          <CardContent className="p-4 text-center">
            <AlertCircle className="w-8 h-8 mx-auto mb-2 text-[var(--brand-error)]" />
            <p className="text-[var(--text-secondary)] text-sm">Com Erros</p>
            <p className="text-[var(--brand-error)] text-2xl font-bold">
              {logs.filter(l => l.erros > 0).length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Logs */}
      <Card className="bg-[var(--bg-card)] border-[var(--border-primary)]">
        <CardHeader>
          <CardTitle className="text-[var(--text-primary)]">Histórico de Importações</CardTitle>
          <CardDescription className="text-[var(--text-secondary)]">
            Mostrando {logs.length} de {totalLogs} registros
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="p-4 mb-4 bg-[var(--brand-error)]/10 text-[var(--brand-error)] rounded-lg">
              {error}
            </div>
          )}
          
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCcw className="w-8 h-8 animate-spin text-[var(--brand-primary)]" />
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 mx-auto mb-4 text-[var(--text-muted)]" />
              <p className="text-[var(--text-secondary)]">Nenhuma importação encontrada</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Arquivo</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Linhas</TableHead>
                      <TableHead>Processados</TableHead>
                      <TableHead>Erros</TableHead>
                      <TableHead>Usuário</TableHead>
                      <TableHead>Data</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="text-[var(--text-primary)] font-medium">
                          {log.arquivo}
                        </TableCell>
                        <TableCell>{getTipoBadge(log.tipo)}</TableCell>
                        <TableCell>{getStatusBadge(log.status)}</TableCell>
                        <TableCell className="text-[var(--text-secondary)]">
                          {log.total_linhas}
                        </TableCell>
                        <TableCell className="text-[var(--brand-success)]">
                          {log.processados}
                        </TableCell>
                        <TableCell className={log.erros > 0 ? 'text-[var(--brand-error)]' : 'text-[var(--text-muted)]'}>
                          {log.erros}
                        </TableCell>
                        <TableCell className="text-[var(--text-secondary)]">
                          {log.usuario}
                        </TableCell>
                        <TableCell className="text-[var(--text-secondary)] text-sm">
                          {formatDate(log.data)}
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
