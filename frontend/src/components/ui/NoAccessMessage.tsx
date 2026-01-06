import { AlertTriangle, Clock, User } from 'lucide-react';
import { Card } from './card';

interface NoAccessMessageProps {
  userName?: string;
  message?: string;
}

export function NoAccessMessage({ userName, message }: NoAccessMessageProps) {
  return (
    <div className="flex items-center justify-center min-h-[60vh] p-6">
      <Card className="max-w-lg w-full p-8 text-center bg-card border-border">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-warning/20 flex items-center justify-center">
            <AlertTriangle className="w-10 h-10 text-warning" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-foreground mb-3">
          Acesso Pendente
        </h2>
        
        <p className="text-text-secondary mb-6">
          {message || 'Você ainda não foi atribuído a nenhum tenant. Aguarde a atribuição pelo administrador para visualizar os dados.'}
        </p>
        
        <div className="bg-secondary/50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-center gap-2 text-text-secondary">
            <User className="w-5 h-5" />
            <span>{userName || 'Usuário'}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-center gap-2 text-text-tertiary text-sm">
          <Clock className="w-4 h-4" />
          <span>Aguardando atribuição de tenant</span>
        </div>
        
        <div className="mt-6 pt-6 border-t border-border">
          <p className="text-sm text-text-muted">
            Entre em contato com o administrador do sistema para solicitar acesso aos dados.
          </p>
        </div>
      </Card>
    </div>
  );
}
