import Link from "next/link";
import { Mic, FileText, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Andre Tools</h1>
          <p className="text-xl text-gray-600">
            Ferramentas para transcrição e conversão de arquivos
          </p>
        </div>

        {/* Cards de Funcionalidades */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card Transcrição */}
          <Link
            href="/transcricao"
            className="group bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all border border-gray-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Mic className="h-6 w-6 text-blue-600" />
              </div>
              <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Transcrição
            </h3>
            <p className="text-gray-600">
              Converta áudio e vídeo em texto usando Whisper AI
            </p>
          </Link>

          {/* Card Conversor */}
          <Link
            href="/conversor"
            className="group bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all border border-gray-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
              <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-green-600 transition-colors" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Conversor
            </h3>
            <p className="text-gray-600">
              Converta entre diferentes formatos de arquivo
            </p>
          </Link>
        </div>

        {/* Características */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Recursos Disponíveis
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Transcrição</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Suporte para MP3, WAV, MP4, MOV</li>
                <li>• Processamento local com Whisper</li>
                <li>• Detecção automática de idioma</li>
                <li>• Interface intuitiva</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Conversor</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Conversão entre formatos de áudio</li>
                <li>• Conversão de vídeo para áudio</li>
                <li>• Conversão entre formatos de imagem</li>
                <li>• Conversão de documentos para PDF</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
