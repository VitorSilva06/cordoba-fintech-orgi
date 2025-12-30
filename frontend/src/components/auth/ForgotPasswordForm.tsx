import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { Building2, Mail, AlertCircle, ArrowLeft, CheckCircle2 } from 'lucide-react';

export function ForgotPasswordForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Por favor, insira seu e-mail');
      return;
    }

    if (!email.includes('@')) {
      setError('Por favor, insira um e-mail válido');
      return;
    }

    setIsLoading(true);

    setEmailSent(true);
    setIsLoading(false);
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--bg-secondary)] transition-colors duration-300">
        <div className="w-full max-w-md space-y-8">
          {/* Logo e Título */}
          <div className="text-center space-y-3">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-[var(--brand-success)] to-[var(--brand-accent)] rounded-2xl flex items-center justify-center shadow-lg">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[var(--text-primary)] tracking-tight">
                E-mail enviado!
              </h1>
              <p className="text-sm text-[var(--text-tertiary)] mt-1">
                Verifique sua caixa de entrada
              </p>
            </div>
          </div>

          {/* Card de Sucesso */}
          <Card className="border-[var(--border-primary)] bg-[var(--bg-card)] shadow-[var(--shadow-xl)] transition-colors duration-300">
            <CardContent className="pt-6 space-y-6">
              <div className="text-center space-y-4">
                <div className="p-4 bg-[var(--brand-success)]/10 rounded-lg border border-[var(--brand-success)]/20">
                  <p className="text-sm text-[var(--text-secondary)]">
                    Enviamos um link de recuperação de senha para
                  </p>
                  <p className="font-semibold text-[var(--text-primary)] mt-1">
                    {email}
                  </p>
                </div>

                <div className="text-left space-y-2 text-sm text-[var(--text-secondary)]">
                  <p className="font-medium text-[var(--text-primary)]">Próximos passos:</p>
                  <ol className="list-decimal list-inside space-y-1 ml-2">
                    <li>Verifique sua caixa de entrada</li>
                    <li>Clique no link de recuperação</li>
                    <li>Crie uma nova senha</li>
                  </ol>
                </div>

                <p className="text-xs text-[var(--text-muted)]">
                  Não recebeu o e-mail? Verifique sua pasta de spam ou{' '}
                  <button 
                    onClick={() => setEmailSent(false)} 
                    className="text-[var(--brand-primary)] hover:text-[var(--brand-primary-hover)] font-medium transition-colors"
                  >
                    tente novamente
                  </button>
                </p>
              </div>

              <Button 
                onClick={handleBackToLogin}
                className="w-full h-11 bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white font-semibold shadow-md hover:shadow-lg transition-all"
              >
                Voltar para o login
              </Button>
            </CardContent>
          </Card>

          {/* Footer */}
          <p className="text-center text-xs text-[var(--text-muted)]">
            © 2025 Córdoba Fintech. Todos os direitos reservados.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--bg-secondary)] transition-colors duration-300">
      <div className="w-full max-w-md space-y-8">
        {/* Logo e Título */}
        <div className="text-center space-y-3">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-accent)] rounded-2xl flex items-center justify-center shadow-lg">
            <Building2 className="w-10 h-10 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[var(--text-primary)] tracking-tight">
              Recuperar senha
            </h1>
            <p className="text-sm text-[var(--text-tertiary)] mt-1">
              Enviaremos um link de recuperação para seu e-mail
            </p>
          </div>
        </div>

        {/* Card de Recuperação */}
        <Card className="border-[var(--border-primary)] bg-[var(--bg-card)] shadow-[var(--shadow-xl)] transition-colors duration-300">
          <CardHeader className="space-y-2 pb-6">
            <CardTitle className="text-2xl font-semibold text-center text-[var(--text-primary)]">
              Esqueci minha senha
            </CardTitle>
            <CardDescription className="text-center text-[var(--text-secondary)]">
              Digite seu e-mail para receber as instruções de recuperação
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Campo de E-mail */}
              <div className="space-y-2">
                <Label 
                  htmlFor="email" 
                  className="text-sm font-medium text-[var(--text-primary)]"
                >
                  E-mail
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)] pointer-events-none" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-11 bg-[var(--bg-input)] border-[var(--border-primary)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--border-focus)] focus:ring-2 focus:ring-[var(--brand-primary)]/20 transition-all"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Erro */}
              {error && (
                <Alert variant="destructive" className="py-3">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Botão de Enviar */}
              <Button 
                type="submit" 
                className="w-full h-11 bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Enviando...
                  </span>
                ) : (
                  'Enviar link de recuperação'
                )}
              </Button>

              {/* Link para voltar */}
              <Link 
                to="/login"
                className="flex items-center justify-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors mt-4"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar para o login
              </Link>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-[var(--text-muted)]">
          © 2025 Córdoba Fintech. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
}
