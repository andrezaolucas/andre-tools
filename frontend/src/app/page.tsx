"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Mic, FileText, ArrowRight, PencilRuler } from "lucide-react";
import { CardSkeleton } from "@/components/ui/Skeleton";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular carregamento inicial
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="section-padding">
      <div className="container">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Andre Tools
          </h1>
          <p className="text-xl text-gray-600">
            Ferramentas avançadas para transcrição, conversão de arquivos e
            diagramação
          </p>
        </div>

        {/* Cards de Funcionalidades */}
        <div className="grid-responsive mb-16">
          {isLoading ? (
            <>
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </>
          ) : (
            <>
              {/* Card Transcrição */}
              <Link href="/transcricao" className="card card-hover p-8">
                <div className="flex-between mb-6">
                  <div className="p-4 bg-blue-100 rounded-xl">
                    <Mic className="h-8 w-8 text-blue-600" />
                  </div>
                  <ArrowRight className="h-6 w-6 text-gray-400 group-hover:text-blue-600 transition-colors" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Transcrição
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Converta áudio e vídeo em texto usando Whisper AI com alta
                  precisão
                </p>
              </Link>

              {/* Card Conversor */}
              <Link href="/conversor" className="card card-hover p-8">
                <div className="flex-between mb-6">
                  <div className="p-4 bg-green-100 rounded-xl">
                    <FileText className="h-8 w-8 text-green-600" />
                  </div>
                  <ArrowRight className="h-6 w-6 text-gray-400 group-hover:text-green-600 transition-colors" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Conversor
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Converta arquivos entre diferentes formatos com facilidade
                </p>
              </Link>

              {/* Card Excalidraw */}
              <Link href="/excalidraw" className="card card-hover p-8">
                <div className="flex-between mb-6">
                  <div className="p-4 bg-purple-100 rounded-xl">
                    <PencilRuler className="h-8 w-8 text-purple-600" />
                  </div>
                  <ArrowRight className="h-6 w-6 text-gray-400 group-hover:text-purple-600 transition-colors" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Excalidraw
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Crie e edite diagramas e desenhos com uma interface intuitiva
                </p>
              </Link>
            </>
          )}
        </div>

        {/* Características */}
        <div className="card p-8 sm:p-10">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-8 text-center">
            Recursos Disponíveis
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {isLoading ? (
              <>
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="space-y-4">
                    <div className="h-6 w-32 bg-gray-200 rounded-md animate-pulse" />
                    <div className="space-y-3">
                      {[...Array(4)].map((_, j) => (
                        <div key={j} className="flex items-start">
                          <div className="w-2 h-2 mt-2 mr-2 bg-gray-200 rounded-full animate-pulse" />
                          <div className="h-4 flex-1 bg-gray-200 rounded-md animate-pulse" />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Transcrição
                  </h3>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Suporte para MP3, WAV, MP4, MOV</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Processamento local com Whisper</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Detecção automática de idioma</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Interface moderna e intuitiva</span>
                    </li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Conversor
                  </h3>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Conversão entre formatos de áudio</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Conversão de vídeo para áudio</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Conversão entre formatos de imagem</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Conversão de documentos para PDF</span>
                    </li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Excalidraw
                  </h3>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Crie diagramas e desenhos</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Salve e gerencie arquivos</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Histórico de arquivos recentes</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Integração com navegador</span>
                    </li>
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
