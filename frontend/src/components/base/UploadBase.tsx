import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Alert, AlertDescription } from "../ui/alert";
import {
  Upload,
  FileSpreadsheet,
  CheckCircle,
  AlertCircle,
  Download,
  X,
  Trash2,
} from "lucide-react";
import { Progress } from "../ui/progress";
import { useUpload, UploadPreviewRow } from "@/hooks/useUpload";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

// INTERFACE - use the type from the hook
type PreviewData = UploadPreviewRow;

// HELPERS ==============================

const validateEmail = (email: string) => email.includes("@");

const cleanFileName = (name: string) =>
  name.length > 40 ? name.slice(0, 37) + "..." : name;

const fileSize = (size: number) =>
  (size / 1024).toFixed(1) + " KB";

// =====================================

export function UploadBase() {
  const { upload, isUploading, progress: uploadProgress } = useUpload();
  const [file, setFile] = useState<File | null>(null);
  const [finished, setFinished] = useState(false);
  const [preview, setPreview] = useState<PreviewData[]>([]);
  const [stats, setStats] = useState<{
    total: number;
    valid: number;
    invalid: number;
  } | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const resetAll = () => {
    setFile(null);
    setFinished(false);
    setPreview([]);
    setStats(null);
  };

  // FILE SELECTION
  const handleFile = (f: File) => {
    resetAll();
    setFile(f);
  };

  const startUpload = async () => {
    if (!file) return;
    setFinished(false);

    try {
      const result = await upload(file);
      setPreview(result.preview);
      setStats(result.stats || { 
        total: result.preview.length, 
        valid: result.preview.filter(x => x.valido).length, 
        invalid: result.preview.filter(x => !x.valido).length 
      });
      setFinished(true);
    } catch (err) {
      console.error("Upload error:", err);
      setFinished(true);
    }
  };

  // TEMPLATE
  const downloadTemplate = () => {
    const csv = [
      [
        "CPF",
        "Nome",
        "Email",
        "Telefone",
        "Valor",
        "DataVencimento",
        "Numero",
        "CobrancaMeio",
        "CobrancaStatus",
        "PagamentoValor",
        "PagamentoData",
      ].join(","),
      // Exemplo de linha
      [
        "12345678901",
        "Cliente Exemplo",
        "cliente@exemplo.com",
        "5599999999999",
        "1500.75",
        "10/01/2025",
        "CT-0001",
        "pix",
        "Pendente",
        "",
        "",
      ].join(","),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "template_base.csv";
    a.click();

    URL.revokeObjectURL(url);
  };

  // UI ============================================================

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Upload de Base</h1>
          <p className="page-description">
            Envie sua planilha para validar e importar
          </p>
        </div>
        <Button variant="outline" onClick={resetAll}>
          <Trash2 className="w-4 h-4" />
          Limpar Tudo
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle>Carregar Arquivo</CardTitle>
          <Button variant="outline" onClick={downloadTemplate}>
            <Download className="w-4 h-4" />
            Baixar Template
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* DRAG AREA */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const f = e.dataTransfer.files[0];
              if (f) handleFile(f);
            }}
            className="p-8 border-2 border-dashed border-border rounded-xl text-center cursor-pointer hover:border-primary/50 hover:bg-secondary/30 transition-all duration-200"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <Upload className="w-8 h-8 text-primary" />
            </div>
            <p className="text-foreground font-medium mb-2">
              Arraste o arquivo aqui ou
            </p>
            <Button
              variant="outline"
              onClick={() => inputRef.current?.click()}
            >
              Selecionar Arquivo
            </Button>
            <p className="text-text-muted text-sm mt-3">
              Formatos aceitos: CSV, XLSX
            </p>

            <input
              ref={inputRef}
              type="file"
              accept=".csv,.xlsx"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFile(e.target.files[0]);
                }
              }}
            />
          </div>

          {/* FILE CARD */}
          {file && (
            <Card className="border-primary/30 animate-fade-in">
              <CardContent className="p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
                      <FileSpreadsheet className="w-6 h-6 text-success" />
                    </div>
                    <div>
                      <p className="text-foreground font-medium">
                        {cleanFileName(file.name)}
                      </p>
                      <p className="text-text-secondary text-sm">
                        {fileSize(file.size)}
                      </p>
                    </div>
                  </div>

                  {!isUploading && !finished && (
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => setFile(null)}
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  )}
                </div>

                {/* PROGRESS */}
                {isUploading && (
                  <div>
                    <Progress value={uploadProgress} className="h-2" />
                    <p className="text-text-secondary text-sm mt-2">
                      Processando... {uploadProgress}%
                    </p>
                  </div>
                )}

                {/* BUTTONS */}
                {!isUploading && !finished && (
                  <div className="flex gap-3">
                    <Button className="flex-1" onClick={startUpload}>
                      <Upload className="w-4 h-4" />
                      Fazer Upload
                    </Button>
                    <Button variant="outline" onClick={() => setFile(null)}>
                      Cancelar
                    </Button>
                  </div>
                )}

                {/* SUCCESS */}
                {finished && (
                  <Alert variant="success">
                    <AlertDescription className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Upload concluído com sucesso!
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          )}

          {/* PREVIEW */}
          {finished && stats && (
            <div className="space-y-6 animate-fade-in">
              {/* STATS */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="stats-card">
                  <p className="stats-label">Total de Registros</p>
                  <p className="stats-value">{stats.total}</p>
                </Card>
                <Card className="stats-card">
                  <p className="stats-label">Válidos</p>
                  <p className="stats-value text-success">{stats.valid}</p>
                </Card>
                <Card className="stats-card">
                  <p className="stats-label">Inválidos</p>
                  <p className="stats-value text-warning">{stats.invalid}</p>
                </Card>
              </div>

              {/* TABLE */}
              <Card>
                <CardHeader>
                  <CardTitle>Preview dos Dados</CardTitle>
                </CardHeader>

                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>CPF</TableHead>
                        <TableHead>Nome</TableHead>
                        <TableHead>Telefone</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead>Vencimento</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {preview.map((row, i) => (
                        <TableRow key={i}>
                          <TableCell className="font-mono text-sm">
                            {row.cpf}
                          </TableCell>
                          <TableCell>{row.nome}</TableCell>
                          <TableCell>{row.telefone}</TableCell>
                          <TableCell className={!validateEmail(row.email) ? "text-warning" : ""}>
                            {row.email}
                          </TableCell>
                          <TableCell>{row.valor}</TableCell>
                          <TableCell>{row.dataVencimento}</TableCell>
                          <TableCell>
                            {row.valido ? (
                              <span className="badge-success">
                                <CheckCircle className="w-3 h-3" />
                                Válido
                              </span>
                            ) : (
                              <span className="badge-warning">
                                <AlertCircle className="w-3 h-3" />
                                Inválido
                              </span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {/* ERROR MESSAGE */}
                  {stats.invalid > 0 && (
                    <Alert variant="warning" className="mt-4">
                      <AlertDescription>
                        {stats.invalid} registro(s) inválido(s) foram encontrados e serão ignorados na importação.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}