import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableEmpty } from '../ui/table';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Phone, PhoneCall, PhoneMissed, Volume2 } from 'lucide-react';

export function DisparosVoz() {
  const chamadas: Array<{ id: number; destinatario: string; telefone: string; duracao: string; status: string; data: string }> = [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'atendida':
        return (
          <Badge variant="success">
            <PhoneCall className="w-3 h-3" />
            Atendida
          </Badge>
        );
      case 'nao_atendida':
        return (
          <Badge variant="warning">
            <PhoneMissed className="w-3 h-3" />
            Não Atendida
          </Badge>
        );
      case 'ocupado':
        return (
          <Badge variant="destructive">
            <PhoneMissed className="w-3 h-3" />
            Ocupado
          </Badge>
        );
      default:
        return null;
    }
  };

  const stats = {
    total: 0,
    atendidas: 0,
    naoAtendidas: 0,
    duracaoMedia: '—',
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Disparos Voz (CallBot)</h1>
          <p className="page-description">Histórico de chamadas automáticas</p>
        </div>
        <Button>
          <Phone className="w-4 h-4" />
          Nova Campanha
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="stats-card">
          <p className="stats-label">Total de Chamadas</p>
          <p className="stats-value">{stats.total}</p>
        </Card>
        <Card className="stats-card">
          <p className="stats-label">Atendidas</p>
          <p className="stats-value text-success">{stats.atendidas}</p>
        </Card>
        <Card className="stats-card">
          <p className="stats-label">Não Atendidas</p>
          <p className="stats-value text-warning">{stats.naoAtendidas}</p>
        </Card>
        <Card className="stats-card">
          <p className="stats-label">Duração Média</p>
          <p className="stats-value text-primary">{stats.duracaoMedia}</p>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Chamadas</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Destinatário</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Duração</TableHead>
                <TableHead>Data/Hora</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {chamadas.length === 0 ? (
                <TableEmpty
                  colSpan={6}
                  icon={Phone}
                  title="Nenhuma chamada registrada"
                  description="Inicie uma nova campanha de voz para ver o histórico aqui"
                />
              ) : (
                chamadas.map((chamada) => (
                  <TableRow key={chamada.id}>
                    <TableCell className="font-medium">{chamada.destinatario}</TableCell>
                    <TableCell className="font-mono text-sm">{chamada.telefone}</TableCell>
                    <TableCell>{chamada.duracao}</TableCell>
                    <TableCell className="text-text-secondary">{chamada.data}</TableCell>
                    <TableCell>{getStatusBadge(chamada.status)}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" disabled={chamada.status !== 'atendida'}>
                        <Volume2 className="w-4 h-4" />
                        Ouvir
                      </Button>
                    </TableCell>
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
