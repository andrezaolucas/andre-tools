import Link from "next/link";
import { Mic, ArrowRight, Upload, Clock, CheckCircle } from "lucide-react";

export default function Home() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Andre Tools</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Ferramentas para transcrição de áudio e vídeo usando inteligência
          artificial local
        </p>
      </div>

      {/* Cards de Funcionalidades */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card Transcrição */}
        <Link href="/transcricao" className="group">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border border-gray-200">
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
              Converta áudio e vídeo em texto usando Whisper AI offline
            </p>
          </div>
        </Link>

        {/* Cards Futuros (Desabilitados) */}
        <div className="bg-gray-100 rounded-lg shadow-md p-6 opacity-50 cursor-not-allowed border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gray-200 rounded-lg">
              <Upload className="h-6 w-6 text-gray-500" />
            </div>
            <div className="text-xs bg-gray-300 text-gray-600 px-2 py-1 rounded">
              Em breve
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Conversor
          </h3>
          <p className="text-gray-500">
            Converta entre diferentes formatos de áudio e vídeo
          </p>
        </div>

        <div className="bg-gray-100 rounded-lg shadow-md p-6 opacity-50 cursor-not-allowed border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gray-200 rounded-lg">
              <Clock className="h-6 w-6 text-gray-500" />
            </div>
            <div className="text-xs bg-gray-300 text-gray-600 px-2 py-1 rounded">
              Em breve
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Histórico
          </h3>
          <p className="text-gray-500">
            Visualize e gerencie suas transcrições anteriores
          </p>
        </div>
      </div>

      {/* Características */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Características
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start space-x-3">
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-gray-900">100% Offline</h3>
              <p className="text-gray-600">
                Processamento local sem envio de dados para nuvem
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-gray-900">Múltiplos Formatos</h3>
              <p className="text-gray-600">
                Suporte para MP3, WAV, MP4, MOV e mais
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-gray-900">IA Avançada</h3>
              <p className="text-gray-600">
                Powered by OpenAI Whisper para alta precisão
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-gray-900">Gratuito</h3>
              <p className="text-gray-600">
                Uso ilimitado sem custos adicionais
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
