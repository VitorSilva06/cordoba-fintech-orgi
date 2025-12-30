import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Edit, Trash2, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

export function ConfiguracaoSegmentos() {
  const [segmentos] = useState([
    { id: 1, nome: 'Atraso Leve', faixaInicio: 0, faixaFim: 30, quantidade: 1234, ativo: true },
    { id: 2, nome: 'Atraso Moderado', faixaInicio: 31, faixaFim: 60, quantidade: 987, ativo: true },
    { id: 3, nome: 'Atraso Grave', faixaInicio: 61, faixaFim: 90, quantidade: 856, ativo: true },
    { id: 4, nome: 'Atraso Crítico', faixaInicio: 91, faixaFim: 120, quantidade: 745, ativo: true },
    { id: 5, nome: 'Inadimplência Prolongada', faixaInicio: 121, faixaFim: 999, quantidade: 623, ativo: false },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900">Configuração de Segmentos</h1>
          <p className="text-gray-600">Defina as faixas de atraso e segmentos de cobrança</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
              <Plus className="w-4 h-4" />
              Novo Segmento
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Novo Segmento</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Nome do Segmento</Label>
                <Input placeholder="Ex: Atraso Leve" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Dias de Atraso (Início)</Label>
                  <Input type="number" placeholder="0" />
                </div>
                <div className="space-y-2">
                  <Label>Dias de Atraso (Fim)</Label>
                  <Input type="number" placeholder="30" />
                </div>
              </div>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">Criar Segmento</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Segmentos Configurados</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome do Segmento</TableHead>
                <TableHead>Faixa de Atraso</TableHead>
                <TableHead>Quantidade de Registros</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {segmentos.map((segmento) => (
                <TableRow key={segmento.id}>
                  <TableCell>{segmento.nome}</TableCell>
                  <TableCell>{segmento.faixaInicio} - {segmento.faixaFim} dias</TableCell>
                  <TableCell>{segmento.quantidade} registros</TableCell>
                  <TableCell>
                    {segmento.ativo ? (
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Ativo</Badge>
                    ) : (
                      <Badge variant="secondary">Inativo</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
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
