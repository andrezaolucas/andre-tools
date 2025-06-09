# 🚀 Guia de Instalação - Andre Tools

Guia passo-a-passo para executar a aplicação **Andre Tools** em localhost.

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** >= 16.0.0 ([Download](https://nodejs.org/))
- **npm** (incluído com Node.js) ou **yarn**
- **Python** >= 3.7 (para compilação do Whisper)

### Verificar instalação

```bash
node --version    # deve mostrar v16.0.0 ou superior
npm --version     # deve mostrar versão do npm
python --version  # deve mostrar versão do Python
```

## 🛠 Instalação Completa

### 1. Clonar ou navegar para o diretório do projeto

```bash
# Se você clonou o repositório:
cd andre-tools

# Ou se está no diretório atual:
pwd  # deve mostrar o caminho para Andre Tools
```

### 2. Instalar Backend

```bash
# Navegar para pasta do backend
cd backend

# Instalar dependências
npm install

# Baixar modelo Whisper (IMPORTANTE!)
npm run setup

# Voltar para a raiz do projeto
cd ..
```

### 3. Instalar Frontend

```bash
# Navegar para pasta do frontend
cd frontend

# Instalar dependências
npm install

# Voltar para a raiz do projeto
cd ..
```

## 🚀 Executar a Aplicação

### Opção 1: Execução Manual (Recomendada)

Abra **2 terminais** separados:

#### Terminal 1 - Backend

```bash
cd backend
npm run dev
```

Aguarde até ver a mensagem:

```
🚀 Andre Tools Backend rodando em http://localhost:3001
📁 Pasta de uploads: /caminho/para/uploads
🔗 Endpoint de transcrição: http://localhost:3001/api/transcribe
```

#### Terminal 2 - Frontend

```bash
cd frontend
npm run dev
```

Aguarde até ver a mensagem:

```
▲ Next.js 14.0.0
- Local:        http://localhost:3000
- Network:      http://192.168.x.x:3000

✓ Ready in 2.1s
```

### Opção 2: Script Automatizado

Crie um script para executar ambos (opcional):

```bash
# Criar script (Unix/Mac/Linux)
cat > start.sh << 'EOF'
#!/bin/bash
echo "🚀 Iniciando Andre Tools..."

# Função para matar processos ao sair
cleanup() {
    echo "🛑 Parando serviços..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit
}

# Capturar Ctrl+C
trap cleanup SIGINT

# Iniciar backend em background
echo "📡 Iniciando backend..."
cd backend && npm run dev &
BACKEND_PID=$!

# Aguardar backend inicializar
sleep 5

# Iniciar frontend em background
echo "🌐 Iniciando frontend..."
cd ../frontend && npm run dev &
FRONTEND_PID=$!

echo "✅ Aplicação iniciada!"
echo "📱 Frontend: http://localhost:3000"
echo "⚙️  Backend:  http://localhost:3001"
echo ""
echo "Pressione Ctrl+C para parar todos os serviços"

# Manter script rodando
wait
EOF

# Dar permissão de execução
chmod +x start.sh

# Executar
./start.sh
```

## 🌐 Acessar a Aplicação

1. Abra seu navegador
2. Acesse: **http://localhost:3000**
3. Clique em "Transcrição"
4. Faça upload de um arquivo de áudio/vídeo
5. Clique em "Transcrever Arquivo"
6. Aguarde o resultado!

## ✅ Verificar se está funcionando

### 1. Testar Backend

```bash
curl http://localhost:3001/api/health
```

Deve retornar:

```json
{
  "status": "ok",
  "message": "Andre Tools Backend está funcionando!",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 2. Testar Frontend

- Acesse http://localhost:3000
- Deve ver a página inicial do Andre Tools

### 3. Testar Transcrição

- Acesse http://localhost:3000/transcricao
- Faça upload de um arquivo de áudio pequeno
- Verifique se a transcrição funciona

## 🐛 Resolução de Problemas

### Erro: "Cannot find module"

```bash
# Reinstalar dependências
cd backend && rm -rf node_modules package-lock.json && npm install
cd ../frontend && rm -rf node_modules package-lock.json && npm install
```

### Erro: "Port already in use"

```bash
# Verificar processos usando as portas
lsof -i :3000  # Frontend
lsof -i :3001  # Backend

# Matar processos se necessário
kill -9 <PID>
```

### Erro: "Python not found" (nodejs-whisper)

```bash
# macOS com Homebrew
brew install python3

# Ubuntu/Debian
sudo apt update && sudo apt install python3 python3-pip build-essential

# Windows
# Instale Python do site oficial: https://python.org
# Instale ferramentas de build (Visual Studio Build Tools ou MinGW)
```

### Erro: "Whisper model not found"

```bash
# Execute o setup para baixar o modelo
cd backend
npm run setup

# Ou manualmente:
npx nodejs-whisper download
```

### Erro: "make: command not found"

```bash
# macOS
xcode-select --install

# Ubuntu/Debian
sudo apt install build-essential

# Windows
# Instale MinGW-w64 ou MSYS2
```

### Erro: "CORS blocked"

- Verifique se o backend está rodando na porta 3001
- Confirme a configuração de CORS no `backend/server.js`

### Erro: "Module not found" (Frontend)

```bash
cd frontend
npm install --force
```

## 🔧 Configurações Opcionais

### Alterar Portas

#### Backend

Edite `backend/server.js`:

```javascript
const PORT = process.env.PORT || 3002; // Nova porta
```

#### Frontend

Edite `frontend/next.config.js`:

```javascript
async rewrites() {
  return [
    {
      source: '/api/:path*',
      destination: 'http://localhost:3002/api/:path*', // Nova porta do backend
    },
  ]
}
```

### Alterar Modelo Whisper

Edite `backend/routes/transcribe.js`:

```javascript
const whisperOptions = {
  modelName: "small", // tiny, base, small, medium, large
  // ...
};
```

**Modelos disponíveis:**

- `tiny` - Mais rápido, menos preciso (~40MB)
- `base` - Balanceado (~150MB) - **Padrão**
- `small` - Mais preciso (~500MB)
- `medium` - Muito preciso (~1.5GB)
- `large` - Máxima precisão (~3GB)

## 📊 Monitoramento

### Logs do Backend

```bash
cd backend
npm run dev
# Logs aparecerão no terminal
```

### Logs do Frontend

```bash
cd frontend
npm run dev
# Logs aparecerão no terminal
```

## 🎯 Próximos Passos

Após instalar e testar:

1. **Experimente diferentes formatos** de arquivo
2. **Teste com arquivos de diferentes tamanhos**
3. **Explore as funcionalidades** de copiar e download
4. **Verifique a responsividade** em diferentes telas
5. **Personalize** conforme suas necessidades

## 📞 Suporte

Se encontrar problemas:

1. **Verifique os logs** nos terminais
2. **Consulte a seção** de resolução de problemas
3. **Teste com arquivo pequeno** primeiro
4. **Confirme as versões** dos pré-requisitos

---

**🎉 Pronto! Agora você tem o Andre Tools rodando localmente!**

Acesse: **http://localhost:3000** para começar a usar.
