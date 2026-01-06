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
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 md:px-6 transition-colors duration-200">
      <div className="flex items-center gap-3">
        {onMenuToggle && (
          <button 
            onClick={onMenuToggle}
            className="lg:hidden p-2 text-foreground hover:bg-secondary rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <div>
          <h2 className="text-foreground text-sm md:text-base font-medium">
            Sistema de Gestão de Cobrança
          </h2>
          <p className="text-text-secondary text-xs md:text-sm hidden sm:block">
            {userName ? `Olá, ${userName}` : `Bem-vindo ao painel de ${userProfile}`}
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-2 md:gap-3">
        <ThemeToggle />
        
        <button 
          className="relative p-2 text-foreground hover:bg-secondary rounded-lg transition-colors"
          aria-label="Notificações"
        >
          <Bell className="w-5 h-5" />
          <Badge 
            variant="solid-destructive"
            className="absolute -top-0.5 -right-0.5 w-5 h-5 p-0 flex items-center justify-center text-[10px]"
          >
            3
          </Badge>
        </button>
        
        <div className="hidden md:flex items-center gap-3 px-3 py-2 bg-secondary rounded-lg">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <span className="text-foreground text-sm font-medium">
            {userName || userProfile}
          </span>
        </div>
        
        <button 
          onClick={handleLogout}
          className="p-2 text-foreground hover:bg-destructive/10 hover:text-destructive rounded-lg transition-colors"
          title="Sair"
          aria-label="Sair"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}