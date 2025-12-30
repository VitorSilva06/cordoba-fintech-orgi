import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { Lock, Mail, AlertCircle, Building2, Eye, EyeOff } from 'lucide-react';

interface ImprovedLoginProps {
  onLogin?: () => void;
}

export function ImprovedLogin({ onLogin }: ImprovedLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    // Validações básicas
    if (!email || !password) {
      setError('Por favor, preencha todos os campos');
      setIsSubmitting(false);
      return;
    }

    if (!email.includes('@')) {
      setError('Por favor, insira um e-mail válido');
      setIsSubmitting(false);
      return;
    }

    // Simula login e redireciona
    setTimeout(() => {
      setIsSubmitting(false);
      if (onLogin) {
        onLogin();
      } else {
        navigate('/app');
      }
    }, 500);
  };

  const formDisabled = isSubmitting;

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
              CÓRDOBA FINTECH
            </h1>
            <p className="text-sm text-[var(--text-tertiary)] mt-1">
              Inteligência em Recuperação de Crédito
            </p>
          </div>
        </div>

        {/* Card de Login */}
        <Card className="border-[var(--border-primary)] bg-[var(--bg-card)] shadow-[var(--shadow-xl)] transition-colors duration-300">
          <CardHeader className="space-y-2 pb-6">
            <CardTitle className="text-2xl font-semibold text-center text-[var(--text-primary)]">
              Bem-vindo de volta
            </CardTitle>
            <CardDescription className="text-center text-[var(--text-secondary)]">
              Entre com suas credenciais para acessar a plataforma
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
                    disabled={formDisabled}
                  />
                </div>
              </div>

              {/* Campo de Senha */}
              <div className="space-y-2">
                <Label 
                  htmlFor="password" 
                  className="text-sm font-medium text-[var(--text-primary)]"
                >
                  Senha
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)] pointer-events-none" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-11 bg-[var(--bg-input)] border-[var(--border-primary)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--border-focus)] focus:ring-2 focus:ring-[var(--brand-primary)]/20 transition-all"
                    required
                    disabled={formDisabled}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
                    disabled={formDisabled}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Erro */}
              {error && (
                <Alert variant="destructive" className="py-3">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Esqueci a senha */}
              <div className="flex items-center justify-end">
                <Link
                  to="/forgot-password"
                  className="text-sm font-medium text-[var(--brand-primary)] hover:text-[var(--brand-primary-hover)] transition-colors"
                >
                  Esqueci minha senha
                </Link>
              </div>

              {/* Botão de Login */}
              <Button 
                type="submit" 
                className="w-full h-11 bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={formDisabled}
              >
                {formDisabled ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Entrando...
                  </span>
                ) : (
                  'Entrar'
                )}
              </Button>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[var(--border-secondary)]"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-[var(--bg-card)] text-[var(--text-muted)]">
                    ou continue com
                  </span>
                </div>
              </div>

              {/* Google Login */}
              <Button 
                type="button" 
                variant="outline" 
                className="w-full h-11 border-[var(--border-primary)] text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition-all"
                disabled={formDisabled}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC04" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Conectar com Google
              </Button>

              {/* Link para Cadastro */}
              <p className="text-center text-sm text-[var(--text-secondary)] mt-6">
                Não tem uma conta?{' '}
                <Link 
                  to="/register" 
                  className="font-semibold text-[var(--brand-primary)] hover:text-[var(--brand-primary-hover)] transition-colors"
                >
                  Criar conta
                </Link>
              </p>
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
