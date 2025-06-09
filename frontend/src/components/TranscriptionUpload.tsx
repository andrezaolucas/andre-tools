"use client";

import { useState, useRef, DragEvent, ChangeEvent } from "react";
import { Upload, FileAudio, FileVideo, X, Loader2 } from "lucide-react";
import axios from "axios";
import ProgressIndicator from "./ProgressIndicator";

interface TranscriptionUploadProps {
  onTranscriptionComplete: (data: any) => void;
  onTranscriptionStart: () => void;
  onTranscriptionError: () => void;
  isLoading: boolean;
}

export default function TranscriptionUpload({
  onTranscriptionComplete,
  onTranscriptionStart,
  onTranscriptionError,
  isLoading,
}: TranscriptionUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState<
    "upload" | "processing" | "finishing"
  >("upload");
  const [startTime, setStartTime] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Tipos de arquivo aceitos
  const acceptedTypes = [
    "audio/mpeg",
    "audio/mp3",
    "audio/wav",
    "audio/wave",
    "video/mp4",
    "video/quicktime",
    "video/x-msvideo",
  ];

  const acceptedExtensions = [".mp3", ".wav", ".mp4", ".mov", ".avi"];

  const validateFile = (file: File): string | null => {
    // Verificar tamanho (100MB)
    if (file.size > 100 * 1024 * 1024) {
      return "Arquivo muito grande. Tamanho máximo: 100MB";
    }

    // Verificar tipo de arquivo
    const fileExtension = file.name
      .toLowerCase()
      .substring(file.name.lastIndexOf("."));
    if (
      !acceptedTypes.includes(file.type) &&
      !acceptedExtensions.includes(fileExtension)
    ) {
      return "Tipo de arquivo não suportado. Use: MP3, WAV, MP4, MOV";
    }

    return null;
  };

  const handleFileSelect = (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setSelectedFile(file);
    setError(null);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleTranscribe = async () => {
    if (!selectedFile) return;

    try {
      setError(null);
      setUploadProgress(0);
      setCurrentStep("upload");
      setStartTime(new Date().toISOString());
      onTranscriptionStart();

      const formData = new FormData();
      formData.append("audio", selectedFile);

      console.log("🚀 Iniciando transcrição...", {
        fileName: selectedFile.name,
        fileSize: formatFileSize(selectedFile.size),
        fileType: selectedFile.type,
      });

      // Iniciar transcrição
      console.log("⏳ Enviando arquivo para o backend...");
      const response = await axios.post("/api/transcribe", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
            console.log(`📤 Upload progresso: ${percentCompleted}%`);
          }
        },
      });

      const { transcriptionId } = response.data;
      console.log("✅ Transcrição iniciada:", { transcriptionId });
      setCurrentStep("processing");

      // Polling do status da transcrição
      const pollStatus = async () => {
        try {
          const statusResponse = await axios.get(
            `/api/transcribe/${transcriptionId}`
          );
          console.log("📊 Status da transcrição:", statusResponse.data);

          if (statusResponse.data.status === "completed") {
            setCurrentStep("finishing");
            console.log("🎉 Transcrição concluída!", {
              status: statusResponse.data.status,
              textLength: statusResponse.data.text?.length || 0,
              preview:
                statusResponse.data.text?.substring(0, 100) || "Sem texto",
            });

            const transcribedText = statusResponse.data.text;

            if (!transcribedText || transcribedText.trim() === "") {
              throw new Error("Nenhum texto foi detectado no arquivo.");
            }

            // Remover possíveis caracteres nulos ou inválidos
            const cleanText = transcribedText
              .replace(/\0/g, "") // Remover caracteres nulos
              .trim();

            if (!cleanText) {
              throw new Error("Texto transcrito está vazio após limpeza.");
            }

            onTranscriptionComplete({
              text: cleanText,
              filename: statusResponse.data.filename,
              filesize: statusResponse.data.filesize,
              timestamp: statusResponse.data.timestamp,
              success: true,
            });
            return true;
          } else if (statusResponse.data.status === "error") {
            throw new Error(statusResponse.data.error || "Erro na transcrição");
          }

          // Continuar polling
          return false;
        } catch (error) {
          console.error("❌ Erro ao verificar status:", error);
          throw error;
        }
      };

      // Iniciar polling
      let attempts = 0;
      const maxAttempts = 120; // 2 minutos (com intervalo de 1 segundo)

      while (attempts < maxAttempts) {
        const isComplete = await pollStatus();
        if (isComplete) break;

        await new Promise((resolve) => setTimeout(resolve, 1000));
        attempts++;
      }

      if (attempts >= maxAttempts) {
        throw new Error(
          "Tempo limite excedido. A transcrição está demorando muito."
        );
      }
    } catch (error: any) {
      console.error("❌ Erro detalhado:", {
        name: error.name,
        message: error.message,
        code: error.code,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
      });

      setError(
        error.response?.data?.error ||
          error.message ||
          "Erro desconhecido na transcrição"
      );
      onTranscriptionError();
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("audio/")) {
      return <FileAudio className="h-8 w-8 text-blue-600" />;
    } else if (file.type.startsWith("video/")) {
      return <FileVideo className="h-8 w-8 text-purple-600" />;
    }
    return <FileAudio className="h-8 w-8 text-gray-600" />;
  };

  return (
    <div className="space-y-4">
      {/* Área de Upload */}
      {!selectedFile ? (
        <div
          className={`upload-area ${dragOver ? "dragover" : ""}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleUploadClick}
        >
          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Arraste arquivos aqui ou clique para selecionar
          </h3>
          <p className="text-gray-600 mb-4">
            Suporte para MP3, WAV, MP4, MOV (máx. 100MB)
          </p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Selecionar Arquivo
          </button>
        </div>
      ) : (
        /* Arquivo Selecionado */
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getFileIcon(selectedFile)}
                <div>
                  <h4 className="font-medium text-gray-900">
                    {selectedFile.name}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>
              </div>
              <button
                onClick={handleRemoveFile}
                className="text-gray-400 hover:text-red-600 transition-colors"
                disabled={isLoading}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Indicador de Progresso */}
          {isLoading && (
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <ProgressIndicator
                currentStep={currentStep}
                progress={currentStep === "upload" ? uploadProgress : 0}
                startTime={startTime}
              />
            </div>
          )}
        </div>
      )}

      {/* Input de arquivo oculto */}
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedExtensions.join(",")}
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* Botão de Transcrever */}
      {selectedFile && !isLoading && (
        <button
          onClick={handleTranscribe}
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
        >
          <FileAudio className="h-5 w-5" />
          <span>Transcrever Arquivo</span>
        </button>
      )}

      {/* Mensagem de Erro */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}
    </div>
  );
}
