/**
 * TenantSelector Component
 * Seletor de tenant para diretores visualizarem dados de diferentes empresas
 */
import { useState } from 'react';
import { Building2, ChevronDown, Check } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { useTenants, TenantOverview } from '../../hooks/useDashboard';
import { useAuth } from '../../contexts/AuthContext';

interface TenantSelectorProps {
  selectedTenantId?: number;
  onTenantChange: (tenantId?: number) => void;
  showConsolidated?: boolean;
}

export function TenantSelector({ 
  selectedTenantId, 
  onTenantChange,
  showConsolidated = true 
}: TenantSelectorProps) {
  const { isDirector } = useAuth();
  const { tenants, isLoading, error } = useTenants();
  const [isOpen, setIsOpen] = useState(false);

  // Só mostra o seletor para diretores
  if (!isDirector) {
    return null;
  }

  const selectedTenant = tenants.find(t => t.id === selectedTenantId);
  const displayName = selectedTenantId 
    ? selectedTenant?.nome || 'Selecionando...'
    : 'Todos os Tenants (Consolidado)';

  if (error) {
    // Se deu 403, provavelmente não é diretor - não mostra o seletor
    return null;
  }

  if (isLoading) {
    return (
      <div className="w-64 h-10 bg-[var(--bg-secondary)] animate-pulse rounded-md" />
    );
  }

  if (tenants.length === 0) {
    return null;
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      notation: 'compact',
    }).format(value);
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        className="w-64 justify-between text-left font-normal"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="flex items-center gap-2 truncate">
          <Building2 className="w-4 h-4 text-[var(--text-secondary)]" />
          <span className="truncate">{displayName}</span>
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)} 
          />
          
          {/* Dropdown */}
          <Card className="absolute top-full left-0 mt-2 w-80 z-20 shadow-lg border border-[var(--border-primary)] bg-[var(--bg-card)]">
            <div className="p-2 max-h-80 overflow-auto">
              {/* Opção Consolidada */}
              {showConsolidated && (
                <button
                  className={`w-full text-left p-3 rounded-md hover:bg-[var(--bg-secondary)] transition-colors ${
                    !selectedTenantId ? 'bg-[var(--bg-secondary)]' : ''
                  }`}
                  onClick={() => {
                    onTenantChange(undefined);
                    setIsOpen(false);
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-[var(--text-primary)]">
                      Todos os Tenants
                    </span>
                    {!selectedTenantId && <Check className="w-4 h-4 text-[var(--brand-primary)]" />}
                  </div>
                  <p className="text-sm text-[var(--text-secondary)] mt-1">
                    Visão consolidada de todos os tenants
                  </p>
                </button>
              )}

              {/* Separador */}
              {showConsolidated && tenants.length > 0 && (
                <div className="border-t border-[var(--border-primary)] my-2" />
              )}

              {/* Lista de Tenants */}
              {tenants.map((tenant: TenantOverview) => (
                <button
                  key={tenant.id}
                  className={`w-full text-left p-3 rounded-md hover:bg-[var(--bg-secondary)] transition-colors ${
                    selectedTenantId === tenant.id ? 'bg-[var(--bg-secondary)]' : ''
                  }`}
                  onClick={() => {
                    onTenantChange(tenant.id);
                    setIsOpen(false);
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-[var(--text-primary)]">
                      {tenant.nome}
                    </span>
                    {selectedTenantId === tenant.id && (
                      <Check className="w-4 h-4 text-[var(--brand-primary)]" />
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-[var(--text-secondary)] mt-1">
                    <span>{tenant.total_contratos} contratos</span>
                    <span>{formatCurrency(tenant.valor_total)}</span>
                  </div>
                </button>
              ))}
            </div>
          </Card>
        </>
      )}
    </div>
  );
}

export default TenantSelector;
