"use client";

import { useState, useEffect, useRef } from "react";
import { Clock, FileText, X, PencilRuler, Upload } from "lucide-react";
import { FileSkeleton } from "@/components/ui/Skeleton";

interface RecentFile {
  path: string;
  name: string;
  lastOpened: string;
}

export default function ExcalidrawPage() {
  const [recentFiles, setRecentFiles] = useState<RecentFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Carregar arquivos recentes
  const loadRecentFiles = async () => {
    try {
      const response = await fetch(
        "http://localhost:3001/api/excalidraw/recent"
      );
      if (!response.ok) throw new Error("Erro ao carregar arquivos recentes");
      const data = await response.json();
      setRecentFiles(data);
    } catch (error) {
      console.error("Erro:", error);
      setError("Não foi possível carregar os arquivos recentes");
    } finally {
      setIsLoading(false);
    }
  };

  // Abrir arquivo no Excalidraw
  const openFile = async (filePath: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "http://localhost:3001/api/excalidraw/open",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ filePath }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao abrir arquivo");
      }

      // Atualiza a lista de arquivos recentes
      loadRecentFiles();
    } catch (error) {
      console.error("Erro:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Não foi possível abrir o arquivo"
      );
      setIsLoading(false);
    }
  };

  // Carregar arquivos recentes ao montar o componente
  useEffect(() => {
    loadRecentFiles();
  }, []);

  // Função para lidar com a seleção de arquivo
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Verificar se é um arquivo .excalidraw
    if (!file.name.endsWith(".excalidraw")) {
      setError("Por favor, selecione um arquivo .excalidraw");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Criar FormData para enviar o arquivo
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        "http://localhost:3001/api/excalidraw/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Erro ao enviar arquivo");

      const data = await response.json();
      await openFile(data.filePath);

      // Limpar o input de arquivo
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Erro:", error);
      setError("Não foi possível enviar o arquivo");
      setIsLoading(false);
    }
  };

  return (
    <div className="section-padding">
      <div className="container">
        <div className="flex-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Excalidraw</h1>
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".excalidraw"
              onChange={handleFileSelect}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="btn btn-primary"
              disabled={isLoading}
            >
              <Upload className="h-4 w-4 mr-2" />
              <span>Selecionar Arquivo</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Grid de Arquivos Recentes */}
        <div className="space-y-8">
          {recentFiles.length > 0 && (
            <>
              <h2 className="text-2xl font-semibold text-gray-900">
                Arquivos Recentes
              </h2>
              <div className="grid-responsive">
                {isLoading ? (
                  <>
                    <FileSkeleton />
                    <FileSkeleton />
                    <FileSkeleton />
                    <FileSkeleton />
                  </>
                ) : (
                  recentFiles.map((file) => (
                    <button
                      key={file.path}
                      onClick={() => openFile(file.path)}
                      disabled={isLoading}
                      className="card card-hover overflow-hidden group"
                    >
                      {/* Preview */}
                      <div className="aspect-square bg-gray-50 flex-center border-b border-gray-200 group-hover:bg-gray-100 transition-colors">
                        <PencilRuler className="h-12 w-12 text-gray-400 group-hover:text-blue-600 transition-colors" />
                      </div>
                      {/* Info */}
                      <div className="p-4">
                        <div className="font-medium text-gray-900 truncate mb-2">
                          {file.name}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="h-4 w-4 mr-1.5" />
                          <span>
                            {new Date(file.lastOpened).toLocaleString("pt-BR")}
                          </span>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </>
          )}

          {/* Conteúdo Principal */}
          {recentFiles.length === 0 && !isLoading && (
            <div className="card p-12">
              <div className="text-center space-y-6">
                <div className="p-4 bg-blue-100 rounded-full inline-flex">
                  <PencilRuler className="h-12 w-12 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                    Integração com Excalidraw
                  </h2>
                  <p className="text-gray-600 max-w-lg mx-auto leading-relaxed">
                    Abra e edite seus arquivos do Excalidraw diretamente do
                    Andre Tools. Clique no botão acima para selecionar um
                    arquivo .excalidraw.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Estado de Carregamento Inicial */}
          {isLoading && recentFiles.length === 0 && (
            <div className="space-y-8">
              <div className="h-8 w-48 bg-gray-200 rounded-md animate-pulse" />
              <div className="grid-responsive">
                <FileSkeleton />
                <FileSkeleton />
                <FileSkeleton />
                <FileSkeleton />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
