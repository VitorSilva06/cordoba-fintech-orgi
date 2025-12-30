import { Bell, User, Menu, LogOut } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { ThemeToggle } from '../components/ui/theme-toggle';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  userProfile: string;
  onMenuToggle?: () => void;
  userName?: string;
}

export function Header({ userProfile, onMenuToggle, userName }: HeaderProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <header className="h-24 bg-[var(--bg-card)] border-b border-[var(--border-primary)] flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center gap-3">
        {onMenuToggle && (
          <button 
            onClick={onMenuToggle}
            className="lg:hidden p-2 text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <div>
          <h2 className="text-[var(--text-primary)] text-sm md:text-base lg:text-lg">Sistema de Gestão de Cobrança</h2>
          <p className="text-[var(--text-secondary)] text-xs md:text-sm hidden sm:block">
            {userName ? `Olá, ${userName}` : `Bem-vindo ao painel de ${userProfile}`}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 md:gap-4">
        <ThemeToggle />
        <button className="relative p-2 text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] rounded-lg transition-colors">
          <Bell className="w-4 h-4 md:w-5 md:h-5" />
          <Badge className="absolute -top-1 -right-1 w-4 h-4 md:w-5 md:h-5 p-0 flex items-center justify-center bg-[var(--brand-error)] text-white text-xs">
            3
          </Badge>
        </button>
        <div className="hidden md:flex items-center gap-3 px-3 py-2 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-primary)]">
          <div className="w-8 h-8 bg-[var(--brand-primary)] rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <span className="text-[var(--text-primary)] text-sm">{userName || userProfile}</span>
        </div>
        <button 
          onClick={handleLogout}
          className="p-2 text-[var(--text-primary)] hover:bg-[var(--brand-error)]/20 hover:text-[var(--brand-error)] rounded-lg transition-colors"
          title="Sair"
        >
          <LogOut className="w-4 h-4 md:w-5 md:h-5" />
        </button>
      </div>
    </header>
  );
}