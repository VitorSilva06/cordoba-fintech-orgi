import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Search, Filter } from 'lucide-react';

export function VisualizacaoBase() {
  const [searchTerm, setSearchTerm] = useState('');
  const [faixaAtraso, setFaixaAtraso] = useState('todas');

  const registros: Array<{ id: number; nome: string; cpf: string; telefone: string; valor: number; diasAtraso: number; faixa: string }> = [];

  const getFaixaBadge = (faixa: string) => {
    switch (faixa) {
      case '0-30':
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">0-30 dias</Badge>;
      case '31-60':
        return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">31-60 dias</Badge>;
      case '61-90':
        return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">61-90 dias</Badge>;
      case '91-120':
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">91-120 dias</Badge>;
      case '120+':
        return <Badge variant="destructive">120+ dias</Badge>;
      default:
        return null;
    }
  };

  const filteredRegistros = registros.filter((reg) => {
    const matchesSearch = reg.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reg.cpf.includes(searchTerm);
    const matchesFaixa = faixaAtraso === 'todas' || reg.faixa === faixaAtraso;
    return matchesSearch && matchesFaixa;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-gray-900">Visualização de Base</h1>
        <p className="text-gray-600">Consulte e filtre os registros da base de cobrança</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Buscar por nome ou CPF..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={faixaAtraso} onValueChange={setFaixaAtraso}>
              <SelectTrigger className="w-[200px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas as faixas</SelectItem>
                <SelectItem value="0-30">0-30 dias</SelectItem>
                <SelectItem value="31-60">31-60 dias</SelectItem>
                <SelectItem value="61-90">61-90 dias</SelectItem>
                <SelectItem value="91-120">91-120 dias</SelectItem>
                <SelectItem value="120+">120+ dias</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Registros ({filteredRegistros.length})</CardTitle>
            <Button variant="outline">Exportar</Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>CPF</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Dias de Atraso</TableHead>
                <TableHead>Faixa</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRegistros.map((registro) => (
                <TableRow key={registro.id}>
                  <TableCell>{registro.nome}</TableCell>
                  <TableCell>{registro.cpf}</TableCell>
                  <TableCell>{registro.telefone}</TableCell>
                  <TableCell className="text-blue-600">R$ {registro.valor.toLocaleString()}</TableCell>
                  <TableCell>{registro.diasAtraso} dias</TableCell>
                  <TableCell>{getFaixaBadge(registro.faixa)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
