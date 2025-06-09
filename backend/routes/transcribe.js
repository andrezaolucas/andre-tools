const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs-extra");
const { nodewhisper } = require("nodejs-whisper");
const crypto = require("crypto");

const router = express.Router();

// Armazenar transcrições em andamento
const transcriptions = new Map();

// Configuração do Multer para upload de arquivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../uploads");
    fs.ensureDirSync(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Gerar nome único para o arquivo
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);
    cb(null, `upload-${uniqueSuffix}${extension}`);
  },
});

// Filtro de tipos de arquivo
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "audio/mpeg",
    "audio/mp3",
    "audio/wav",
    "audio/wave",
    "video/mp4",
    "video/quicktime",
    "video/x-msvideo",
  ];

  const allowedExtensions = [".mp3", ".wav", ".mp4", ".mov", ".avi"];
  const fileExtension = path.extname(file.originalname).toLowerCase();

  if (
    allowedTypes.includes(file.mimetype) ||
    allowedExtensions.includes(fileExtension)
  ) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Tipo de arquivo não suportado: ${file.mimetype}. Formatos aceitos: MP3, WAV, MP4, MOV`
      ),
      false
    );
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limite
  },
});

// Endpoint POST /api/transcribe
router.post("/", upload.single("audio"), async (req, res) => {
  let filePath = null;

  try {
    // Verificar se o arquivo foi enviado
    if (!req.file) {
      return res.status(400).json({
        error: "Nenhum arquivo enviado",
        message: "Por favor, selecione um arquivo de áudio ou vídeo",
      });
    }

    filePath = req.file.path;
    console.log(
      `📁 Arquivo recebido: ${req.file.originalname} (${req.file.size} bytes)`
    );
    console.log(`📂 Salvo em: ${filePath}`);

    // Gerar ID único para a transcrição
    const transcriptionId = crypto.randomUUID();

    // Iniciar transcrição em background
    transcriptions.set(transcriptionId, {
      status: "processing",
      filename: req.file.originalname,
      filesize: req.file.size,
      filePath,
      startTime: new Date(),
      progress: 0,
    });

    // Iniciar processo de transcrição em background
    processTranscription(transcriptionId, filePath).catch((error) => {
      console.error(`❌ Erro na transcrição ${transcriptionId}:`, error);
      transcriptions.set(transcriptionId, {
        ...transcriptions.get(transcriptionId),
        status: "error",
        error: error.message,
      });
    });

    // Retornar imediatamente o ID
    return res.status(202).json({
      success: true,
      message: "Transcrição iniciada",
      transcriptionId,
      status: "processing",
    });
  } catch (error) {
    console.error("❌ Erro ao iniciar transcrição:", error);
    return res.status(500).json({
      success: false,
      error: "Erro ao iniciar transcrição",
      details: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
});

// Endpoint GET /api/transcribe/:id
router.get("/:id", (req, res) => {
  const transcriptionId = req.params.id;
  const transcription = transcriptions.get(transcriptionId);

  if (!transcription) {
    return res.status(404).json({
      success: false,
      error: "Transcrição não encontrada",
    });
  }

  // Se a transcrição estiver completa, incluir o texto
  if (transcription.status === "completed") {
    return res.json({
      success: true,
      status: "completed",
      text: transcription.text,
      filename: transcription.filename,
      filesize: transcription.filesize,
      timestamp: transcription.completedAt,
    });
  }

  // Se houver erro, retornar o erro
  if (transcription.status === "error") {
    return res.status(500).json({
      success: false,
      status: "error",
      error: transcription.error,
    });
  }

  // Se ainda estiver processando, retornar o status
  return res.json({
    success: true,
    status: "processing",
    progress: transcription.progress,
    filename: transcription.filename,
    startTime: transcription.startTime,
  });
});

// Função para processar a transcrição em background
async function processTranscription(transcriptionId, filePath) {
  const transcription = transcriptions.get(transcriptionId);

  try {
    // Configurações do Whisper
    const whisperOptions = {
      modelName: "small",
      autoDownloadModelName: "small",
      removeWavFileAfterTranscription: false,
      withCuda: false,
      whisperOptions: {
        outputInText: true,
        outputInJson: false,
        outputInSrt: false,
        outputInVtt: false,
        translateToEnglish: false,
        wordTimestamps: false,
        splitOnWord: true,
        language: "auto",
      },
    };

    let transcript;
    try {
      transcript = await nodewhisper(filePath, whisperOptions);
    } catch (whisperError) {
      if (
        whisperError.message.includes("metal library is nil") ||
        whisperError.message.includes("failed to initialize Metal")
      ) {
        console.log("⚠️ Metal não disponível, usando CPU...");
        transcript = await nodewhisper(filePath, {
          ...whisperOptions,
          whisperOptions: {
            ...whisperOptions.whisperOptions,
            forceCPU: true,
          },
        });
      } else {
        throw whisperError;
      }
    }

    if (!transcript || typeof transcript !== "string") {
      throw new Error("A transcrição falhou - texto não gerado");
    }

    console.log("✅ Transcrição concluída!");
    console.log(`📝 Texto transcrito: ${transcript.substring(0, 100)}...`);

    // Atualizar status como completo
    console.log("🔄 Atualizando status da transcrição...");
    const transcriptionData = {
      status: "completed",
      success: true,
      text: transcript,
      filename: transcription.filename,
      filesize: transcription.filesize,
      completedAt: new Date().toISOString(),
    };

    transcriptions.set(transcriptionId, transcriptionData);
    console.log("✨ Status atualizado com sucesso!");

    // Log do objeto completo
    console.log("📦 Objeto de transcrição:", {
      ...transcriptionData,
      text: transcriptionData.text.substring(0, 100) + "...",
    });
  } catch (error) {
    // Atualizar status com erro
    transcriptions.set(transcriptionId, {
      ...transcription,
      status: "error",
      success: false,
      error: error.message,
      completedAt: new Date().toISOString(),
    });
    throw error;
  } finally {
    // Limpar arquivo temporário
    try {
      if (await fs.pathExists(filePath)) {
        await fs.remove(filePath);
        console.log(`🗑️ Arquivo temporário removido: ${filePath}`);
      }
    } catch (cleanupError) {
      console.error("⚠️ Erro ao remover arquivo temporário:", cleanupError);
    }
  }
}

// Endpoint GET para verificar status
router.get("/status", (req, res) => {
  res.json({
    status: "ok",
    message: "Serviço de transcrição disponível",
    supportedFormats: ["mp3", "wav", "mp4", "mov"],
    maxFileSize: "100MB",
  });
});

module.exports = router;
