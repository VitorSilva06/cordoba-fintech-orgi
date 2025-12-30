import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Phone, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';

export function DashboardOperador() {
  const minhasMetas = {
    contatosDia: { meta: 0, realizado: 0, percentual: 0 },
    conversoesDia: { meta: 0, realizado: 0, percentual: 0 },
    receitaDia: { meta: 0, realizado: 0, percentual: 0 },
  };

  const filaContatos: Array<{ id: number; nome: string; cpf: string; valor: number; dias: number; telefone: string; prioridade: string }> = [];

  const tarefasDia: Array<{ id: number; descricao: string; status: string; horario: string }> = [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[var(--text-primary)] transition-colors duration-300">Dashboard Operacional</h1>
        <p className="text-[var(--text-secondary)] transition-colors duration-300">Suas metas e fila de contatos</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="transition-colors duration-300">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[var(--text-secondary)] transition-colors duration-300">Contatos do Dia</p>
              <Phone className="w-5 h-5 text-[var(--brand-primary)]" />
            </div>
            <p className="text-[var(--text-primary)] mb-3 transition-colors duration-300">{minhasMetas.contatosDia.realizado} / {minhasMetas.contatosDia.meta}</p>
            <Progress value={minhasMetas.contatosDia.percentual} className="h-2" />
            <p className="text-[var(--text-muted)] text-xs mt-2 transition-colors duration-300">{minhasMetas.contatosDia.percentual}% da meta</p>
          </CardContent>
        </Card>

        <Card className="transition-colors duration-300">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[var(--text-secondary)] transition-colors duration-300">Conversões do Dia</p>
              <CheckCircle className="w-5 h-5 text-[var(--brand-success)]" />
            </div>
            <p className="text-[var(--text-primary)] mb-3 transition-colors duration-300">{minhasMetas.conversoesDia.realizado} / {minhasMetas.conversoesDia.meta}</p>
            <Progress value={minhasMetas.conversoesDia.percentual} className="h-2" />
            <p className="text-[var(--text-muted)] text-xs mt-2 transition-colors duration-300">{minhasMetas.conversoesDia.percentual}% da meta</p>
          </CardContent>
        </Card>

        <Card className="transition-colors duration-300">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[var(--text-secondary)] transition-colors duration-300">Receita do Dia</p>
              <AlertCircle className="w-5 h-5 text-[var(--brand-primary)]" />
            </div>
            <p className="text-[var(--text-primary)] mb-3 transition-colors duration-300">R$ {minhasMetas.receitaDia.realizado.toLocaleString()} / R$ {minhasMetas.receitaDia.meta.toLocaleString()}</p>
            <Progress value={minhasMetas.receitaDia.percentual} className="h-2" />
            <p className="text-[var(--text-muted)] text-xs mt-2 transition-colors duration-300">{minhasMetas.receitaDia.percentual}% da meta</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 transition-colors duration-300">
          <CardHeader>
            <CardTitle className="transition-colors duration-300">Fila de Contatos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filaContatos.map((contato) => (
                <div key={contato.id} className="flex items-center justify-between p-4 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-primary)] transition-colors duration-300">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-[var(--text-primary)] transition-colors duration-300">{contato.nome}</p>
                      <Badge variant={contato.prioridade === 'alta' ? 'destructive' : contato.prioridade === 'media' ? 'default' : 'secondary'}>
                        {contato.prioridade}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm text-[var(--text-secondary)] transition-colors duration-300">
                      <span>{contato.cpf}</span>
                      <span>•</span>
                      <span>{contato.telefone}</span>
                      <span>•</span>
                      <span>{contato.dias} dias de atraso</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-[var(--brand-primary)] transition-colors duration-300">R$ {contato.valor.toLocaleString()}</p>
                    </div>
                    <Button size="sm" className="bg-[var(--brand-primary)] hover:bg-[var(--brand-primary)]/90 transition-colors duration-300">
                      <Phone className="w-4 h-4 mr-2" />
                      Ligar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="transition-colors duration-300">
          <CardHeader>
            <CardTitle className="transition-colors duration-300">Tarefas do Dia</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tarefasDia.map((tarefa) => (
                <div key={tarefa.id} className="p-3 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-primary)] transition-colors duration-300">
                  <div className="flex items-start justify-between mb-2">
                    <Clock className="w-4 h-4 text-[var(--text-muted)] mt-0.5" />
                    <Badge variant={tarefa.status === 'concluido' ? 'default' : 'outline'}>
                      {tarefa.status === 'concluido' ? 'Concluído' : 'Pendente'}
                    </Badge>
                  </div>
                  <p className="text-sm text-[var(--text-primary)] transition-colors duration-300">{tarefa.descricao}</p>
                  <p className="text-xs text-[var(--text-muted)] mt-1 transition-colors duration-300">{tarefa.horario}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
