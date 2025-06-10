# Andre Tools - Transcrição, Conversão e Diagramação

Uma aplicação web moderna que oferece transcrição de áudio/vídeo usando Whisper.cpp, conversão entre diferentes formatos de arquivos e criação de diagramas com Excalidraw, desenvolvida com Next.js, React, TypeScript e Node.js.

## 🚀 Funcionalidades

### Transcrição

- Transcrição de áudio/vídeo para texto usando Whisper.cpp
- Suporte para múltiplos formatos (MP3, WAV, MP4, MOV)
- Interface moderna e responsiva
- Feedback visual em tempo real do progresso
- Estimativa de tempo restante
- Processamento otimizado com GPU (Metal no macOS)

### Conversor

- Conversão entre diferentes formatos de áudio
- Conversão de vídeo para áudio
- Conversão entre formatos de imagem
- Conversão de documentos para PDF
- Interface intuitiva para seleção de formatos
- Processamento rápido e otimizado

### Excalidraw

- Criação e edição de diagramas e desenhos
- Integração direta com Excalidraw.com
- Sistema de gerenciamento de arquivos
- Histórico dos últimos 10 arquivos
- Abertura rápida no navegador
- Interface integrada ao sistema

## 🛠️ Tecnologias

### Frontend

- Next.js 14
- React
- TypeScript
- Tailwind CSS
- Lucide Icons

### Backend

- Node.js
- Express
- Whisper.cpp

## 📋 Pré-requisitos

- Node.js 18+
- npm ou yarn
- Whisper.cpp instalado e configurado
- Navegador moderno com suporte a Excalidraw

## 🔧 Instalação

### Instalação Global (Recomendado)

1. Clone o repositório:

```bash
git clone https://github.com/seu-usuario/andre-tools.git
cd andre-tools
```

2. Instale globalmente:

```bash
npm install -g .
```

3. Execute de qualquer lugar:

```bash
andre-tools
```

### Instalação Local (Alternativa)

1. Clone o repositório:

```bash
git clone https://github.com/seu-usuario/andre-tools.git
cd andre-tools
```

2. Instale as dependências do frontend:

```bash
cd frontend
npm install
```

3. Instale as dependências do backend:

```bash
cd ../backend
npm install
```

4. Configure as variáveis de ambiente:

```bash
# Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:3001

# Backend (.env)
PORT=3001
```

## 🚀 Executando o Projeto

### Usando o Comando Global

Simplesmente execute em qualquer terminal:

```bash
andre-tools
```

### Manualmente

1. Inicie o backend:

```bash
cd backend
npm run dev
```

2. Em outro terminal, inicie o frontend:

```bash
cd frontend
npm run dev
```

3. Acesse a aplicação em `http://localhost:3000`

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
