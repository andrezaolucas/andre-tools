import { useEffect, useState } from "react";
import { Upload, Loader2, FileText, CheckCircle } from "lucide-react";

interface ProgressIndicatorProps {
  currentStep: "upload" | "processing" | "finishing";
  progress: number;
  startTime: string | null;
}

const steps = [
  {
    id: "upload",
    name: "Upload",
    icon: Upload,
    description: "Enviando arquivo para processamento",
  },
  {
    id: "processing",
    name: "Processando",
    icon: Loader2,
    description: "Convertendo áudio em texto",
  },
  {
    id: "finishing",
    name: "Finalizando",
    icon: FileText,
    description: "Preparando resultado",
  },
];

export default function ProgressIndicator({
  currentStep,
  progress,
  startTime,
}: ProgressIndicatorProps) {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [estimatedTimeRemaining, setEstimatedTimeRemaining] = useState<
    number | null
  >(null);

  // Atualizar tempo decorrido a cada segundo
  useEffect(() => {
    if (!startTime || currentStep === "finishing") return;

    const interval = setInterval(() => {
      const start = new Date(startTime).getTime();
      const now = new Date().getTime();
      const elapsed = Math.floor((now - start) / 1000);
      setElapsedTime(elapsed);

      // Estimar tempo restante baseado no progresso
      if (progress > 0) {
        const estimatedTotal = (elapsed / progress) * 100;
        const remaining = Math.max(0, estimatedTotal - elapsed);
        setEstimatedTimeRemaining(Math.round(remaining));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, progress, currentStep]);

  // Formatar tempo para exibição
  const formatTime = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div className="space-y-4">
      {/* Barra de Progresso */}
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Informações de Tempo */}
      <div className="flex justify-between text-sm text-gray-600">
        <span>Tempo decorrido: {formatTime(elapsedTime)}</span>
        {estimatedTimeRemaining !== null && (
          <span>
            Tempo restante estimado: ~{formatTime(estimatedTimeRemaining)}
          </span>
        )}
      </div>

      {/* Etapas */}
      <div className="relative">
        <div
          className="absolute top-5 w-full h-0.5 bg-gray-200"
          aria-hidden="true"
        />
        <div className="relative flex justify-between">
          {steps.map((step) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isComplete =
              steps.findIndex((s) => s.id === currentStep) >
              steps.findIndex((s) => s.id === step.id);

            return (
              <div
                key={step.id}
                className={`flex flex-col items-center ${
                  isActive
                    ? "text-blue-600"
                    : isComplete
                    ? "text-green-600"
                    : "text-gray-400"
                }`}
              >
                <div className="relative flex items-center justify-center w-10 h-10 bg-white">
                  {isComplete ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    <Icon
                      className={`w-6 h-6 ${isActive ? "animate-spin" : ""}`}
                    />
                  )}
                </div>
                <div className="mt-2 text-sm font-medium text-center">
                  <p>{step.name}</p>
                  <p className="text-xs text-gray-500">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
