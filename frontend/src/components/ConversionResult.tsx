"use client";

import { FileCheck, Loader2, AlertCircle, Download } from "lucide-react";

interface ConversionData {
  downloadUrl: string;
  filename: string;
  filesize: number;
  timestamp: string;
  success?: boolean;
  error?: string;
}

interface ConversionResultProps {
  conversion: ConversionData | null;
  isLoading: boolean;
}

export default function ConversionResult({
  conversion,
  isLoading,
}: ConversionResultProps) {
  if (isLoading) {
    return (
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-6">
        <div className="flex items-center justify-center space-x-3">
          <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
          <span className="text-blue-700">Convertendo arquivo...</span>
        </div>
      </div>
    );
  }

  if (!conversion) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
        <div className="text-center text-gray-500">
          Nenhuma conversão realizada
        </div>
      </div>
    );
  }

  if (!conversion.success) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6">
        <div className="flex items-center justify-center space-x-2 text-red-700">
          <AlertCircle className="h-5 w-5" />
          <span>
            {conversion.error || "Ocorreu um erro durante a conversão"}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-green-200 bg-green-50 p-6 space-y-4">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-green-100 rounded-full">
          <FileCheck className="h-6 w-6 text-green-600" />
        </div>
        <div>
          <h3 className="text-sm font-medium text-green-900">
            Arquivo convertido com sucesso!
          </h3>
          <p className="text-sm text-green-700">{conversion.filename}</p>
        </div>
      </div>

      <div className="text-sm text-green-700 space-y-1">
        <p>Tamanho: {(conversion.filesize / (1024 * 1024)).toFixed(2)} MB</p>
        <p>
          Data:{" "}
          {new Date(conversion.timestamp).toLocaleString("pt-BR", {
            dateStyle: "short",
            timeStyle: "short",
          })}
        </p>
      </div>

      <a
        href={`http://localhost:3001${conversion.downloadUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center space-x-2 w-full rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 transition-colors"
      >
        <Download className="h-4 w-4" />
        <span>Baixar Arquivo</span>
      </a>
    </div>
  );
}
