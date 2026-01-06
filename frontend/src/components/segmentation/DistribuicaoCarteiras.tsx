import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableEmpty } from '../ui/table';
import { Badge } from '../ui/badge';
import { Users, ArrowRight, Inbox } from 'lucide-react';

export function DistribuicaoCarteiras() {
  const operadores: Array<{ id: number; nome: string; equipe: string; leads: number; capacidade: number; performance: number }> = [];

  const leadsDisponiveis: Array<{ segmento: string; quantidade: number; prioridade: string }> = [];

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Distribuição de Carteiras</h1>
          <p className="page-description">Distribua leads entre operadores e equipes</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Leads Disponíveis para Distribuição</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {leadsDisponiveis.length === 0 ? (
              <div className="empty-state py-8">
                <Inbox className="w-12 h-12 text-text-muted mx-auto mb-3" />
                <p className="text-foreground font-medium">Nenhum lead disponível</p>
                <p className="text-text-muted text-sm">Faça upload de uma base para distribuir</p>
              </div>
            ) : (
              leadsDisponiveis.map((lead) => (
                <div key={lead.segmento} className="flex items-center justify-between p-4 bg-secondary rounded-lg border border-border">
                  <div className="flex-1">
                    <p className="text-foreground font-medium">{lead.segmento}</p>
                    <p className="text-text-secondary text-sm">{lead.quantidade} leads disponíveis</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={lead.prioridade === 'alta' ? 'destructive' : lead.prioridade === 'media' ? 'warning' : 'secondary'}>
                      {lead.prioridade === 'alta' ? 'Alta' : lead.prioridade === 'media' ? 'Média' : 'Baixa'}
                    </Badge>
                    <Button size="sm">Distribuir</Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribuição Rápida</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="form-label">Selecionar Segmento</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Escolha um segmento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-30">Atraso Leve (0-30)</SelectItem>
                  <SelectItem value="31-60">Atraso Moderado (31-60)</SelectItem>
                  <SelectItem value="61-90">Atraso Grave (61-90)</SelectItem>
                  <SelectItem value="91-120">Atraso Crítico (91-120)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="form-label">Selecionar Equipe</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Escolha uma equipe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="a">Equipe A</SelectItem>
                  <SelectItem value="b">Equipe B</SelectItem>
                  <SelectItem value="c">Equipe C</SelectItem>
                  <SelectItem value="todas">Todas as Equipes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="form-label">Critério de Distribuição</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Escolha o critério" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="capacidade">Por Capacidade</SelectItem>
                  <SelectItem value="performance">Por Performance</SelectItem>
                  <SelectItem value="igualitaria">Distribuição Igualitária</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button className="w-full mt-4">
              <ArrowRight className="w-4 h-4" />
              Distribuir Automaticamente
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Operadores e Capacidade</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Operador</TableHead>
                <TableHead>Equipe</TableHead>
                <TableHead>Leads Atuais</TableHead>
                <TableHead>Capacidade</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead>Utilização</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {operadores.length === 0 ? (
                <TableEmpty
                  colSpan={6}
                  icon={Users}
                  title="Nenhum operador cadastrado"
                  description="Adicione operadores para distribuir leads"
                />
              ) : (
                operadores.map((op) => {
                  const utilizacao = (op.leads / op.capacidade) * 100;
                  return (
                    <TableRow key={op.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <Users className="w-4 h-4 text-primary" />
                          </div>
                          <span className="font-medium">{op.nome}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{op.equipe}</Badge>
                      </TableCell>
                      <TableCell>{op.leads}</TableCell>
                      <TableCell>{op.capacidade}</TableCell>
                      <TableCell className="text-primary font-medium">{op.performance}%</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-secondary rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all ${utilizacao > 80 ? 'bg-destructive' : utilizacao > 60 ? 'bg-warning' : 'bg-success'}`}
                              style={{ width: `${utilizacao}%` }}
                            />
                          </div>
                          <span className="text-sm text-text-secondary">{utilizacao.toFixed(0)}%</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
