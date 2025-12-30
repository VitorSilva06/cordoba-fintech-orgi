import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

export function ValidacaoAutomatica() {
  const registros: Array<{ id: number; cpf: string; cpfStatus: string; telefone: string; telefoneStatus: string; email: string; emailStatus: string }> = [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'valido':
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
            <CheckCircle className="w-3 h-3 mr-1" />
            Válido
          </Badge>
        );
      case 'invalido':
        return (
          <Badge variant="destructive">
            <XCircle className="w-3 h-3 mr-1" />
            Inválido
          </Badge>
        );
      case 'duplicado':
        return (
          <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
            <AlertCircle className="w-3 h-3 mr-1" />
            Duplicado
          </Badge>
        );
      default:
        return null;
    }
  };

  const stats = {
    total: 0,
    validos: 0,
    invalidos: 0,
    duplicados: 0,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-gray-900">Validação Automática</h1>
        <p className="text-gray-600">Resultado da validação de CPF, telefone e e-mail</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-gray-600 text-sm">Total de Registros</p>
            <p className="text-gray-900 mt-1">{stats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-gray-600 text-sm">Registros Válidos</p>
            <p className="text-green-600 mt-1">{stats.validos}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-gray-600 text-sm">Registros Inválidos</p>
            <p className="text-red-600 mt-1">{stats.invalidos}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-gray-600 text-sm">Duplicados</p>
            <p className="text-yellow-600 mt-1">{stats.duplicados}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Resultado da Validação</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>CPF</TableHead>
                <TableHead>Status CPF</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Status Telefone</TableHead>
                <TableHead>E-mail</TableHead>
                <TableHead>Status E-mail</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {registros.map((registro) => (
                <TableRow key={registro.id}>
                  <TableCell>{registro.cpf}</TableCell>
                  <TableCell>{getStatusBadge(registro.cpfStatus)}</TableCell>
                  <TableCell>{registro.telefone}</TableCell>
                  <TableCell>{getStatusBadge(registro.telefoneStatus)}</TableCell>
                  <TableCell>{registro.email}</TableCell>
                  <TableCell>{getStatusBadge(registro.emailStatus)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
