const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs-extra");

// Importar routes
const transcribeRoutes = require("./routes/transcribe");
const convertRoutes = require("./routes/convert");
const excalidrawRoutes = require("./routes/excalidraw");

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000", // Frontend URL
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Criar pasta para uploads temporários
const uploadsDir = path.join(__dirname, "uploads");
const convertedDir = path.join(uploadsDir, "converted");
fs.ensureDirSync(uploadsDir);
fs.ensureDirSync(convertedDir);

// Routes
app.use("/api/transcribe", transcribeRoutes);
app.use("/api/convert", convertRoutes);
app.use("/api/excalidraw", excalidrawRoutes);

// Servir arquivos convertidos
app.use("/downloads", express.static(uploadsDir));

// Endpoint de teste
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Andre Tools Backend está funcionando!",
    timestamp: new Date().toISOString(),
  });
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error("Erro no servidor:", err.stack);

  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      error: "Arquivo muito grande. Tamanho máximo: 100MB",
    });
  }

  if (err.code === "LIMIT_UNEXPECTED_FILE") {
    return res.status(400).json({
      error: "Tipo de arquivo não suportado",
    });
  }

  res.status(500).json({
    error: "Erro interno do servidor",
    message:
      process.env.NODE_ENV === "development" ? err.message : "Algo deu errado",
  });
});

// Middleware para rotas não encontradas
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Endpoint não encontrado",
    message: `Rota ${req.originalUrl} não existe`,
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Andre Tools Backend rodando em http://localhost:${PORT}`);
  console.log(`📁 Pasta de uploads: ${uploadsDir}`);
  console.log(
    `🔗 Endpoint de transcrição: http://localhost:${PORT}/api/transcribe`
  );
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("📴 Desligando servidor...");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("📴 Desligando servidor...");
  process.exit(0);
});
