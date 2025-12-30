import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Send, CheckCheck, Clock, XCircle } from 'lucide-react';

export function DisparosWhatsApp() {
  const disparos: Array<{ id: number; destinatario: string; telefone: string; mensagem: string; status: string; data: string; hora: string }> = [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'lido':
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
            <CheckCheck className="w-3 h-3 mr-1" />
            Lido
          </Badge>
        );
      case 'enviado':
        return (
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
            <Send className="w-3 h-3 mr-1" />
            Enviado
          </Badge>
        );
      case 'pendente':
        return (
          <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
            <Clock className="w-3 h-3 mr-1" />
            Pendente
          </Badge>
        );
      case 'falha':
        return (
          <Badge variant="destructive">
            <XCircle className="w-3 h-3 mr-1" />
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900">Disparos WhatsApp</h1>
          <p className="text-gray-600">Acompanhe os envios e status das mensagens</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
          <Send className="w-4 h-4" />
          Novo Disparo
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-gray-600 text-sm">Total Enviado</p>
            <p className="text-gray-900 mt-1">{stats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-gray-600 text-sm">Entregues</p>
            <p className="text-blue-600 mt-1">{stats.enviados}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-gray-600 text-sm">Lidos</p>
            <p className="text-green-600 mt-1">{stats.lidos}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-gray-600 text-sm">Falhas</p>
            <p className="text-red-600 mt-1">{stats.falhas}</p>
          </CardContent>
        </Card>
      </div>

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
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {disparos.map((disparo) => (
                <TableRow key={disparo.id}>
                  <TableCell>{disparo.destinatario}</TableCell>
                  <TableCell>{disparo.telefone}</TableCell>
                  <TableCell className="max-w-xs truncate">{disparo.mensagem}</TableCell>
                  <TableCell>{disparo.data}</TableCell>
                  <TableCell>{getStatusBadge(disparo.status)}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      Detalhes
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
