# 🔧 Correção Rápida - Problema Backend

## Problema Identificado

Erro: `npm error notarget No matching version found for node-whisper@^1.2.0`

## ✅ Solução (Já Aplicada)

O problema foi corrigido atualizando para a biblioteca `nodejs-whisper` que funciona corretamente.

### O que foi alterado:

1. **package.json do backend**: Trocado `node-whisper` por `nodejs-whisper`
2. **routes/transcribe.js**: Atualizada a API para usar `nodewhisper`
3. **Adicionado script de setup**: Para baixar o modelo Whisper

## 🚀 Instalação Corrigida

### 1. Instalar dependências do backend

```bash
cd backend
npm install
```

### 2. Baixar modelo Whisper (OBRIGATÓRIO)

```bash
npm run setup
```

**Importante:** Este comando baixa o modelo Whisper (~150MB). É executado apenas uma vez.

### 3. Executar backend

```bash
npm run dev
```

### 4. Instalar e executar frontend (em outro terminal)

```bash
cd frontend
npm install
npm run dev
```

## ✅ Verificar se funciona

1. **Backend**: http://localhost:3001/api/health
2. **Frontend**: http://localhost:3000
3. **Teste transcrição** com arquivo pequeno

## 🛠 Se ainda houver problemas

### Erro de compilação (build tools)

```bash
# macOS
xcode-select --install

# Ubuntu/Debian
sudo apt update && sudo apt install build-essential

# Windows
# Instale Visual Studio Build Tools ou MinGW-w64
```

### Erro de Python

```bash
# Verifique se Python está instalado
python --version

# Se não estiver, instale:
# macOS: brew install python3
# Ubuntu: sudo apt install python3
# Windows: https://python.org
```

### Limpeza completa (último recurso)

```bash
cd backend
rm -rf node_modules package-lock.json
npm install
npm run setup
npm run dev
```

## 📋 Arquivos Alterados

- ✅ `backend/package.json` - Dependência corrigida
- ✅ `backend/routes/transcribe.js` - API atualizada
- ✅ Documentação atualizada

**🎉 O backend agora deve funcionar perfeitamente!**
