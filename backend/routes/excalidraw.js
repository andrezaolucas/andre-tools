const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs").promises;
const { exec } = require("child_process");
const multer = require("multer");
const { promisify } = require("util");
const execAsync = promisify(exec);

// Caminho para o arquivo JSON que armazena os arquivos recentes
const RECENT_FILES_PATH = path.join(
  __dirname,
  "..",
  "data",
  "excalidraw-recent.json"
);

// Função para garantir que o arquivo JSON existe
async function ensureRecentFilesExists() {
  try {
    await fs.access(RECENT_FILES_PATH);
  } catch {
    // Se o arquivo não existe, cria com um array vazio
    await fs.mkdir(path.dirname(RECENT_FILES_PATH), { recursive: true });
    await fs.writeFile(RECENT_FILES_PATH, JSON.stringify([], null, 2));
  }
}

// Função para adicionar um arquivo à lista de recentes
async function addToRecentFiles(filePath) {
  await ensureRecentFilesExists();

  let recentFiles = [];
  try {
    const content = await fs.readFile(RECENT_FILES_PATH, "utf-8");
    recentFiles = JSON.parse(content);
  } catch {
    recentFiles = [];
  }

  // Remove o arquivo se já existir na lista
  recentFiles = recentFiles.filter((f) => f.path !== filePath);

  // Adiciona o novo arquivo no início
  recentFiles.unshift({
    path: filePath,
    name: path.basename(filePath),
    lastOpened: new Date().toISOString(),
  });

  // Mantém apenas os 10 arquivos mais recentes
  recentFiles = recentFiles.slice(0, 10);

  // Salva a lista atualizada
  await fs.writeFile(RECENT_FILES_PATH, JSON.stringify(recentFiles, null, 2));
}

// Configuração do multer para upload de arquivos
const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    const uploadDir = path.join(__dirname, "../uploads/excalidraw");
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      console.error("Erro ao criar diretório:", error);
      cb(error, null);
    }
  },
  filename: function (req, file, cb) {
    console.log("Recebendo arquivo:", file.originalname);
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    console.log("Verificando tipo do arquivo:", file.originalname);
    if (file.originalname.endsWith(".excalidraw")) {
      cb(null, true);
    } else {
      cb(new Error("Apenas arquivos .excalidraw são permitidos"), false);
    }
  },
});

// Rota para upload de arquivo
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    console.log("Iniciando upload de arquivo");

    if (!req.file) {
      console.error("Nenhum arquivo recebido");
      return res.status(400).json({ error: "Nenhum arquivo foi enviado" });
    }

    console.log("Arquivo recebido:", req.file);
    const filePath = req.file.path;

    // Adiciona o arquivo à lista de recentes
    const recentFilesPath = path.join(
      __dirname,
      "../data/recent_excalidraw.json"
    );
    let recentFiles = [];

    try {
      const recentFilesData = await fs.readFile(recentFilesPath, "utf8");
      recentFiles = JSON.parse(recentFilesData);
      console.log("Arquivos recentes carregados:", recentFiles.length);
    } catch (error) {
      console.log("Criando nova lista de arquivos recentes");
    }

    // Adiciona o novo arquivo à lista
    const newEntry = {
      path: filePath,
      name: req.file.originalname,
      lastOpened: new Date().toISOString(),
    };

    console.log("Novo arquivo para adicionar:", newEntry);

    // Remove entrada antiga se o arquivo já existir
    recentFiles = recentFiles.filter((file) => file.path !== filePath);

    // Adiciona nova entrada no início da lista
    recentFiles.unshift(newEntry);

    // Mantém apenas os 10 arquivos mais recentes
    recentFiles = recentFiles.slice(0, 10);

    // Salva a lista atualizada
    await fs.writeFile(recentFilesPath, JSON.stringify(recentFiles, null, 2));
    console.log("Lista de arquivos recentes atualizada");

    res.json({
      message: "Arquivo enviado com sucesso",
      filePath: filePath,
    });
  } catch (error) {
    console.error("Erro no upload:", error);
    res.status(500).json({ error: "Erro ao processar o upload do arquivo" });
  }
});

// Rota para listar arquivos recentes
router.get("/recent", async (req, res) => {
  try {
    console.log("Buscando arquivos recentes");
    const recentFilesPath = path.join(
      __dirname,
      "../data/recent_excalidraw.json"
    );
    let recentFiles = [];

    try {
      const recentFilesData = await fs.readFile(recentFilesPath, "utf8");
      recentFiles = JSON.parse(recentFilesData);
      console.log("Arquivos recentes encontrados:", recentFiles.length);
    } catch (error) {
      console.log("Nenhum arquivo recente encontrado");
    }

    res.json(recentFiles);
  } catch (error) {
    console.error("Erro ao listar arquivos recentes:", error);
    res.status(500).json({ error: "Erro ao listar arquivos recentes" });
  }
});

// Rota para abrir arquivo
router.post("/open", async (req, res) => {
  try {
    const { filePath } = req.body;
    console.log("Tentando abrir arquivo:", filePath);

    if (!filePath) {
      console.error("Caminho do arquivo não fornecido");
      return res
        .status(400)
        .json({ error: "Caminho do arquivo não fornecido" });
    }

    // Verifica se o arquivo existe
    try {
      await fs.access(filePath);
      console.log("Arquivo encontrado:", filePath);
    } catch (error) {
      console.error("Arquivo não encontrado:", filePath);
      return res.status(404).json({ error: "Arquivo não encontrado" });
    }

    // Abre o arquivo no navegador padrão
    try {
      console.log("Abrindo arquivo no navegador");
      await execAsync(
        `open -a "Google Chrome" "https://excalidraw.com/#json=${encodeURIComponent(
          await fs.readFile(filePath, "utf8")
        )}"`
      );
    } catch (error) {
      console.error(
        "Erro ao abrir no Chrome, tentando navegador padrão:",
        error
      );
      try {
        await execAsync(
          `open "https://excalidraw.com/#json=${encodeURIComponent(
            await fs.readFile(filePath, "utf8")
          )}"`
        );
      } catch (error) {
        console.error("Erro ao abrir no navegador:", error);
        return res
          .status(500)
          .json({ error: "Erro ao abrir arquivo no navegador" });
      }
    }

    // Atualiza a data de último acesso no arquivo de recentes
    const recentFilesPath = path.join(
      __dirname,
      "../data/recent_excalidraw.json"
    );
    let recentFiles = [];

    try {
      const recentFilesData = await fs.readFile(recentFilesPath, "utf8");
      recentFiles = JSON.parse(recentFilesData);

      // Atualiza a data do arquivo aberto
      recentFiles = recentFiles.map((file) => {
        if (file.path === filePath) {
          return { ...file, lastOpened: new Date().toISOString() };
        }
        return file;
      });

      await fs.writeFile(recentFilesPath, JSON.stringify(recentFiles, null, 2));
      console.log("Data de acesso atualizada para:", filePath);
    } catch (error) {
      console.error("Erro ao atualizar arquivo de recentes:", error);
    }

    res.json({ message: "Arquivo aberto com sucesso" });
  } catch (error) {
    console.error("Erro ao abrir arquivo:", error);
    res.status(500).json({ error: "Erro ao abrir arquivo" });
  }
});

module.exports = router;
