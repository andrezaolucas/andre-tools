# Andre Tools - Backend

API REST para transcrição de áudio e vídeo usando Whisper.cpp localmente.

## 🚀 Instalação

### Pré-requisitos

- **Node.js** >= 16.0.0
- **npm** ou **yarn**
- **Python** (para compilação do node-whisper)
- **FFmpeg** (para conversão de áudio/vídeo)

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar Whisper

```bash
# Baixar modelo Whisper (obrigatório na primeira vez)
npm run setup
```

**Importante:** O modelo será baixado (~150MB) na primeira execução do setup.

### 3. Executar em desenvolvimento

```bash
npm run dev
```

O servidor rodará em **http://localhost:3001**

## 📋 Endpoints

### `GET /api/health`

Verifica se o servidor está funcionando.

**Resposta:**

```json
{
  "status": "ok",
  "message": "Andre Tools Backend está funcionando!",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### `POST /api/transcribe`

Transcreve arquivo de áudio/vídeo.

**Request:**

- Content-Type: `multipart/form-data`
- Campo: `audio` (arquivo)

**Resposta de sucesso:**

```json
{
  "success": true,
  "text": "Texto transcrito do arquivo...",
  "filename": "arquivo.mp3",
  "filesize": 1234567,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Resposta de erro:**

```json
{
  "success": false,
  "error": "Mensagem de erro",
  "details": "Stack trace (apenas em desenvolvimento)"
}
```

### `POST /api/convert`

Converte arquivos entre diferentes formatos.

**Request:**

- Content-Type: `multipart/form-data`
- Campo: `file` (arquivo)
- Campo: `conversionType` (formato de saída)

**Formatos suportados:**

- Áudio/Vídeo: mp4→mp3, mov→mp3, opus→mp3, wav→mp3
- Imagem: heic→jpg/png, png↔jpg, imagem→pdf
- Documento: docx→pdf, txt→pdf

**Resposta de sucesso:**

```json
{
  "downloadUrl": "/downloads/converted/arquivo-convertido.mp3",
  "filename": "arquivo.mp4",
  "filesize": 1234567,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Resposta de erro:**

```json
{
  "error": "Mensagem de erro",
  "details": "Stack trace (apenas em desenvolvimento)"
}
```

### `GET /api/transcribe/status`

Verifica status do serviço de transcrição.

**Resposta:**

```json
{
  "status": "ok",
  "message": "Serviço de transcrição disponível",
  "supportedFormats": ["mp3", "wav", "mp4", "mov"],
  "maxFileSize": "100MB"
}
```

## 🛠 Tecnologias

- **Express.js** - Framework web
- **Multer** - Upload de arquivos
- **nodejs-whisper** - Binding do Whisper.cpp
- **fluent-ffmpeg** - Conversão de áudio/vídeo
- **sharp** - Processamento de imagens
- **fs-extra** - Operações de sistema de arquivos
- **cors** - Cross-Origin Resource Sharing

## 📁 Estrutura

```
backend/
├── server.js           # Servidor principal
├── routes/
│   ├── transcribe.js   # Routes de transcrição
│   └── convert.js      # Routes de conversão
├── uploads/            # Pasta temporária (criada automaticamente)
│   └── converted/      # Arquivos convertidos
├── package.json
└── README.md
```

## ⚙️ Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` (opcional):

```env
PORT=3001
NODE_ENV=development
MAX_FILE_SIZE=104857600  # 100MB em bytes
```

### Modelos Whisper

O `node-whisper` suporta diferentes modelos:

- `tiny` - Mais rápido, menos preciso
- `base` - Balanceado (padrão)
- `small` - Mais preciso, mais lento
- `medium` - Muito preciso, lento
- `large` - Máxima precisão, muito lento

Para alterar o modelo, edite `routes/transcribe.js`:

```javascript
const whisperOptions = {
  modelName: "small", // Altere aqui
  // ...
};
```

## 🐛 Resolução de Problemas

### Erro: "Whisper não encontrado"

1. Reinstale as dependências:

```bash
rm -rf node_modules package-lock.json
npm install
```

2. Verifique se o Python está instalado:

```bash
python --version
# ou
python3 --version
```

### Erro: "Arquivo muito grande"

- Aumente o limite em `routes/transcribe.js`:

```javascript
limits: {
  fileSize: 200 * 1024 * 1024; // 200MB
}
```

### Erro: "Formato não suportado"

- Verifique se o arquivo é um dos formatos suportados
- Adicione novos tipos MIME em `routes/transcribe.js`

## 📝 Scripts

- `npm start` - Produção
- `npm run dev` - Desenvolvimento (com nodemon)
- `npm test` - Testes (não implementado)
