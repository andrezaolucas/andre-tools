#!/usr/bin/env node

const concurrently = require("concurrently");
const chalk = require("chalk");
const path = require("path");
const { exec } = require("child_process");

// Obtém o diretório raiz do projeto
const rootDir = path.join(__dirname, "..");
const frontendDir = path.join(rootDir, "frontend");
const backendDir = path.join(rootDir, "backend");

console.log(chalk.blue("🚀 Iniciando Andre Tools..."));

// Função para abrir o navegador
const openBrowser = (url) => {
  const platform = process.platform;
  const cmd =
    platform === "win32"
      ? "start"
      : platform === "darwin"
      ? "open"
      : "xdg-open";

  exec(`${cmd} ${url}`, (error) => {
    if (error) {
      console.error(chalk.red("\n❌ Erro ao abrir o navegador:"), error);
    }
  });
};

// Inicia os serviços concorrentemente
try {
  const { result } = concurrently(
    [
      {
        command: "npm run dev",
        name: "backend",
        cwd: backendDir,
        prefixColor: "blue",
      },
      {
        command: "npm run dev",
        name: "frontend",
        cwd: frontendDir,
        prefixColor: "green",
      },
    ],
    {
      prefix: "name",
      killOthers: ["failure", "success"],
      restartTries: 3,
    }
  );

  // Aguarda 5 segundos para os serviços iniciarem e então abre o navegador
  setTimeout(() => {
    console.log(chalk.yellow("\n🌐 Abrindo Andre Tools no navegador..."));
    openBrowser("http://localhost:3000");
  }, 3000);

  result.then(
    () => {
      console.log(chalk.green("\n✨ Andre Tools encerrado com sucesso!"));
    },
    (err) => {
      console.error(chalk.red("\n❌ Erro ao executar Andre Tools:"), err);
      process.exit(1);
    }
  );
} catch (error) {
  console.error(chalk.red("\n❌ Erro ao iniciar Andre Tools:"), error);
  process.exit(1);
}
