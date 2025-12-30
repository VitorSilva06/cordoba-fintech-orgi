import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { CheckCircle, XCircle, Clock, FileText, Download } from 'lucide-react';

export function LogsImportacao() {
  const logs: Array<{ id: number; arquivo: string; data: string; registros: number; status: string; processados: number; erros: number }> = [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'sucesso':
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
            <CheckCircle className="w-3 h-3 mr-1" />
            Sucesso
          </Badge>
        );
      case 'erro':
        return (
          <Badge variant="destructive">
            <XCircle className="w-3 h-3 mr-1" />
            Erro
          </Badge>
        );
      case 'processando':
        return (
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
            <Clock className="w-3 h-3 mr-1" />
            Processando
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-gray-900">Logs de Importação</h1>
        <p className="text-gray-600">Histórico de uploads e status de processamento</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Importações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {logs.map((log) => (
              <div key={log.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <p className="text-gray-900">{log.arquivo}</p>
                      {getStatusBadge(log.status)}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>{log.data}</span>
                      <span>•</span>
                      <span>{log.registros} registros</span>
                      <span>•</span>
                      <span className="text-green-600">{log.processados} processados</span>
                      {log.erros > 0 && (
                        <>
                          <span>•</span>
                          <span className="text-red-600">{log.erros} erros</span>
                        </>
                      )}
                    </div>
                    {log.status === 'processando' && (
                      <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${(log.processados / log.registros) * 100}%` }}
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  {log.status === 'erro' && (
                    <Button variant="outline" size="sm">
                      Ver Erros
                    </Button>
                  )}
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
