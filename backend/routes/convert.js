const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const fsPromises = require("fs").promises;
const ffmpeg = require("fluent-ffmpeg");
const sharp = require("sharp");
const PDFDocument = require("pdfkit");
const { v4: uuidv4 } = require("uuid");

// Configuração do Multer para upload de arquivos
const upload = multer({
  dest: path.join(__dirname, "..", "uploads"),
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB
  fileFilter: (req, file, cb) => {
    // Lista de tipos MIME aceitos
    const acceptedMimes = [
      "audio/mpeg",
      "audio/wav",
      "audio/opus",
      "audio/ogg",
      "audio/webm",
      "application/ogg",
      "audio/x-opus",
      "audio/x-opus+ogg",
      "video/mp4",
      "video/quicktime",
      "image/jpeg",
      "image/png",
      "text/plain",
    ];

    // Se o arquivo termina com .opus, aceitar independente do tipo MIME
    if (file.originalname.toLowerCase().endsWith(".opus")) {
      return cb(null, true);
    }

    // Verificar se o tipo MIME é aceito
    if (acceptedMimes.includes(file.mimetype)) {
      return cb(null, true);
    }

    // Rejeitar outros tipos de arquivo
    cb(new Error(`Tipo de arquivo não suportado: ${file.mimetype}`));
  },
});

