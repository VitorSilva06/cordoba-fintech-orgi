/**
 * Upload Hook
 * Mock version - no API connection
 */
import { useState, useCallback } from 'react';

// Types
export interface UploadPreviewRow {
  cpf: string;
  nome: string;
  telefone: string;
  email: string;
  valor: string;
  dataVencimento: string;
  valido: boolean;
  erro?: string | null;
}

export interface UploadResult {
  importacao_id: number;
  preview: UploadPreviewRow[];
  stats?: {
    total: number;
    valid: number;
    invalid: number;
  };
}

export interface ImportListItem {
  id: number;
  filename: string;
  status: string;
  total_linhas: number;
  linhas_sucesso: number;
  linhas_erro: number;
  created_at: string;
}

// Mock data generator
function generateMockPreview(_filename: string): UploadPreviewRow[] {
  const mockRows: UploadPreviewRow[] = [
    { cpf: '123.456.789-00', nome: 'João Silva', telefone: '11999998888', email: 'joao@email.com', valor: '1500.00', dataVencimento: '2024-01-15', valido: true },
    { cpf: '987.654.321-00', nome: 'Maria Santos', telefone: '11888887777', email: 'maria@email.com', valor: '2300.50', dataVencimento: '2024-02-20', valido: true },
    { cpf: '456.789.123-00', nome: 'Carlos Oliveira', telefone: '11777776666', email: 'carlos@email.com', valor: '890.00', dataVencimento: '2024-03-10', valido: true },
    { cpf: '321.654.987-00', nome: 'Ana Pereira', telefone: '11666665555', email: 'ana@email.com', valor: '3200.75', dataVencimento: '2024-01-25', valido: true },
    { cpf: '111.222.333-44', nome: 'Pedro Costa', telefone: '', email: 'pedro@email.com', valor: '750.00', dataVencimento: '2024-04-05', valido: false, erro: 'Telefone inválido' },
  ];
  return mockRows;
}

const MOCK_IMPORTS: ImportListItem[] = [
  { id: 1, filename: 'base_janeiro_2024.csv', status: 'concluido', total_linhas: 150, linhas_sucesso: 148, linhas_erro: 2, created_at: '2024-01-10T14:30:00Z' },
  { id: 2, filename: 'clientes_fevereiro.xlsx', status: 'concluido', total_linhas: 230, linhas_sucesso: 225, linhas_erro: 5, created_at: '2024-02-15T09:15:00Z' },
  { id: 3, filename: 'cobranca_marco.csv', status: 'processando', total_linhas: 180, linhas_sucesso: 90, linhas_erro: 0, created_at: '2024-03-20T16:45:00Z' },
];

interface UseUploadReturn {
  upload: (file: File) => Promise<UploadResult>;
  getImports: () => Promise<ImportListItem[]>;
  isUploading: boolean;
  progress: number;
  error: string | null;
  clearError: () => void;
}

export function useUpload(): UseUploadReturn {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const upload = useCallback(async (file: File): Promise<UploadResult> => {
    setIsUploading(true);
    setProgress(0);
    setError(null);

    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 100));
      setProgress(i);
    }

    const preview = generateMockPreview(file.name);
    const result: UploadResult = {
      importacao_id: Date.now(),
      preview,
      stats: {
        total: preview.length,
        valid: preview.filter(r => r.valido).length,
        invalid: preview.filter(r => !r.valido).length,
      },
    };

    setIsUploading(false);
    return result;
  }, []);

  const getImports = useCallback(async (): Promise<ImportListItem[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return MOCK_IMPORTS;
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    upload,
    getImports,
    isUploading,
    progress,
    error,
    clearError,
  };
}

export default useUpload;
