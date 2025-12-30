import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Save, Plus } from 'lucide-react';
import { Badge } from '../ui/badge';

export function ScriptsCobranca() {
  const [scripts] = useState([
    {
      id: 1,
      nome: 'Script Amigável',
      whatsapp: 'Olá {nome}! Identificamos um débito de R$ {valor} com vencimento em {data}. Podemos ajudá-lo a regularizar? 😊',
      voz: 'Olá, aqui é da empresa X. Identificamos um débito no seu CPF. Podemos conversar sobre como regularizar sua situação?',
      segmento: 'Atraso Leve'
    },
    {
      id: 2,
      nome: 'Script Intermediário',
      whatsapp: 'Prezado(a) {nome}, seu débito de R$ {valor} está em aberto há {dias} dias. Vamos regularizar? Entre em contato conosco.',
      voz: 'Prezado cliente, entramos em contato para informar sobre um débito pendente. É importante que você regularize sua situação o quanto antes.',
      segmento: 'Atraso Moderado'
    },
    {
      id: 3,
      nome: 'Script Assertivo',
      whatsapp: 'IMPORTANTE {nome}: Seu débito de R$ {valor} está vencido há {dias} dias. Regularize HOJE para evitar negativação!',
      voz: 'Este é um contato importante. Seu nome está prestes a ser negativado devido ao não pagamento. Entre em contato imediatamente.',
      segmento: 'Atraso Grave'
    },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900">Scripts de Cobrança</h1>
          <p className="text-gray-600">Configure mensagens para WhatsApp e CallBot</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
          <Plus className="w-4 h-4" />
          Novo Script
        </Button>
      </div>

      {scripts.map((script) => (
        <Card key={script.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{script.nome}</CardTitle>
                <Badge className="mt-2 bg-blue-100 text-blue-700 hover:bg-blue-100">
                  {script.segmento}
                </Badge>
              </div>
              <Button variant="outline">Duplicar</Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="whatsapp">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
                <TabsTrigger value="voz">Voz (CallBot)</TabsTrigger>
              </TabsList>
              
              <TabsContent value="whatsapp" className="space-y-4">
                <div className="space-y-2">
                  <Label>Mensagem WhatsApp</Label>
                  <Textarea
                    defaultValue={script.whatsapp}
                    rows={4}
                    placeholder="Digite o script para WhatsApp..."
                  />
                  <p className="text-sm text-gray-500">
                    Variáveis disponíveis: {'{nome}'}, {'{valor}'}, {'{data}'}, {'{dias}'}
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="voz" className="space-y-4">
                <div className="space-y-2">
                  <Label>Script de Voz</Label>
                  <Textarea
                    defaultValue={script.voz}
                    rows={4}
                    placeholder="Digite o script para CallBot..."
                  />
                  <p className="text-sm text-gray-500">
                    Variáveis disponíveis: {'{nome}'}, {'{valor}'}, {'{data}'}, {'{dias}'}
                  </p>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex gap-3 mt-6">
              <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
                <Save className="w-4 h-4" />
                Salvar Alterações
              </Button>
              <Button variant="outline">
                Testar Script
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
