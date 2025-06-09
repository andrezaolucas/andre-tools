"use client";

import { useState } from "react";
import TranscriptionUpload from "@/components/TranscriptionUpload";
import TranscriptionResult from "@/components/TranscriptionResult";
import { FileText, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface TranscriptionData {
  text: string;
  filename: string;
  filesize: number;
  timestamp: string;
  success?: boolean;
  error?: string;
}

export default function TranscricaoPage() {
  const [transcription, setTranscription] = useState<TranscriptionData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleTranscriptionComplete = (data: TranscriptionData) => {
    setTranscription(data);
    setIsLoading(false);
  };

  const handleTranscriptionStart = () => {
    setIsLoading(true);
    setTranscription(null);
  };

  const handleTranscriptionError = () => {
    setIsLoading(false);
    setTranscription({
      text: "",
      filename: "",
      filesize: 0,
      timestamp: new Date().toISOString(),
      success: false,
      error: "Ocorreu um erro durante a transcrição",
    });
  };

  const handleReset = () => {
    setTranscription(null);
    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/"
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Voltar</span>
          </Link>
          <div className="h-6 w-px bg-gray-300"></div>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Transcrição</h1>
              <p className="text-gray-600">Converta áudio e vídeo em texto</p>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Área de Upload */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Upload de Arquivo
          </h2>
          <TranscriptionUpload
            onTranscriptionComplete={handleTranscriptionComplete}
            onTranscriptionStart={handleTranscriptionStart}
            onTranscriptionError={handleTranscriptionError}
            isLoading={isLoading}
          />

          {/* Informações */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2">
              Formatos Suportados
            </h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Áudio: MP3, WAV</li>
              <li>• Vídeo: MP4, MOV</li>
              <li>• Tamanho máximo: 100MB</li>
              <li>• Processamento 100% offline</li>
            </ul>
          </div>
        </div>

        {/* Área de Resultado */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Resultado da Transcrição
            </h2>
            {transcription && (
              <button
                onClick={handleReset}
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Nova transcrição
              </button>
            )}
          </div>

          <TranscriptionResult
            transcription={transcription}
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* Dicas de Uso */}
      {!transcription && !isLoading && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h3 className="font-medium text-gray-900 mb-3">
            💡 Dicas para melhores resultados
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
            <div>
              <h4 className="font-medium mb-1">Qualidade do Áudio</h4>
              <p>
                Use arquivos com boa qualidade de áudio para transcrições mais
                precisas
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-1">Fala Clara</h4>
              <p>
                Arquivos com fala clara e pausas ajudam na precisão da
                transcrição
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-1">Idioma</h4>
              <p>O modelo detecta automaticamente o idioma falado no áudio</p>
            </div>
            <div>
              <h4 className="font-medium mb-1">Processamento</h4>
              <p>Arquivos grandes podem levar alguns minutos para processar</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
