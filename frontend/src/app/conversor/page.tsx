"use client";

import { useState, useEffect } from "react";
import { FileText, ArrowLeft } from "lucide-react";
import Link from "next/link";
import ConversionUpload from "@/components/ConversionUpload";
import ConversionResult from "@/components/ConversionResult";
import { TranscriptionSkeleton } from "@/components/ui/Skeleton";

interface ConversionData {
  downloadUrl: string;
  filename: string;
  filesize: number;
  timestamp: string;
  success?: boolean;
  error?: string;
}

export default function ConversorPage() {
  const [conversion, setConversion] = useState<ConversionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular carregamento inicial
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleConversionComplete = (data: ConversionData) => {
    setConversion(data);
    setIsLoading(false);
  };

  const handleConversionStart = () => {
    setIsLoading(true);
    setConversion(null);
  };

  const handleConversionError = () => {
    setIsLoading(false);
    setConversion({
      downloadUrl: "",
      filename: "",
      filesize: 0,
      timestamp: new Date().toISOString(),
      success: false,
      error: "Ocorreu um erro durante a conversão",
    });
  };

  const handleReset = () => {
    setConversion(null);
    setIsLoading(false);
  };

  return (
    <div className="section-padding">
      <div className="container">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
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
              <div className="p-2 bg-green-100 rounded-lg">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Conversor</h1>
                <p className="text-gray-600">
                  Converta arquivos para diferentes formatos
                </p>
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
            <ConversionUpload
              onConversionComplete={handleConversionComplete}
              onConversionStart={handleConversionStart}
              onConversionError={handleConversionError}
              isLoading={isLoading}
            />

            {/* Informações */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">
                Formatos Suportados
              </h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Áudio: MP3, WAV, OPUS → MP3/WAV</li>
                <li>• Vídeo: MP4, MOV → MP3/MP4</li>
                <li>• Imagem: JPG ↔ PNG, JPG/PNG → PDF</li>
                <li>• Documento: TXT → PDF</li>
                <li>• Tamanho máximo: 50MB</li>
              </ul>
            </div>
          </div>

          {/* Área de Resultado */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Arquivo Convertido
              </h2>
              {conversion && !isLoading && (
                <button
                  onClick={handleReset}
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Nova conversão
                </button>
              )}
            </div>

            {isLoading ? (
              <TranscriptionSkeleton />
            ) : (
              <ConversionResult conversion={conversion} isLoading={isLoading} />
            )}
          </div>
        </div>

        {/* Dicas de Uso */}
        {!conversion && !isLoading && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mt-8">
            <h3 className="font-medium text-gray-900 mb-3">
              💡 Dicas para melhores resultados
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
              <div>
                <h4 className="font-medium mb-1">Qualidade</h4>
                <p>
                  Arquivos originais com boa qualidade resultam em melhores
                  conversões
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-1">Formatos</h4>
                <p>Escolha o formato de saída mais adequado para seu uso</p>
              </div>
              <div>
                <h4 className="font-medium mb-1">Tamanho</h4>
                <p>
                  Arquivos muito grandes podem levar mais tempo para converter
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-1">Compatibilidade</h4>
                <p>
                  Verifique a compatibilidade do formato escolhido com seu
                  dispositivo
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
