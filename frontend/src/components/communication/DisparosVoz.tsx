import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Phone, PhoneCall, PhoneMissed, Volume2 } from 'lucide-react';

export function DisparosVoz() {
  const chamadas: Array<{ id: number; destinatario: string; telefone: string; duracao: string; status: string; data: string }> = [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'atendida':
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
            <PhoneCall className="w-3 h-3 mr-1" />
            Atendida
          </Badge>
        );
      case 'nao_atendida':
        return (
          <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
            <PhoneMissed className="w-3 h-3 mr-1" />
            Não Atendida
          </Badge>
        );
      case 'ocupado':
        return (
          <Badge variant="destructive">
            <PhoneMissed className="w-3 h-3 mr-1" />
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900">Disparos Voz (CallBot)</h1>
          <p className="text-gray-600">Histórico de chamadas automáticas</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
          <Phone className="w-4 h-4" />
          Nova Campanha
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-gray-600 text-sm">Total de Chamadas</p>
            <p className="text-gray-900 mt-1">{stats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-gray-600 text-sm">Atendidas</p>
            <p className="text-green-600 mt-1">{stats.atendidas}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-gray-600 text-sm">Não Atendidas</p>
            <p className="text-yellow-600 mt-1">{stats.naoAtendidas}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-gray-600 text-sm">Duração Média</p>
            <p className="text-blue-600 mt-1">{stats.duracaoMedia}</p>
          </CardContent>
        </Card>
      </div>

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
              {chamadas.map((chamada) => (
                <TableRow key={chamada.id}>
                  <TableCell>{chamada.destinatario}</TableCell>
                  <TableCell>{chamada.telefone}</TableCell>
                  <TableCell>{chamada.duracao}</TableCell>
                  <TableCell>{chamada.data}</TableCell>
                  <TableCell>{getStatusBadge(chamada.status)}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" className="gap-2" disabled={chamada.status !== 'atendida'}>
                      <Volume2 className="w-4 h-4" />
                      Ouvir
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
