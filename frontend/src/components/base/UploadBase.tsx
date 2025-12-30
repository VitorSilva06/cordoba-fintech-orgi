import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import {
  Upload,
  FileSpreadsheet,
  CheckCircle,
  AlertCircle,
  Download,
  X,
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

// validateRow helper removed (unused)

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
    <div className="space-y-6 p-4 md:p-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[--color-neon-blue]">
          Upload de Base
        </h1>

        <Button
          variant="outline"
          onClick={resetAll}
          className="text-[--color-accent-yellow] border-[--color-accent-yellow]"
        >
          Limpar Tudo
        </Button>
      </div>

      <p className="text-[--color-neon-blue]/70">
        Envie sua planilha para validar e importar.
      </p>

      <Card className="bg-[--color-card-bg] border-[--color-neon-blue]/20">
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle className="text-[--color-accent-yellow]">
            Carregar Arquivo
          </CardTitle>

          <Button
            variant="outline"
            onClick={downloadTemplate}
            className="text-[--color-neon-blue] border-[--color-neon-blue]/30"
          >
            <Download className="w-4 h-4 mr-2" /> Template
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
            className="p-8 border-2 border-dashed border-[--color-neon-blue]/40 rounded-lg text-center cursor-pointer hover:border-[--color-neon-blue]"
          >
            <Upload className="w-10 h-10 mx-auto mb-3 text-[--color-neon-blue]" />
            <p className="text-[--color-neon-blue]">Arraste o arquivo aqui ou</p>
            <Button
              variant="outline"
              className="mt-2 border-[--color-accent-yellow] text-[--color-accent-yellow]"
              onClick={() => inputRef.current?.click()}
            >
              Selecionar Arquivo
            </Button>

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
            <Card className="bg-[--color-primary-dark] border-[--color-accent-yellow]/30 animate-fade-in">
              <CardContent className="pt-6 space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <FileSpreadsheet className="w-8 h-8 text-[--color-accent-yellow]" />

                    <div>
                      <p className="text-[--color-neon-blue]">
                        {cleanFileName(file.name)}
                      </p>
                      <p className="text-[--color-neon-blue]/60 text-sm">
                        {fileSize(file.size)}
                      </p>
                    </div>
                  </div>

                  {!isUploading && !finished && (
                    <X
                      onClick={() => setFile(null)}
                      className="w-6 h-6 cursor-pointer text-[--color-neon-blue]/60 hover:text-[--color-neon-blue]"
                    />
                  )}
                </div>

                {/* PROGRESS */}
                {isUploading && (
                  <div>
                    <Progress
                      value={uploadProgress}
                      className="h-2 bg-[--color-neon-blue]/20"
                    />
                    <p className="text-[--color-neon-blue]/80 text-sm mt-2">
                      {uploadProgress}%
                    </p>
                  </div>
                )}

                {/* BUTTONS */}
                {!isUploading && !finished && (
                  <div className="flex gap-3">
                    <Button
                      className="bg-[--color-accent-yellow] text-[--color-dark-text] font-bold flex-1"
                      onClick={startUpload}
                    >
                      Fazer Upload
                    </Button>
                    <Button
                      variant="outline"
                      className="text-[--color-neon-blue] border-[--color-neon-blue]/40"
                      onClick={() => setFile(null)}
                    >
                      Cancelar
                    </Button>
                  </div>
                )}

                {/* SUCCESS */}
                {finished && (
                  <div className="p-3 border border-[--color-neon-blue]/40 rounded-lg bg-[--color-card-bg] flex gap-3">
                    <CheckCircle className="text-[--color-neon-blue] w-6 h-6" />
                    <p className="text-[--color-neon-blue]">
                      Upload concluído com sucesso!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* PREVIEW */}
          {finished && stats && (
            <div className="space-y-6 animate-fade-in">
              {/* STATS */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Total", value: stats.total },
                  { label: "Válidos", value: stats.valid },
                  {
                    label: "Inválidos",
                    value: stats.invalid,
                    color: "--color-accent-yellow",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="p-4 bg-[--color-card-bg] border border-[--color-neon-blue]/20 rounded-lg text-center"
                  >
                    <p className="text-[--color-neon-blue]/60 text-sm">
                      {item.label}
                    </p>
                    <p
                      className="text-2xl font-bold"
                      style={{
                        color: `var(${item.color ?? "--color-neon-blue"})`,
                      }}
                    >
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* TABLE */}
              <Card className="bg-[--color-card-bg] border-[--color-neon-blue]/20">
                <CardHeader>
                  <CardTitle className="text-[--color-accent-yellow]">
                    Preview dos Dados
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-[--color-accent-yellow]">
                          CPF
                        </TableHead>
                        <TableHead className="text-[--color-accent-yellow]">
                          Nome
                        </TableHead>
                        <TableHead className="text-[--color-accent-yellow]">
                          Telefone
                        </TableHead>
                        <TableHead className="text-[--color-accent-yellow]">
                          Email
                        </TableHead>
                        <TableHead className="text-[--color-accent-yellow]">
                          Valor
                        </TableHead>
                        <TableHead className="text-[--color-accent-yellow]">
                          Data
                        </TableHead>
                        <TableHead className="text-[--color-accent-yellow]">
                          Status
                        </TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {preview.map((row, i) => (
                        <TableRow key={i}>
                          <TableCell className="text-[--color-neon-blue]">
                            {row.cpf}
                          </TableCell>
                          <TableCell className="text-[--color-neon-blue]">
                            {row.nome}
                          </TableCell>
                          <TableCell className="text-[--color-neon-blue]">
                            {row.telefone}
                          </TableCell>

                          <TableCell
                            className={
                              validateEmail(row.email)
                                ? "text-[--color-neon-blue]"
                                : "text-[--color-accent-yellow]"
                            }
                          >
                            {row.email}
                          </TableCell>

                          <TableCell className="text-[--color-neon-blue]">
                            {row.valor}
                          </TableCell>

                          <TableCell className="text-[--color-neon-blue]">
                            {row.dataVencimento}
                          </TableCell>

                          <TableCell
                            className={
                              row.valido
                                ? "text-green-400 font-bold"
                                : "text-[--color-accent-yellow] font-bold"
                            }
                          >
                            {row.valido
                              ? "✔ Válido"
                              : "✖ Inválido"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {/* ERROR MESSAGE */}
                  {stats.invalid > 0 && (
                    <div className="mt-4 p-3 bg-[--color-primary-dark] border border-[--color-accent-yellow]/40 rounded-lg flex gap-3">
                      <AlertCircle className="text-[--color-accent-yellow] w-5 h-5" />
                      <p className="text-[--color-accent-yellow] text-sm">
                        {stats.invalid} registro(s) inválido(s)
                        foram ignorados.
                      </p>
                    </div>
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