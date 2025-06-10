"use client";

import { useState, useEffect, useRef } from "react";
import { Clock, FileText, X, PencilRuler, Upload } from "lucide-react";

interface RecentFile {
  path: string;
  name: string;
  lastOpened: string;
}

export default function ExcalidrawPage() {
  const [recentFiles, setRecentFiles] = useState<RecentFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
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
    } finally {
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Excalidraw</h1>
        <div className="flex items-center space-x-4">
          <input
            ref={fileInputRef}
            type="file"
            accept=".excalidraw"
            onChange={handleFileSelect}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            disabled={isLoading}
          >
            <Upload className="h-4 w-4" />
            <span>Selecionar Arquivo</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {isLoading && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-700">
          Processando arquivo...
        </div>
      )}

      {/* Grid de Arquivos Recentes */}
      <div className="space-y-6">
        {recentFiles.length > 0 && (
          <>
            <h2 className="text-xl font-semibold text-gray-900">
              Arquivos Recentes
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {recentFiles.map((file) => (
                <button
                  key={file.path}
                  onClick={() => openFile(file.path)}
                  disabled={isLoading}
                  className="group bg-white rounded-lg shadow-md hover:shadow-lg transition-all border border-gray-200 overflow-hidden"
                >
                  {/* Preview */}
                  <div className="aspect-square bg-gray-50 flex items-center justify-center border-b border-gray-200 group-hover:bg-gray-100 transition-colors">
                    <PencilRuler className="h-12 w-12 text-gray-400 group-hover:text-blue-600 transition-colors" />
                  </div>
                  {/* Info */}
                  <div className="p-4">
                    <div className="text-sm font-medium text-gray-900 truncate mb-1">
                      {file.name}
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>
                        {new Date(file.lastOpened).toLocaleString("pt-BR")}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}

        {/* Conteúdo Principal */}
        {recentFiles.length === 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="text-center space-y-4">
              <PencilRuler className="h-12 w-12 mx-auto text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">
                Integração com Excalidraw
              </h2>
              <p className="text-gray-600 max-w-md mx-auto">
                Abra e edite seus arquivos do Excalidraw diretamente do Andre
                Tools. Clique no botão acima para selecionar um arquivo
                .excalidraw.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
