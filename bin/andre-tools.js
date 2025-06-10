#!/usr/bin/env node

const concurrently = require("concurrently");
const chalk = require("chalk");
const path = require("path");

// Obtém o diretório raiz do projeto
const rootDir = path.join(__dirname, "..");
const frontendDir = path.join(rootDir, "frontend");
const backendDir = path.join(rootDir, "backend");

console.log(chalk.blue("🚀 Iniciando Andre Tools..."));

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
