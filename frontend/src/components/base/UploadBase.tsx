/**
 * UploadBase - Gestão de Base de Devedores
 * Upload de arquivos Excel/CSV com preview, validação e importação
 */
import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Button } from "../ui/button";
import { Alert, AlertDescription } from "../ui/alert";
import { Badge } from "../ui/badge";
import {
  Upload,
  FileSpreadsheet,
  CheckCircle,
  AlertCircle,
  Download,
  X,
  RefreshCcw,
  Eye,
  FileText,
  AlertTriangle,
  ArrowRight,
  Info,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { TenantSelector } from "../dashboards/TenantSelector";
import api from "@/services/api";

// ==========================================
// INTERFACES
// ==========================================
interface CampoEstrutura {
  nome: string;
  descricao: string;
  tipo: string;
  exemplo: string;
  alternativas: string[];
}

interface EstruturaCampos {
  obrigatorios: CampoEstrutura[];
  opcionais: CampoEstrutura[];
}

interface LinhaPreview {
  linha: number;
  cpf: string | null;
  nome: string | null;
  valor: number | null;
  vencimento: string | null;
  status_validacao: 'valido' | 'erro' | 'duplicado' | 'atualizar' | 'novo';
  acao: string;
  erros: string[];
  dados_existentes: Record<string, string> | null;
}

interface PreviewUpload {
  arquivo: string;
  total_linhas: number;
  linhas_validas: number;
  linhas_invalidas: number;
  novos_clientes: number;
  atualizacoes: number;
  duplicados: number;
  preview: LinhaPreview[];
  colunas_encontradas: string[];
  colunas_mapeadas: Record<string, string>;
}

interface ResultadoImportacao {
  id_importacao: string;
  arquivo: string;
  tipo_importacao: string;
  status: string;
  total_linhas: number;
  clientes_criados: number;
  clientes_atualizados: number;
  contratos_criados: number;
  contratos_atualizados: number;
  total_erros: number;
  erros: string[];
}

// ==========================================
// COMPONENTE PRINCIPAL
// ==========================================
export function UploadBase() {
  const [selectedTenantId, setSelectedTenantId] = useState<number | undefined>();
  const [estrutura, setEstrutura] = useState<EstruturaCampos | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<PreviewUpload | null>(null);
  const [resultado, setResultado] = useState<ResultadoImportacao | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'upload' | 'preview' | 'resultado'>('upload');
  const [sobrescrever, setSobrescrever] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  // Carrega estrutura de campos
  useEffect(() => {
    const loadEstrutura = async () => {
      try {
        const response = await api.get('/base/campos');
        setEstrutura(response.data);
      } catch (err) {
        console.error('Erro ao carregar estrutura:', err);
      }
    };
    loadEstrutura();
  }, []);

  const handleTenantChange = (tenantId?: number) => {
    setSelectedTenantId(tenantId);
  };

  // Reset completo
  const resetAll = () => {
    setFile(null);
    setPreview(null);
    setResultado(null);
    setError(null);
    setStep('upload');
    setSobrescrever(false);
  };

  // Handlers de drag & drop
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  }, []);

  const handleFileSelect = (selectedFile: File) => {
    const ext = selectedFile.name.split('.').pop()?.toLowerCase();
    if (!['csv', 'xlsx', 'xls'].includes(ext || '')) {
      setError('Formato inválido. Use CSV ou Excel (.csv, .xlsx, .xls)');
      return;
    }
    setFile(selectedFile);
    setError(null);
    setPreview(null);
    setResultado(null);
  };

  // Upload e Preview
  const handlePreview = async () => {
    if (!file) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const params = new URLSearchParams();
      params.append('tipo', 'incremental');
      if (selectedTenantId) {
        params.append('tenant_id', selectedTenantId.toString());
      }
      
      const response = await api.post(`/base/upload/preview?${params.toString()}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setPreview(response.data);
      setStep('preview');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Erro ao processar arquivo');
    } finally {
      setIsLoading(false);
    }
  };

  // Confirmar Importação
  const handleConfirmarImportacao = async () => {
    if (!preview) return;
    
    setIsImporting(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('file', file!);
      
      const params = new URLSearchParams();
      params.append('tipo', 'incremental');
      params.append('sobrescrever', sobrescrever.toString());
      if (selectedTenantId) {
        params.append('tenant_id', selectedTenantId.toString());
      }
      
      const response = await api.post(`/base/upload/excel?${params.toString()}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setResultado(response.data);
      setStep('resultado');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Erro durante importação');
    } finally {
      setIsImporting(false);
    }
  };

  // Download template
  const handleDownloadTemplate = async (formato: 'xlsx' | 'csv') => {
    try {
      const response = await api.get(`/base/template?formato=${formato}`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `template_importacao.${formato}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Erro ao baixar template:', err);
    }
  };

  // Formatadores
  const formatCurrency = (value: number | null) => {
    if (value === null) return '-';
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const formatDate = (date: string | null) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('pt-BR');
  };

  // ==========================================
  // RENDER - STEP UPLOAD
  // ==========================================
  const renderUploadStep = () => (
    <>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-[var(--text-primary)] text-3xl">Upload de Base</h1>
          <p className="text-[var(--text-secondary)] mt-1">
            Importe sua base de devedores via Excel ou CSV
          </p>
        </div>
        <div className="flex items-center gap-3">
          <TenantSelector selectedTenantId={selectedTenantId} onTenantChange={handleTenantChange} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Área de Upload */}
        <Card className="bg-[var(--bg-card)] border-[var(--border-primary)]">
          <CardHeader>
            <CardTitle className="text-[var(--text-primary)] flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Upload de Arquivo
            </CardTitle>
            <CardDescription className="text-[var(--text-secondary)]">
              Arraste um arquivo ou clique para selecionar
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Drop Zone */}
            <div
              ref={dropRef}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
              className={`
                border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
                transition-colors duration-200
                ${file ? 'border-[var(--brand-success)] bg-[var(--brand-success)]/5' : 'border-[var(--border-primary)] hover:border-[var(--brand-primary)]'}
              `}
            >
              <input
                ref={inputRef}
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                className="hidden"
              />
              
              {file ? (
                <div className="space-y-3">
                  <FileSpreadsheet className="w-12 h-12 mx-auto text-[var(--brand-success)]" />
                  <div>
                    <p className="text-[var(--text-primary)] font-medium">{file.name}</p>
                    <p className="text-[var(--text-secondary)] text-sm">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => { e.stopPropagation(); setFile(null); }}
                  >
                    <X className="w-4 h-4 mr-1" /> Remover
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Upload className="w-12 h-12 mx-auto text-[var(--text-muted)]" />
                  <div>
                    <p className="text-[var(--text-primary)]">Arraste seu arquivo aqui</p>
                    <p className="text-[var(--text-secondary)] text-sm">ou clique para selecionar</p>
                  </div>
                  <p className="text-[var(--text-muted)] text-xs">
                    Formatos aceitos: Excel (.xlsx, .xls) ou CSV (.csv)
                  </p>
                </div>
              )}
            </div>

            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Botões de Ação */}
            <div className="flex gap-3 mt-6">
              <Button
                onClick={handlePreview}
                disabled={!file || isLoading}
                className="flex-1"
              >
                {isLoading ? (
                  <>
                    <RefreshCcw className="w-4 h-4 mr-2 animate-spin" />
                    Analisando...
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4 mr-2" />
                    Analisar Arquivo
                  </>
                )}
              </Button>
            </div>

            {/* Download Templates */}
            <div className="mt-6 pt-6 border-t border-[var(--border-primary)]">
              <p className="text-[var(--text-secondary)] text-sm mb-3">
                Baixe um template de exemplo:
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleDownloadTemplate('xlsx')}>
                  <Download className="w-4 h-4 mr-1" /> Excel
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDownloadTemplate('csv')}>
                  <Download className="w-4 h-4 mr-1" /> CSV
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Campos Esperados */}
        <Card className="bg-[var(--bg-card)] border-[var(--border-primary)]">
          <CardHeader>
            <CardTitle className="text-[var(--text-primary)] flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Campos Esperados
            </CardTitle>
            <CardDescription className="text-[var(--text-secondary)]">
              Estrutura de colunas para importação
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Campos Obrigatórios */}
            <div>
              <h4 className="text-[var(--text-primary)] font-semibold mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[var(--brand-error)]" />
                Campos Obrigatórios
              </h4>
              <div className="space-y-3">
                {estrutura?.obrigatorios.map((campo) => (
                  <div key={campo.nome} className="p-3 bg-[var(--bg-secondary)] rounded-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-[var(--text-primary)] font-medium">{campo.nome}</p>
                        <p className="text-[var(--text-secondary)] text-sm">{campo.descricao}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {campo.tipo}
                      </Badge>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      <span className="text-[var(--text-muted)] text-xs">Exemplo:</span>
                      <code className="text-xs bg-[var(--bg-primary)] px-2 py-0.5 rounded">
                        {campo.exemplo}
                      </code>
                    </div>
                    <div className="mt-1 flex flex-wrap gap-1">
                      <span className="text-[var(--text-muted)] text-xs">Alternativas:</span>
                      {campo.alternativas.slice(0, 3).map((alt) => (
                        <code key={alt} className="text-xs bg-[var(--bg-primary)] px-1 py-0.5 rounded">
                          {alt}
                        </code>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Campos Opcionais (colapsável) */}
            <details className="group">
              <summary className="text-[var(--text-primary)] font-semibold cursor-pointer flex items-center gap-2">
                <Info className="w-4 h-4 text-[var(--brand-info)]" />
                Campos Opcionais ({estrutura?.opcionais.length || 0})
              </summary>
              <div className="mt-3 space-y-2">
                {estrutura?.opcionais.map((campo) => (
                  <div key={campo.nome} className="p-2 bg-[var(--bg-secondary)] rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-[var(--text-primary)] text-sm">{campo.nome}</span>
                      <code className="text-xs bg-[var(--bg-primary)] px-2 py-0.5 rounded">
                        {campo.exemplo}
                      </code>
                    </div>
                  </div>
                ))}
              </div>
            </details>
          </CardContent>
        </Card>
      </div>
    </>
  );

  // ==========================================
  // RENDER - STEP PREVIEW
  // ==========================================
  const renderPreviewStep = () => (
    <>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-[var(--text-primary)] text-3xl">Preview da Importação</h1>
          <p className="text-[var(--text-secondary)] mt-1">
            Arquivo: <span className="font-medium">{preview?.arquivo}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={resetAll}>
            <X className="w-4 h-4 mr-2" /> Cancelar
          </Button>
        </div>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <Card className="bg-[var(--bg-card)] border-[var(--border-primary)]">
          <CardContent className="p-4 text-center">
            <p className="text-[var(--text-secondary)] text-sm">Total Linhas</p>
            <p className="text-[var(--text-primary)] text-2xl font-bold">{preview?.total_linhas}</p>
          </CardContent>
        </Card>
        <Card className="bg-[var(--bg-card)] border-[var(--border-primary)]">
          <CardContent className="p-4 text-center">
            <p className="text-[var(--text-secondary)] text-sm">Novos Clientes</p>
            <p className="text-[var(--brand-success)] text-2xl font-bold">{preview?.novos_clientes}</p>
          </CardContent>
        </Card>
        <Card className="bg-[var(--bg-card)] border-[var(--border-primary)]">
          <CardContent className="p-4 text-center">
            <p className="text-[var(--text-secondary)] text-sm">Atualizações</p>
            <p className="text-[var(--brand-warning)] text-2xl font-bold">{preview?.atualizacoes}</p>
          </CardContent>
        </Card>
        <Card className="bg-[var(--bg-card)] border-[var(--border-primary)]">
          <CardContent className="p-4 text-center">
            <p className="text-[var(--text-secondary)] text-sm">Duplicados</p>
            <p className="text-[var(--text-muted)] text-2xl font-bold">{preview?.duplicados}</p>
          </CardContent>
        </Card>
        <Card className="bg-[var(--bg-card)] border-[var(--border-primary)]">
          <CardContent className="p-4 text-center">
            <p className="text-[var(--text-secondary)] text-sm">Inválidos</p>
            <p className="text-[var(--brand-error)] text-2xl font-bold">{preview?.linhas_invalidas}</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Preview */}
      <Card className="bg-[var(--bg-card)] border-[var(--border-primary)] mb-6">
        <CardHeader>
          <CardTitle className="text-[var(--text-primary)]">
            Preview dos Dados (primeiras 100 linhas)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Linha</TableHead>
                  <TableHead>CPF</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Vencimento</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {preview?.preview.map((linha) => (
                  <TableRow key={linha.linha}>
                    <TableCell className="text-[var(--text-secondary)]">{linha.linha}</TableCell>
                    <TableCell className="text-[var(--text-primary)]">{linha.cpf || '-'}</TableCell>
                    <TableCell className="text-[var(--text-primary)]">{linha.nome || '-'}</TableCell>
                    <TableCell className="text-[var(--text-primary)]">{formatCurrency(linha.valor)}</TableCell>
                    <TableCell className="text-[var(--text-primary)]">{formatDate(linha.vencimento)}</TableCell>
                    <TableCell>
                      <Badge className={
                        linha.status_validacao === 'novo' ? 'bg-[var(--brand-success)]' :
                        linha.status_validacao === 'atualizar' ? 'bg-[var(--brand-warning)]' :
                        linha.status_validacao === 'erro' ? 'bg-[var(--brand-error)]' :
                        'bg-[var(--text-muted)]'
                      }>
                        {linha.status_validacao}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-[var(--text-secondary)]">
                      {linha.erros.length > 0 ? (
                        <span className="text-[var(--brand-error)] text-xs">{linha.erros[0]}</span>
                      ) : (
                        linha.acao
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Opções e Confirmar */}
      <Card className="bg-[var(--bg-card)] border-[var(--border-primary)]">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="sobrescrever"
                checked={sobrescrever}
                onChange={(e) => setSobrescrever(e.target.checked)}
                className="w-4 h-4"
              />
              <label htmlFor="sobrescrever" className="text-[var(--text-secondary)]">
                Sobrescrever dados existentes (atualizar clientes/contratos)
              </label>
            </div>
            
            <div className="flex gap-3">
              <Button variant="outline" onClick={resetAll}>
                Cancelar
              </Button>
              <Button
                onClick={handleConfirmarImportacao}
                disabled={isImporting || (preview?.linhas_validas || 0) === 0}
              >
                {isImporting ? (
                  <>
                    <RefreshCcw className="w-4 h-4 mr-2 animate-spin" />
                    Importando...
                  </>
                ) : (
                  <>
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Confirmar Importação ({preview?.linhas_validas} registros)
                  </>
                )}
              </Button>
            </div>
          </div>
          
          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </>
  );

  // ==========================================
  // RENDER - STEP RESULTADO
  // ==========================================
  const renderResultadoStep = () => (
    <>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-[var(--text-primary)] text-3xl">Importação Concluída</h1>
          <p className="text-[var(--text-secondary)] mt-1">
            {resultado?.status === 'concluido' ? 'Dados importados com sucesso!' : 'Erro durante a importação'}
          </p>
        </div>
      </div>

      {/* Resultado */}
      <Card className="bg-[var(--bg-card)] border-[var(--border-primary)] mb-6">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            {resultado?.status === 'concluido' ? (
              <CheckCircle className="w-20 h-20 mx-auto text-[var(--brand-success)] mb-4" />
            ) : (
              <AlertCircle className="w-20 h-20 mx-auto text-[var(--brand-error)] mb-4" />
            )}
            <h2 className="text-[var(--text-primary)] text-2xl mb-2">
              {resultado?.status === 'concluido' ? 'Importação Finalizada!' : 'Erro na Importação'}
            </h2>
            <p className="text-[var(--text-secondary)]">
              ID: {resultado?.id_importacao}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="text-center p-4 bg-[var(--bg-secondary)] rounded-lg">
              <p className="text-[var(--text-secondary)] text-sm">Clientes Criados</p>
              <p className="text-[var(--brand-success)] text-3xl font-bold">{resultado?.clientes_criados}</p>
            </div>
            <div className="text-center p-4 bg-[var(--bg-secondary)] rounded-lg">
              <p className="text-[var(--text-secondary)] text-sm">Clientes Atualizados</p>
              <p className="text-[var(--brand-warning)] text-3xl font-bold">{resultado?.clientes_atualizados}</p>
            </div>
            <div className="text-center p-4 bg-[var(--bg-secondary)] rounded-lg">
              <p className="text-[var(--text-secondary)] text-sm">Contratos Criados</p>
              <p className="text-[var(--brand-info)] text-3xl font-bold">{resultado?.contratos_criados}</p>
            </div>
            <div className="text-center p-4 bg-[var(--bg-secondary)] rounded-lg">
              <p className="text-[var(--text-secondary)] text-sm">Erros</p>
              <p className="text-[var(--brand-error)] text-3xl font-bold">{resultado?.total_erros}</p>
            </div>
          </div>

          {/* Erros */}
          {resultado?.erros && resultado.erros.length > 0 && (
            <div className="mb-6">
              <h4 className="text-[var(--text-primary)] font-semibold mb-3">Erros Encontrados:</h4>
              <div className="max-h-40 overflow-y-auto bg-[var(--bg-secondary)] rounded-lg p-3">
                {resultado.erros.map((erro, i) => (
                  <p key={i} className="text-[var(--brand-error)] text-sm py-1">{erro}</p>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-center gap-3">
            <Button variant="outline" onClick={resetAll}>
              <Upload className="w-4 h-4 mr-2" />
              Nova Importação
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );

  // ==========================================
  // RENDER PRINCIPAL
  // ==========================================
  return (
    <div className="p-6 space-y-6 bg-[var(--bg-primary)] min-h-screen">
      {step === 'upload' && renderUploadStep()}
      {step === 'preview' && renderPreviewStep()}
      {step === 'resultado' && renderResultadoStep()}
    </div>
  );
}