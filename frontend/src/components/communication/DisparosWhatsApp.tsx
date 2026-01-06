import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableEmpty } from '../ui/table';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Send, CheckCheck, Clock, XCircle, MessageSquare } from 'lucide-react';

export function DisparosWhatsApp() {
  const disparos: Array<{ id: number; destinatario: string; telefone: string; mensagem: string; status: string; data: string; hora: string }> = [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'lido':
        return (
          <Badge variant="success">
            <CheckCheck className="w-3 h-3" />
            Lido
          </Badge>
        );
      case 'enviado':
        return (
          <Badge variant="default">
            <Send className="w-3 h-3" />
            Enviado
          </Badge>
        );
      case 'pendente':
        return (
          <Badge variant="warning">
            <Clock className="w-3 h-3" />
            Pendente
          </Badge>
        );
      case 'falha':
        return (
          <Badge variant="destructive">
            <XCircle className="w-3 h-3" />
            Falha
          </Badge>
        );
      default:
        return null;
    }
  };

  const stats = {
    total: 0,
    enviados: 0,
    lidos: 0,
    falhas: 0,
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Disparos WhatsApp</h1>
          <p className="page-description">Acompanhe os envios e status das mensagens</p>
        </div>
        <Button>
          <Send className="w-4 h-4" />
          Novo Disparo
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="stats-card">
          <p className="stats-label">Total Enviado</p>
          <p className="stats-value">{stats.total}</p>
        </Card>
        <Card className="stats-card">
          <p className="stats-label">Entregues</p>
          <p className="stats-value text-primary">{stats.enviados}</p>
        </Card>
        <Card className="stats-card">
          <p className="stats-label">Lidos</p>
          <p className="stats-value text-success">{stats.lidos}</p>
        </Card>
        <Card className="stats-card">
          <p className="stats-label">Falhas</p>
          <p className="stats-value text-destructive">{stats.falhas}</p>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Disparos</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Destinatário</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Mensagem</TableHead>
                <TableHead>Data/Hora</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {disparos.length === 0 ? (
                <TableEmpty 
                  icon={MessageSquare}
                  title="Nenhum disparo encontrado"
                  description="Não há disparos de WhatsApp registrados no momento."
                  action={
                    <Button size="sm">
                      <Send className="w-4 h-4 mr-2" />
                      Criar primeiro disparo
                    </Button>
                  }
                />
              ) : (
                disparos.map((disparo) => (
                  <TableRow key={disparo.id}>
                    <TableCell className="font-medium">{disparo.destinatario}</TableCell>
                    <TableCell>{disparo.telefone}</TableCell>
                    <TableCell className="max-w-xs truncate">{disparo.mensagem}</TableCell>
                    <TableCell>{disparo.data}</TableCell>
                    <TableCell>{getStatusBadge(disparo.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">
                        Detalhes
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
