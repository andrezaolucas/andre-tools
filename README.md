# Andre Tools - Transcrição de Áudio/Vídeo

Uma aplicação web moderna para transcrição de áudio e vídeo usando Whisper.cpp, desenvolvida com Next.js, React, TypeScript e Node.js.

## 🚀 Funcionalidades

- Transcrição de áudio/vídeo para texto usando Whisper.cpp
- Suporte para múltiplos formatos (MP3, WAV, MP4, MOV)
- Interface moderna e responsiva
- Feedback visual em tempo real do progresso
- Estimativa de tempo restante
- Processamento otimizado com GPU (Metal no macOS)

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

## 🔧 Instalação

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
