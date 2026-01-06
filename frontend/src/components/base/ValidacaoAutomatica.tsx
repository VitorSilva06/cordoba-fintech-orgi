/**
 * ValidacaoAutomatica - Resultado da Validação de Dados
 * Mostra o resultado da validação após preview de upload
 */
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { CheckCircle, XCircle, AlertCircle, RefreshCcw, FileCheck, Users } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { TenantSelector } from '../dashboards/TenantSelector';
import api from '@/services/api';

interface RegistroValidacao {
  linha: number;
  cpf: string;
  cpf_status: 'valido' | 'invalido' | 'duplicado';
  nome: string;
  telefone: string;
  telefone_status: 'valido' | 'invalido' | 'duplicado';
  email: string;
  email_status: 'valido' | 'invalido' | 'duplicado';
  acao: string;
}

export function ValidacaoAutomatica() {
  const [selectedTenantId, setSelectedTenantId] = useState<number | undefined>();
  const [registros, setRegistros] = useState<RegistroValidacao[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    validos: 0,
    invalidos: 0,
    duplicados: 0,
  });

  // Esta página mostra o resultado de validações
  // Em uma implementação real, isso viria de um contexto ou props após preview

  const handleTenantChange = (tenantId?: number) => {
    setSelectedTenantId(tenantId);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'valido':
        return (
          <Badge className="bg-[var(--brand-success)] text-white">
            <CheckCircle className="w-3 h-3 mr-1" />
            Válido
          </Badge>
        );
      case 'invalido':
        return (
          <Badge className="bg-[var(--brand-error)] text-white">
            <XCircle className="w-3 h-3 mr-1" />
            Inválido
          </Badge>
        );
      case 'duplicado':
        return (
          <Badge className="bg-[var(--brand-warning)] text-white">
            <AlertCircle className="w-3 h-3 mr-1" />
            Duplicado
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="p-6 space-y-6 bg-[var(--bg-primary)] min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-[var(--text-primary)] text-3xl">Validação Automática</h1>
          <p className="text-[var(--text-secondary)] mt-1">
            Resultado da validação de CPF, telefone e e-mail
          </p>
        </div>
        <div className="flex items-center gap-3">
          <TenantSelector selectedTenantId={selectedTenantId} onTenantChange={handleTenantChange} />
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-[var(--bg-card)] border-[var(--border-primary)]">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-[var(--brand-primary)]/10">
              <Users className="w-6 h-6 text-[var(--brand-primary)]" />
            </div>
            <div>
              <p className="text-[var(--text-secondary)] text-sm">Total de Registros</p>
              <p className="text-[var(--text-primary)] text-2xl font-bold">{stats.total}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[var(--bg-card)] border-[var(--border-primary)]">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-[var(--brand-success)]/10">
              <CheckCircle className="w-6 h-6 text-[var(--brand-success)]" />
            </div>
            <div>
              <p className="text-[var(--text-secondary)] text-sm">Registros Válidos</p>
              <p className="text-[var(--brand-success)] text-2xl font-bold">{stats.validos}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[var(--bg-card)] border-[var(--border-primary)]">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-[var(--brand-error)]/10">
              <XCircle className="w-6 h-6 text-[var(--brand-error)]" />
            </div>
            <div>
              <p className="text-[var(--text-secondary)] text-sm">Registros Inválidos</p>
              <p className="text-[var(--brand-error)] text-2xl font-bold">{stats.invalidos}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[var(--bg-card)] border-[var(--border-primary)]">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-[var(--brand-warning)]/10">
              <AlertCircle className="w-6 h-6 text-[var(--brand-warning)]" />
            </div>
            <div>
              <p className="text-[var(--text-secondary)] text-sm">Duplicados</p>
              <p className="text-[var(--brand-warning)] text-2xl font-bold">{stats.duplicados}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Validação */}
      <Card className="bg-[var(--bg-card)] border-[var(--border-primary)]">
        <CardHeader>
          <CardTitle className="text-[var(--text-primary)] flex items-center gap-2">
            <FileCheck className="w-5 h-5" />
            Resultado da Validação
          </CardTitle>
          <CardDescription className="text-[var(--text-secondary)]">
            Análise detalhada de cada campo dos registros
          </CardDescription>
        </CardHeader>
        <CardContent>
          {registros.length === 0 ? (
            <div className="text-center py-12">
              <FileCheck className="w-12 h-12 mx-auto mb-4 text-[var(--text-muted)]" />
              <p className="text-[var(--text-secondary)]">
                Nenhuma validação disponível
              </p>
              <p className="text-[var(--text-muted)] text-sm mt-2">
                Faça um upload de arquivo na página de Upload de Base para ver o resultado da validação aqui
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Linha</TableHead>
                    <TableHead>CPF</TableHead>
                    <TableHead>Status CPF</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead>Status Telefone</TableHead>
                    <TableHead>E-mail</TableHead>
                    <TableHead>Status E-mail</TableHead>
                    <TableHead>Ação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {registros.map((registro) => (
                    <TableRow key={registro.linha}>
                      <TableCell className="text-[var(--text-secondary)]">
                        {registro.linha}
                      </TableCell>
                      <TableCell className="font-mono text-[var(--text-primary)]">
                        {registro.cpf}
                      </TableCell>
                      <TableCell>{getStatusBadge(registro.cpf_status)}</TableCell>
                      <TableCell className="text-[var(--text-primary)]">
                        {registro.nome}
                      </TableCell>
                      <TableCell className="text-[var(--text-secondary)]">
                        {registro.telefone || '-'}
                      </TableCell>
                      <TableCell>{getStatusBadge(registro.telefone_status)}</TableCell>
                      <TableCell className="text-[var(--text-secondary)]">
                        {registro.email || '-'}
                      </TableCell>
                      <TableCell>{getStatusBadge(registro.email_status)}</TableCell>
                      <TableCell className="text-[var(--text-secondary)]">
                        {registro.acao}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
