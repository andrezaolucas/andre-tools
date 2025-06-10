"use client";

import { useState, useRef, ChangeEvent } from "react";
import { Upload, Loader2 } from "lucide-react";

interface ConversionUploadProps {
  onConversionComplete: (data: any) => void;
  onConversionStart: () => void;
  onConversionError: () => void;
  isLoading: boolean;
}

const CONVERSION_OPTIONS = {
  "audio/mpeg": ["mp3", "wav"],
  "audio/wav": ["mp3", "wav"],
  "audio/opus": ["mp3", "wav"],
  "audio/ogg": ["mp3", "wav"],
  "audio/webm": ["mp3", "wav"],
  "application/ogg": ["mp3", "wav"],
  "audio/x-opus": ["mp3", "wav"],
  "audio/x-opus+ogg": ["mp3", "wav"],
  "video/mp4": ["mp3", "mp4"],
  "video/quicktime": ["mp3", "mp4"],
  "image/jpeg": ["png", "pdf"],
  "image/png": ["jpg", "pdf"],
  "text/plain": ["pdf"],
};

export default function ConversionUpload({
  onConversionComplete,
  onConversionStart,
  onConversionError,
  isLoading,
}: ConversionUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [targetFormat, setTargetFormat] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Verificar tamanho do arquivo (500MB em bytes)
      if (selectedFile.size > 500 * 1024 * 1024) {
        alert("O arquivo é muito grande. O tamanho máximo permitido é 500MB.");
        return;
      }

      console.log("Arquivo selecionado:", {
        name: selectedFile.name,
        type: selectedFile.type,
        size: selectedFile.size,
      });

      // Se for um arquivo .opus mas o tipo MIME não está correto
      if (selectedFile.name.toLowerCase().endsWith(".opus")) {
        const formats = CONVERSION_OPTIONS["audio/opus"];
        setFile(selectedFile);
        setTargetFormat(""); // Reset format when new file is selected
        return;
      }

      setFile(selectedFile);
      setTargetFormat(""); // Reset format when new file is selected
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleConvert = async () => {
    if (!file || !targetFormat) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("format", targetFormat);

    try {
      onConversionStart();

      const response = await fetch("http://localhost:3001/api/convert", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || "Erro na conversão");
      }

      const data = await response.json();
      onConversionComplete(data);
    } catch (error) {
      console.error("Erro:", error);
      onConversionError();
    }
  };

  const getAvailableFormats = () => {
    if (!file) return [];
    return (
      CONVERSION_OPTIONS[file.type as keyof typeof CONVERSION_OPTIONS] || []
    );
  };

  return (
    <div className="space-y-4">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        className="hidden"
        accept={Object.keys(CONVERSION_OPTIONS).join(",")}
      />

      {/* Área de Upload */}
      <div
        onClick={handleUploadClick}
        className={`
          border-2 border-dashed rounded-lg p-6
          ${
            file
              ? "border-blue-200 bg-blue-50"
              : "border-gray-200 hover:border-gray-300"
          }
          ${isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
          transition-colors
        `}
      >
        <div className="flex flex-col items-center space-y-2 text-center">
          <div className="p-2 bg-blue-100 rounded-full">
            <Upload className="h-6 w-6 text-blue-600" />
          </div>
          {file ? (
            <>
              <p className="text-sm font-medium text-gray-900">{file.name}</p>
              <p className="text-sm text-gray-500">
                {(file.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </>
          ) : (
            <>
              <p className="text-sm font-medium text-gray-900">
                Clique para selecionar um arquivo
              </p>
              <p className="text-sm text-gray-500">ou arraste e solte aqui</p>
            </>
          )}
        </div>
      </div>

      {/* Seleção de Formato */}
      {file && !isLoading && (
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Formato de Saída
          </label>
          <select
            value={targetFormat}
            onChange={(e) => setTargetFormat(e.target.value)}
            className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">Selecione o formato</option>
            {getAvailableFormats().map((format) => (
              <option key={format} value={format}>
                .{format.toUpperCase()}
              </option>
            ))}
          </select>

          <button
            onClick={handleConvert}
            disabled={!targetFormat || isLoading}
            className={`
              w-full rounded-lg px-4 py-2 text-sm font-medium text-white
              ${
                targetFormat && !isLoading
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-300 cursor-not-allowed"
              }
              transition-colors
            `}
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Convertendo...</span>
              </div>
            ) : (
              "Converter Arquivo"
            )}
          </button>
        </div>
      )}
    </div>
  );
}
