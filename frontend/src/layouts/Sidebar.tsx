import { 
  LayoutDashboard, Upload, Database, Layers, MessageSquare, 
  CreditCard, FileText, Shield, Brain, Settings, ChevronDown,
  Phone, Send, Activity, DollarSign, BarChart3, Users, Lock,
  Server, FileCheck, AlertTriangle, X
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '../components/ui/utils';
import { ScrollArea } from '../components/ui/scroll-area';

interface SidebarProps {
  activeScreen: string;
  onNavigate: (screen: string) => void;
  userProfile: 'Diretor' | 'Gerente' | 'Operador' | 'Cliente';
  isOpen?: boolean;
  onClose?: () => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  submenu?: MenuItem[];
  roles?: string[];
}

export function Sidebar({ activeScreen, onNavigate, userProfile, isOpen, onClose }: SidebarProps) {
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['dashboard']);

  const menuItems: MenuItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      submenu: [
        { id: 'dashboard', label: 'Dashboard Principal', icon: LayoutDashboard },
        { id: 'dashboard-inadimplencia', label: 'Análise de Inadimplência', icon: BarChart3 },
      ],
    },
    {
      id: 'base',
      label: 'Gestão de Base',
      icon: Database,
      roles: ['Diretor', 'Gerente'],
      submenu: [
        { id: 'upload-base', label: 'Upload de Base', icon: Upload },
        { id: 'validacao-automatica', label: 'Validação Automática', icon: FileCheck },
        { id: 'logs-importacao', label: 'Logs de Importação', icon: FileText },
        { id: 'visualizacao-base', label: 'Visualização de Base', icon: Database },
      ],
    },
    {
      id: 'segmentacao',
      label: 'Segmentação & Esteiras',
      icon: Layers,
      roles: ['Diretor', 'Gerente'],
      submenu: [
        { id: 'configuracao-segmentos', label: 'Configuração de Segmentos', icon: Layers },
        { id: 'associacao-esteiras', label: 'Associação a Esteiras', icon: Activity },
        { id: 'scripts-cobranca', label: 'Scripts de Cobrança', icon: FileText },
        { id: 'distribuicao-carteiras', label: 'Distribuição de Carteiras', icon: Users },
      ],
    },
    {
      id: 'comunicacao',
      label: 'Comunicação',
      icon: MessageSquare,
      submenu: [
        { id: 'disparos-whatsapp', label: 'Disparos WhatsApp', icon: Send },
        { id: 'disparos-voz', label: 'Disparos Voz', icon: Phone },
        { id: 'monitor-disparos', label: 'Monitor de Disparos', icon: Activity },
        { id: 'historico-interacoes', label: 'Histórico de Interações', icon: MessageSquare },
      ],
    },
    {
      id: 'pagamentos',
      label: 'Pagamentos',
      icon: CreditCard,
      submenu: [
        { id: 'emissao-pagamento', label: 'Emissão de Pagamento', icon: DollarSign },
        { id: 'painel-conciliacao', label: 'Painel de Conciliação', icon: FileCheck },
        { id: 'webhooks-log', label: 'Webhooks Log', icon: Server },
        { id: 'fluxo-financeiro', label: 'Fluxo Financeiro', icon: BarChart3 },
      ],
    },
    {
      id: 'relatorios',
      label: 'Relatórios',
      icon: FileText,
      submenu: [
        { id: 'relatorios-dinamicos', label: 'Relatórios Dinâmicos', icon: BarChart3 },
        { id: 'exportar-dados', label: 'Exportar Dados', icon: Upload },
        { id: 'agendamento-relatorios', label: 'Agendamento de Relatórios', icon: FileText },
        { id: 'snapshots-mensais', label: 'Snapshots Mensais', icon: FileCheck },
      ],
    },
    {
      id: 'auditoria',
      label: 'Auditoria & Logs',
      icon: Shield,
      roles: ['Diretor', 'Gerente'],
      submenu: [
        { id: 'auditoria-acesso', label: 'Auditoria de Acesso', icon: Lock },
        { id: 'logs-acao', label: 'Logs de Ação', icon: FileText },
        { id: 'eventos-integracao', label: 'Eventos de Integração', icon: Server },
        { id: 'monitor-seguranca', label: 'Monitor de Segurança', icon: AlertTriangle },
      ],
    },
    {
      id: 'ia',
      label: 'IA e Aprendizado',
      icon: Brain,
      roles: ['Diretor', 'Gerente'],
      submenu: [
        { id: 'painel-insights', label: 'Painel de Insights', icon: Brain },
        { id: 'indicadores-aprendizado', label: 'Indicadores de Aprendizado', icon: BarChart3 },
        { id: 'feedback-manual', label: 'Feedback Manual', icon: MessageSquare },
      ],
    },
    {
      id: 'admin',
      label: 'Administração',
      icon: Settings,
      roles: ['Diretor'],
      submenu: [
        { id: 'gerenciamento-usuarios', label: 'Gerenciamento de Usuários', icon: Users },
        { id: 'cadastro-usuario', label: 'Cadastro de Usuário', icon: Users },
        { id: 'perfis-permissoes', label: 'Perfis e Permissões', icon: Lock },
        { id: 'configuracoes-tenant', label: 'Configurações de Tenant', icon: Settings },
        { id: 'backups-restauracao', label: 'Backups e Restauração', icon: Database },
        { id: 'politica-lgpd', label: 'Política LGPD', icon: Shield },
        { id: 'perfil-usuario', label: 'Perfil do Usuário', icon: Users },
        { id: 'troca-senha', label: 'Troca de Senha', icon: Lock },
      ],
    },
  ];

  const toggleMenu = (menuId: string) => {
    setExpandedMenus(prev =>
      prev.includes(menuId)
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    );
  };

  const hasAccess = (item: MenuItem) => {
    if (!item.roles) return true;
    return item.roles.includes(userProfile);
  };

  const handleMenuClick = (itemId: string, hasSubmenu: boolean) => {
    if (hasSubmenu) {
      toggleMenu(itemId);
    } else {
      onNavigate(itemId);
      if (onClose) {
        onClose();
      }
    }
  };

  const renderMenuItem = (item: MenuItem, level = 0) => {
    if (!hasAccess(item)) return null;

    const hasSubmenu = item.submenu && item.submenu.length > 0;
    const isExpanded = expandedMenus.includes(item.id);
    const isActive = activeScreen === item.id;
    const Icon = item.icon;

    return (
      <div key={item.id}>
        <button
          onClick={() => handleMenuClick(item.id, hasSubmenu || false)}
          className={cn(
            "w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 text-left group",
            level === 0 && "mt-1",
            level === 1 && "ml-4 text-sm",
            isActive && "bg-primary text-white shadow-sm",
            !isActive && "text-sidebar-foreground hover:bg-sidebar-accent"
          )}
        >
          <div className="flex items-center gap-3 min-w-0">
            <Icon className={cn(
              "w-5 h-5 shrink-0 transition-colors",
              isActive ? "text-white" : "text-sidebar-foreground/70 group-hover:text-sidebar-foreground"
            )} />
            <span className="truncate">{item.label}</span>
          </div>
          {hasSubmenu && (
            <ChevronDown
              className={cn(
                "w-4 h-4 shrink-0 transition-transform duration-200",
                isExpanded && "rotate-180"
              )}
            />
          )}
        </button>
        {hasSubmenu && isExpanded && (
          <div className="mt-1 space-y-0.5 animate-slide-down">
            {item.submenu!.map(subItem => renderMenuItem(subItem, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Overlay para mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={cn(
        "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-sidebar flex flex-col transition-transform duration-300 lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Header */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <div>
                <h1 className="text-sidebar-foreground font-semibold">Córdoba</h1>
                <p className="text-sidebar-foreground/60 text-xs">Fintech</p>
              </div>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="lg:hidden p-1.5 text-sidebar-foreground hover:bg-sidebar-accent rounded-lg transition-colors"
                aria-label="Fechar menu"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
        
        {/* Navigation */}
        <ScrollArea className="flex-1 px-3 py-4">
          <nav className="space-y-1">
            {menuItems.map(item => renderMenuItem(item))}
          </nav>
        </ScrollArea>
        
        {/* Footer */}
        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3 text-sidebar-foreground/60 text-xs">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span>Sistema Online</span>
          </div>
        </div>
      </aside>
    </>
  );
}