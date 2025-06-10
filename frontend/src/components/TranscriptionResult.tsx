"use client";

import { useState } from "react";
import {
  Copy,
  Download,
  CheckCircle,
  Loader2,
  AlertCircle,
  FileText,
} from "lucide-react";

interface TranscriptionData {
  text: string;
  filename: string;
  filesize: number;
  timestamp: string;
  success?: boolean;
  error?: string;
}

interface TranscriptionResultProps {
  transcription: TranscriptionData | null;
  isLoading: boolean;
}

export default function TranscriptionResult({
  transcription,
  isLoading,
}: TranscriptionResultProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!transcription?.text) return;

    try {
      await navigator.clipboard.writeText(transcription.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Erro ao copiar texto:", error);
    }
  };

  const handleDownload = () => {
    if (!transcription?.text) return;

    const blob = new Blob([transcription.text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `transcricao-${transcription.filename}-${
      new Date().toISOString().split("T")[0]
    }.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (timestamp: string): string => {
    try {
      return new Date(timestamp).toLocaleString("pt-BR");
    } catch {
      return "Data inválida";
    }
  };

  if (isLoading) {
    return (
      <div className="card p-12">
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="p-4 bg-blue-100 rounded-full">
            <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
          </div>
          <div className="text-center">
            <h3 className="text-xl font-medium text-gray-900 mb-3">
              Transcrevendo...
            </h3>
            <p className="text-gray-600 max-w-lg mx-auto leading-relaxed">
              Processando seu arquivo com IA. Isso pode levar alguns minutos.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!transcription) {
    return (
      <div className="card p-12 border-2 border-dashed">
        <div className="flex flex-col items-center justify-center space-y-6 text-center">
          <div className="p-4 bg-gray-100 rounded-full">
            <FileText className="h-12 w-12 text-gray-400" />
          </div>
          <div>
            <h3 className="text-xl font-medium text-gray-900 mb-3">
              Nenhuma transcrição ainda
            </h3>
            <p className="text-gray-600 max-w-lg mx-auto leading-relaxed">
              Faça upload de um arquivo de áudio ou vídeo para começar
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (transcription.success === false || transcription.error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-lg font-medium text-red-900 mb-2">
              Erro na Transcrição
            </h3>
            <p className="text-red-800 mb-4">
              {transcription.error ||
                "Ocorreu um erro desconhecido durante a transcrição."}
            </p>
            <div className="text-sm text-red-700">
              <p>Possíveis soluções:</p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Verifique se o arquivo de áudio está corrompido</li>
                <li>Tente com um arquivo menor</li>
                <li>Verifique se o formato é suportado (MP3, WAV, MP4, MOV)</li>
                <li>Aguarde um momento e tente novamente</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      {/* Header com informações do arquivo */}
      <div className="bg-gray-50 px-8 py-6 border-b border-gray-200">
        <div className="flex-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                Transcrição Concluída
              </h3>
              <p className="text-sm text-gray-600">
                {transcription.filename} •{" "}
                {formatFileSize(transcription.filesize)}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">
              {formatDate(transcription.timestamp)}
            </p>
          </div>
        </div>
      </div>

      {/* Conteúdo da transcrição */}
      <div className="p-8">
        <div className="space-y-6">
          {/* Botões de ação */}
          <div className="flex space-x-3">
            <button onClick={handleCopy} className="btn btn-secondary">
              <Copy className="h-4 w-4 mr-2" />
              <span>{copied ? "Copiado!" : "Copiar"}</span>
            </button>
            <button onClick={handleDownload} className="btn btn-secondary">
              <Download className="h-4 w-4 mr-2" />
              <span>Download</span>
            </button>
          </div>

          {/* Texto da transcrição */}
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <div className="max-h-[32rem] overflow-y-auto pr-4 -mr-4">
              <p className="text-gray-900 leading-relaxed whitespace-pre-wrap">
                {transcription.text || "Nenhum texto foi detectado no arquivo."}
              </p>
            </div>
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-2 gap-8 pt-6 border-t border-gray-200">
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900 mb-2">
                {transcription.text ? transcription.text.split(" ").length : 0}
              </p>
              <p className="text-sm text-gray-600 font-medium">Palavras</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900 mb-2">
                {transcription.text ? transcription.text.length : 0}
              </p>
              <p className="text-sm text-gray-600 font-medium">Caracteres</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
