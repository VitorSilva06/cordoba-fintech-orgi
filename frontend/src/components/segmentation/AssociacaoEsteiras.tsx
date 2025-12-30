import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Save } from 'lucide-react';

export function AssociacaoEsteiras() {
  const segmentos = [
    { 
      id: 1, 
      nome: 'Atraso Leve (0-30 dias)', 
      canais: ['WhatsApp', 'E-mail'],
      script: 'Script Amigável',
      frequencia: 'Diária'
    },
    { 
      id: 2, 
      nome: 'Atraso Moderado (31-60 dias)', 
      canais: ['WhatsApp', 'Voz', 'E-mail'],
      script: 'Script Intermediário',
      frequencia: '2x ao dia'
    },
    { 
      id: 3, 
      nome: 'Atraso Grave (61-90 dias)', 
      canais: ['Voz', 'WhatsApp', 'SMS'],
      script: 'Script Assertivo',
      frequencia: '3x ao dia'
    },
    { 
      id: 4, 
      nome: 'Atraso Crítico (91-120 dias)', 
      canais: ['Voz', 'SMS'],
      script: 'Script Urgente',
      frequencia: '4x ao dia'
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-gray-900">Associação a Esteiras</h1>
        <p className="text-gray-600">Configure canais e scripts para cada segmento</p>
      </div>

      {segmentos.map((segmento) => (
        <Card key={segmento.id}>
          <CardHeader>
            <CardTitle>{segmento.nome}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Canais de Comunicação</Label>
                <Select defaultValue={segmento.canais[0]}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                    <SelectItem value="Voz">Voz (CallBot)</SelectItem>
                    <SelectItem value="E-mail">E-mail</SelectItem>
                    <SelectItem value="SMS">SMS</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex gap-2 mt-2">
                  {segmento.canais.map((canal) => (
                    <Badge key={canal} className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                      {canal}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Script de Cobrança</Label>
                <Select defaultValue={segmento.script}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Script Amigável">Script Amigável</SelectItem>
                    <SelectItem value="Script Intermediário">Script Intermediário</SelectItem>
                    <SelectItem value="Script Assertivo">Script Assertivo</SelectItem>
                    <SelectItem value="Script Urgente">Script Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Frequência de Contato</Label>
                <Select defaultValue={segmento.frequencia}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Diária">1x ao dia</SelectItem>
                    <SelectItem value="2x ao dia">2x ao dia</SelectItem>
                    <SelectItem value="3x ao dia">3x ao dia</SelectItem>
                    <SelectItem value="4x ao dia">4x ao dia</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Prioridade</Label>
                <Select defaultValue={segmento.id <= 2 ? 'media' : 'alta'}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="baixa">Baixa</SelectItem>
                    <SelectItem value="media">Média</SelectItem>
                    <SelectItem value="alta">Alta</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
              <Save className="w-4 h-4" />
              Salvar Configuração
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