// Formatos suportados para conversão
const SUPPORTED_FORMATS = {
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

// Funções de logging
function logInfo(message, data = {}) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] 📝 [INFO] ${message}`);
  if (Object.keys(data).length > 0) {
    console.log("  📋 Detalhes:", JSON.stringify(data, null, 2));
  }
}

function logError(message, error = null, data = {}) {
  const timestamp = new Date().toISOString();
  console.error(`[${timestamp}] ❌ [ERROR] ${message}`);
  if (Object.keys(data).length > 0) {
    console.error("  📋 Contexto:", JSON.stringify(data, null, 2));
  }
  if (error) {
    console.error("  🔍 Erro original:", error.message);
    if (error.stack) {
      console.error("  📚 Stack trace:", error.stack);
    }
  }
}

// Função para converter imagem usando Sharp
async function convertImage(inputPath, outputPath, format) {
  try {
    logInfo("Iniciando conversão de imagem", {
      input: inputPath,
      output: outputPath,
      format: format,
    });

    const image = sharp(inputPath);

    if (format === "jpg" || format === "jpeg") {
      await image.jpeg({ quality: 90 }).toFile(outputPath);
    } else if (format === "png") {
      await image.png({ quality: 90 }).toFile(outputPath);
    } else if (format === "pdf") {
      // Converter imagem para PDF usando PDFKit
      const doc = new PDFDocument();
      const writeStream = fs.createWriteStream(outputPath);

      doc.pipe(writeStream);

      // Obter dimensões da imagem
      const metadata = await image.metadata();
      const { width, height } = metadata;

      // Ajustar tamanho da página para a imagem
      doc.page.width = width;
      doc.page.height = height;

      // Adicionar imagem ao PDF
      doc.image(inputPath, 0, 0, {
        width: width,
        height: height,
      });

      doc.end();

      await new Promise((resolve, reject) => {
        writeStream.on("finish", resolve);
        writeStream.on("error", reject);
      });
    }

    logInfo("Conversão de imagem concluída com sucesso");
  } catch (error) {
    logError("Erro na conversão de imagem", error);
    throw error;
  }
}

// Função para converter áudio/vídeo
function convertMedia(inputPath, outputPath, format) {
  return new Promise((resolve, reject) => {
    logInfo("Iniciando conversão de mídia", {
      input: inputPath,
      output: outputPath,
      format: format,
    });

    const command = ffmpeg(inputPath);

    if (format === "mp3") {
      logInfo("Configurando conversão para MP3");
      command.toFormat("mp3").audioBitrate("192k").audioChannels(2);
    } else if (format === "wav") {
      logInfo("Configurando conversão para WAV");
      command.toFormat("wav").audioChannels(2);
    } else if (format === "mp4") {
      logInfo("Configurando conversão para MP4");
      command
        .toFormat("mp4")
        .videoCodec("libx264")
        .videoBitrate("1000k")
        .audioCodec("aac")
        .audioBitrate("192k")
        .audioChannels(2)
        .outputOptions([
          "-preset medium",
          "-movflags +faststart",
          "-pix_fmt yuv420p",
        ]);
    }

    command
      .on("start", (commandLine) => {
        logInfo("Comando FFmpeg iniciado", { commandLine });
      })
      .on("progress", (progress) => {
        logInfo("Progresso da conversão", {
          percent: progress.percent,
          frames: progress.frames,
          fps: progress.currentFps,
          kbps: progress.currentKbps,
          time: progress.timemark,
        });
      })
      .on("end", () => {
        logInfo("Conversão de mídia concluída com sucesso", {
          outputPath: outputPath,
        });
        resolve();
      })
      .on("error", (err) => {
        logError("Erro na conversão de mídia", err, {
          input: inputPath,
          output: outputPath,
          format: format,
        });
        reject(err);
      })
      .save(outputPath);
  });
}

// Função para converter documento para PDF
async function convertDocumentToPDF(inputPath, outputPath) {
  try {
    logInfo("Iniciando conversão de documento para PDF", {
      input: inputPath,
      output: outputPath,
    });

    const content = await fsPromises.readFile(inputPath, "utf-8");
    const doc = new PDFDocument();
    const writeStream = fs.createWriteStream(outputPath);

    doc.pipe(writeStream);

    // Configurar fonte e tamanho
    doc.font("Helvetica").fontSize(12);

    // Adicionar metadados
    doc.info.Title = path.basename(inputPath, path.extname(inputPath));
    doc.info.Author = "Andre Tools Converter";
    doc.info.Creator = "Andre Tools";
    doc.info.Producer = "PDFKit";
    doc.info.CreationDate = new Date();

    // Adicionar conteúdo
    doc.text(content, {
      align: "left",
      lineGap: 5,
    });

    doc.end();

    await new Promise((resolve, reject) => {
      writeStream.on("finish", resolve);
      writeStream.on("error", reject);
    });

    logInfo("Conversão de documento para PDF concluída com sucesso");
  } catch (error) {
    logError("Erro na conversão de documento para PDF", error);
    throw error;
  }
}

// Rota de conversão
router.post("/", upload.single("file"), async (req, res) => {
  let inputPath = null;
  let outputPath = null;

  try {
    logInfo("Nova requisição de conversão recebida", {
      originalName: req?.file?.originalname,
      mimeType: req?.file?.mimetype,
      size: req?.file?.size,
      format: req.body.format,
    });

    if (!req.file) {
      throw new Error("Nenhum arquivo enviado");
    }

    const format = req.body.format;
    if (!format) {
      throw new Error("Formato de conversão não especificado");
    }

    let mimeType = req.file.mimetype;

    // Se for um arquivo .opus mas o tipo MIME não está correto
    if (req.file.originalname.toLowerCase().endsWith(".opus")) {
      mimeType = "audio/opus";
    }

    const supportedFormats = SUPPORTED_FORMATS[mimeType];

    logInfo("Verificando formatos suportados", {
      mimeType,
      requestedFormat: format,
      supportedFormats,
      originalName: req.file.originalname,
    });

    if (!supportedFormats || !supportedFormats.includes(format)) {
      throw new Error(`Conversão de ${mimeType} para ${format} não suportada`);
    }

    inputPath = req.file.path;
    const outputFileName = `${uuidv4()}.${format}`;
    outputPath = path.join(path.dirname(inputPath), outputFileName);

    logInfo("Caminhos configurados", {
      inputPath,
      outputPath,
      outputFileName,
    });

    // Determinar tipo de arquivo e converter
    if (mimeType.startsWith("audio/") || mimeType.startsWith("video/")) {
      logInfo("Iniciando conversão de áudio/vídeo", {
        type: mimeType.startsWith("audio/") ? "áudio" : "vídeo",
        inputFormat: path.extname(req.file.originalname),
        outputFormat: format,
      });
      await convertMedia(inputPath, outputPath, format);
    } else if (mimeType.startsWith("image/")) {
      logInfo("Iniciando conversão de imagem", {
        inputFormat: path.extname(req.file.originalname),
        outputFormat: format,
        fileSize: req.file.size,
      });
      await convertImage(inputPath, outputPath, format);
    } else if (mimeType === "text/plain" && format === "pdf") {
      logInfo("Iniciando conversão de texto para PDF", {
        inputSize: req.file.size,
        encoding: req.file.encoding,
      });
      await convertDocumentToPDF(inputPath, outputPath);
    } else {
      throw new Error(`Tipo de arquivo não suportado: ${mimeType}`);
    }

    logInfo("Conversão concluída com sucesso", {
      originalName: req.file.originalname,
      outputFormat: format,
      inputSize: req.file.size,
    });

    // Enviar arquivo convertido como resposta JSON com URL de download
    const downloadFileName = `${
      path.parse(req.file.originalname).name
    }.${format}`;
    res.json({
      downloadUrl: `/downloads/${outputFileName}`,
      filename: downloadFileName,
      filesize: req.file.size,
      timestamp: new Date().toISOString(),
      success: true,
    });

    // Limpar arquivos temporários após um tempo
    setTimeout(() => {
      logInfo("Iniciando limpeza de arquivos temporários", {
        inputPath,
        outputPath,
      });

      Promise.all([
        fsPromises
          .unlink(inputPath)
          .catch((e) => logError("Erro ao deletar arquivo de entrada", e)),
        fsPromises
          .unlink(outputPath)
          .catch((e) => logError("Erro ao deletar arquivo de saída", e)),
      ]).catch((e) => logError("Erro ao limpar arquivos temporários", e));
    }, 5 * 60 * 1000); // 5 minutos para permitir o download
  } catch (error) {
    logError("Erro durante a conversão", error, {
      originalName: req?.file?.originalname,
      mimeType: req?.file?.mimetype,
      size: req?.file?.size,
      format: req.body.format,
    });

    // Limpar arquivo de entrada em caso de erro
    if (inputPath) {
      fsPromises.unlink(inputPath).catch((e) =>
        logError("Erro ao deletar arquivo de entrada após erro", e, {
          inputPath,
        })
      );
    }

    res.status(500).json({
      error: "Erro durante a conversão",
      details: error.message,
    });
  }
});

module.exports = router;
