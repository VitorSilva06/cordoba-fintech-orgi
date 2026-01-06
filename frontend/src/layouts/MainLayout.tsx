import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useAuth } from '../contexts/AuthContext';
import { NoAccessMessage } from '../components/ui/NoAccessMessage';
import { Dashboard } from '../components/dashboards/Dashboard';
import { DashboardDiretor } from '../components/dashboards/DashboardDiretor';
import { DashboardGerente } from '../components/dashboards/DashboardGerente';
import { DashboardOperador } from '../components/dashboards/DashboardOperador';
import { DashboardCliente } from '../components/dashboards/DashboardCliente';
import { DashboardInadimplencia } from '../components/dashboards/DashboardInadimplencia';
import { UploadBase } from '../components/base/UploadBase';
import { ValidacaoAutomatica } from '../components/base/ValidacaoAutomatica';
import { LogsImportacao } from '../components/base/LogsImportacao';
import { VisualizacaoBase } from '../components/base/VisualizacaoBase';
import { ConfiguracaoSegmentos } from '../components/segmentation/ConfiguracaoSegmentos';
import { AssociacaoEsteiras } from '../components/segmentation/AssociacaoEsteiras';
import { ScriptsCobranca } from '../components/segmentation/ScriptsCobranca';
import { DistribuicaoCarteiras } from '../components/segmentation/DistribuicaoCarteiras';
import { DisparosWhatsApp } from '../components/communication/DisparosWhatsApp';
import { DisparosVoz } from '../components/communication/DisparosVoz';
import { MonitorDisparos } from '../components/communication/MonitorDisparos';
import { HistoricoInteracoes } from '../components/communication/HistoricoInteracoes';
import { EmissaoPagamento } from '../components/payments/EmissaoPagamento';
import { PainelConciliacao } from '../components/payments/PainelConciliacao';

type UserProfile = 'Diretor' | 'Gerente' | 'Operador' | 'Cliente';

export function MainLayout() {
  const { user, hasDataAccess, accessStatus } = useAuth();
  const [activeScreen, setActiveScreen] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Determina o perfil baseado no role do usuário logado
  const getUserProfile = (): UserProfile => {
    if (!user) return 'Operador';
    switch (user.role) {
      case 'diretor': return 'Diretor';
      case 'gerente': return 'Gerente';
      case 'operador': return 'Operador';
      default: return 'Operador';
    }
  };
  
  const userProfile = getUserProfile();

  const renderContent = () => {
    // Se usuário não tem acesso a dados (não está atribuído a tenant e não é diretor)
    if (!hasDataAccess) {
      return (
        <NoAccessMessage 
          userName={user?.email} 
          message={accessStatus?.message || undefined}
        />
      );
    }

    switch (activeScreen) {
      case 'dashboard':
        return <Dashboard />;
      case 'dashboard-diretor':
        return <DashboardDiretor />;
      case 'dashboard-gerente':
        return <DashboardGerente />;
      case 'dashboard-operador':
        return <DashboardOperador />;
      case 'dashboard-cliente':
        return <DashboardCliente />;
      case 'dashboard-inadimplencia':
        return <DashboardInadimplencia />;
      
      // Gestão de Base
      case 'upload-base':
        return <UploadBase />;
      case 'validacao-automatica':
        return <ValidacaoAutomatica />;
      case 'logs-importacao':
        return <LogsImportacao />;
      case 'visualizacao-base':
        return <VisualizacaoBase />;
      
      // Segmentação & Esteiras
      case 'configuracao-segmentos':
        return <ConfiguracaoSegmentos />;
      case 'associacao-esteiras':
        return <AssociacaoEsteiras />;
      case 'scripts-cobranca':
        return <ScriptsCobranca />;
      case 'distribuicao-carteiras':
        return <DistribuicaoCarteiras />;
      
      // Comunicação
      case 'disparos-whatsapp':
        return <DisparosWhatsApp />;
      case 'disparos-voz':
        return <DisparosVoz />;
      case 'monitor-disparos':
        return <MonitorDisparos />;
      case 'historico-interacoes':
        return <HistoricoInteracoes />;
      
      // Pagamentos
      case 'emissao-pagamento':
        return <EmissaoPagamento />;
      case 'painel-conciliacao':
        return <PainelConciliacao />;
      
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-background transition-colors duration-200">
      <Sidebar 
        activeScreen={activeScreen} 
        onNavigate={setActiveScreen}
        userProfile={userProfile}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex flex-col flex-1 min-w-0">
        <Header 
          userProfile={userProfile}
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          userName={user?.email || 'Carregando...'}
        />
        <main className="flex-1 overflow-auto bg-background transition-colors duration-200">
          <div className="animate-fade-in">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}