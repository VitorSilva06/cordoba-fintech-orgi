import { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../ui/input-otp';
import { Shield } from 'lucide-react';

interface MFAProps {
  onVerify: () => void;
}

export function MFA({ onVerify }: MFAProps) {
  const [code, setCode] = useState('');
  const [isResending, setIsResending] = useState(false);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length === 6) {
      onVerify();
    }
  };

  const handleResend = () => {
    setIsResending(true);
    setTimeout(() => setIsResending(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#003a70] via-[#004d8f] to-[#003a70] flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-white/20">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto space-y-1">
            <h1 className="text-[#FFC500] text-2xl">CÓRDOBA FINTECH</h1>
            <p className="text-[#FFC500] text-xs">INTELIGÊNCIA EM RECUPERAÇÃO DE CRÉDITO</p>
          </div>
          <div className="mx-auto w-16 h-16 bg-[#FFC500] rounded-2xl flex items-center justify-center">
            <Shield className="w-8 h-8 text-[#003a70]" />
          </div>
          <CardTitle className="text-[#003a70]">Autenticação de Dois Fatores</CardTitle>
          <CardDescription>Digite o código de 6 dígitos enviado para seu dispositivo</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleVerify} className="space-y-6">
            <div className="flex justify-center">
              <InputOTP maxLength={6} value={code} onChange={setCode}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={handleResend}
                disabled={isResending}
                className="text-[#003a70] hover:text-[#0066cc] disabled:text-muted-foreground text-sm transition-colors"
              >
                {isResending ? 'Reenviando...' : 'Reenviar código'}
              </button>
            </div>

            <Button type="submit" className="w-full bg-[#003a70] hover:bg-[#004d8f] text-white" disabled={code.length !== 6}>
              Verificar
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
