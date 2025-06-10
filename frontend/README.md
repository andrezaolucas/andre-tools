# Andre Tools - Frontend

Interface web moderna para transcrição de áudio e vídeo usando Next.js e React.

## 🚀 Instalação

### Pré-requisitos

- **Node.js** >= 16.0.0
- **npm** ou **yarn**

### 1. Instalar dependências

```bash
npm install
```

### 2. Executar em desenvolvimento

```bash
npm run dev
```

A aplicação rodará em **http://localhost:3000**

## 📋 Funcionalidades

### ✅ Implementadas

- **Upload de arquivos** com drag & drop
- **Transcrição offline** usando Whisper.cpp
- **Conversor de formatos** para áudio, vídeo, imagens e documentos
- **Interface responsiva** e moderna
- **Feedback visual** durante processamento
- **Copiar texto** para área de transferência
- **Download** da transcrição em TXT
- **Estatísticas** de palavras e caracteres
- **Tratamento de erros** completo

### 🔄 Planejadas (Em breve)

- Histórico de transcrições e conversões
- Configurações de modelo Whisper
- Modo escuro

## 🛠 Tecnologias

- **Next.js 14** - Framework React
- **React 18** - Biblioteca de UI
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework de CSS
- **Lucide React** - Ícones
- **Axios** - Cliente HTTP

## 📁 Estrutura

```
frontend/
├── src/
│   ├── app/                    # App Router (Next.js 14)
│   │   ├── layout.tsx         # Layout principal
│   │   ├── page.tsx           # Página inicial
│   │   ├── globals.css        # Estilos globais
│   │   ├── transcricao/       # Página de transcrição
│   │   │   └── page.tsx
│   │   └── conversor/         # Página de conversor
│   │       └── page.tsx
│   └── components/            # Componentes React
│       ├── Sidebar.tsx        # Menu lateral
│       ├── TranscriptionUpload.tsx    # Upload para transcrição
│       ├── TranscriptionResult.tsx    # Resultado da transcrição
│       ├── ConversionUpload.tsx       # Upload para conversão
│       └── ConversionResult.tsx       # Resultado da conversão
├── public/                    # Arquivos estáticos
├── package.json
├── next.config.js            # Configuração do Next.js
├── tailwind.config.js        # Configuração do Tailwind
├── tsconfig.json            # Configuração do TypeScript
└── README.md
```

## 🎨 Interface

### Página Inicial

- Dashboard com overview das funcionalidades
- Cards informativos sobre as ferramentas
- Navegação intuitiva

### Página de Transcrição

- **Upload Area**: Drag & drop ou clique para selecionar
- **File Preview**: Visualização do arquivo selecionado
- **Progress Indicator**: Feedback visual do processamento
- **Result Display**: Texto transcrito com opções de ação
- **Error Handling**: Mensagens de erro claras

### Página de Conversor

- **Upload Area**: Drag & drop ou clique para selecionar
- **Format Selection**: Dropdown com formatos suportados
- **Progress Indicator**: Feedback visual do processamento
- **Result Display**: Link para download do arquivo convertido
- **Error Handling**: Mensagens de erro claras

### Componentes

#### `Sidebar`

- Menu de navegação lateral
- Logo da aplicação
- Links para diferentes seções
- Botões de configuração e ajuda

#### `TranscriptionUpload`

- Upload com drag & drop
- Validação de arquivos
- Preview de arquivos selecionados
- Botão de transcrição
- Estados de loading

#### `TranscriptionResult`

- Exibição do texto transcrito
- Botões de copiar e download
- Estatísticas (palavras/caracteres)
- Estados de loading e erro

#### `ConversionUpload`

- Upload com drag & drop
- Validação de arquivos
- Preview de arquivos selecionados
- Seleção de formato de saída
- Botão de conversão
- Estados de loading

#### `ConversionResult`

- Link para download do arquivo convertido
- Informações do arquivo (nome, tamanho)
- Estados de loading e erro

## ⚙️ Configuração

### Next.js Config

O `next.config.js` está configurado para:

- Proxy das chamadas API para o backend
- Otimizações de build
- Strict mode habilitado

### Tailwind CSS

Classes customizadas em `globals.css`:

- `.upload-area` - Estilo da área de upload
- `.loading-spinner` - Spinner de carregamento

### TypeScript

Configurado com:

- Strict mode
- Path mapping para imports limpos
- Otimizações para Next.js

## 🔧 Desenvolvimento

### Scripts disponíveis

```bash
npm run dev    # Desenvolvimento
npm run build  # Build para produção
npm run start  # Executar build de produção
npm run lint   # Verificar código
```

### Padrões de código

- **Componentes funcionais** com hooks
- **TypeScript** para tipagem
- **Props interfaces** bem definidas
- **Error boundaries** para erros
- **Loading states** para UX

### Estrutura de componentes

```typescript
interface ComponentProps {
  // Props tipadas
}

export default function ComponentName({ prop }: ComponentProps) {
  // Estados e hooks
  const [state, setState] = useState();

  // Handlers
  const handleAction = () => {
    // Lógica
  };

  // JSX
  return <div>{/* Conteúdo */}</div>;
}
```

## 🎯 Customização

### Cores (Tailwind)

```css
/* Cores principais */
.text-primary {
  @apply text-blue-600;
}
.bg-primary {
  @apply bg-blue-600;
}
.border-primary {
  @apply border-blue-600;
}

/* Estados */
.text-success {
  @apply text-green-600;
}
.text-error {
  @apply text-red-600;
}
.text-warning {
  @apply text-yellow-600;
}
```

### Layout responsivo

- **Mobile-first** design
- **Breakpoints**: sm, md, lg, xl, 2xl
- **Grid sistema** flexível
- **Menu lateral** responsivo

## 🐛 Resolução de Problemas

### Build falhando

```bash
# Limpar cache e reinstalar
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

### Erros de tipo TypeScript

```bash
# Verificar configuração
npx tsc --noEmit
```

### Problemas de CSS

```bash
# Rebuild do Tailwind
npm run dev
```

### API não conectando

1. Verifique se o backend está rodando na porta 3001
2. Confirme o proxy no `next.config.js`
3. Verifique CORS no backend

## 📱 Responsividade

A aplicação é totalmente responsiva:

- **Desktop** (1024px+): Layout completo com sidebar
- **Tablet** (768px-1023px): Layout adaptado
- **Mobile** (<768px): Menu hambúrguer e layout vertical

## 🚀 Deploy

### Build de produção

```bash
npm run build
npm run start
```

### Variáveis de ambiente

Crie `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```
