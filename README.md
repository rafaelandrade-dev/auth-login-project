# UserHub — Frontend

Uma plataforma moderna e elegante para gestão de usuários e controle de acesso, construída com foco em UX premium e segurança.

## 🚀 Como rodar

### Pré-requisitos
- Node.js 18 ou superior
- npm ou yarn

### Passo a passo
1. **Clone o repositório:**
   ```bash
   git clone https://github.com/rafaelandrade-dev/auth-login-project.git
   ```

2. **Configure as variáveis de ambiente:**
   Copie o arquivo `.env.example` para `.env` e preencha a URL da API:
   ```bash
   cp .env.example .env
   # VITE_API_URL=http://localhost:3001
   ```

3. **Instale as dependências:**
   ```bash
   npm install
   ```

4. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

5. **Rodar o Backend:**
   O backend é um servidor simulado usando `json-server`. Vá para a pasta do backend e rode:
   ```bash
   cd ../json-server-teste
   npm install
   npm start
   ```

---

## 🏗️ Decisões Arquiteturais

- **Vite + React + TypeScript**: Escolhido em vez de Next.js por ser uma Single Page Application (SPA) pura, sem necessidade de SSR/SSG. Oferece build extremamente rápido e tipagem robusta.
- **Axios + Interceptors**: Centralização de chamadas de API com tratamento automático de tokens `Bearer` e redirecionamento de logout em caso de erro `401 (Unauthorized)`.
- **React Query (TanStack Query)**: Gerenciamento de estado assíncrono, cache inteligente, invalidação automática e estados nativos de `loading`/`error`.
- **Zod + React Hook Form**: Validação de formulários *type-safe* com excelente experiência de desenvolvimento e mensagens de erro amigáveis.
- **Proteção de Rotas**: Implementação de `PublicOnlyRoute` (para login/cadastro) e `ProtectedRoute` (para áreas restritas) usando React Router v6.
- **Gestão de Sessão**: Token JWT armazenado em `localStorage` com verificação de expiração no carregamento inicial do contexto de autenticação.
- **Design System**: Interface focada em estética *Premium Dark*, utilizando uma paleta de tons índigo e violeta, com componentes altamente reutilizáveis e animações fluidas.

---

## 📁 Estrutura de Pastas

```text
src/
├── api/        # Clientes Axios, interceptores e serviços de API
├── components/ # Componentes de UI reutilizáveis e Modais
├── contexts/   # Contextos do React (AuthContext)
├── hooks/      # Hooks customizados
├── lib/        # Utilitários e configurações (utils, schemas)
├── pages/      # Componentes de página (Home, Login, Cadastro)
├── routes/     # Configuração de rotas e proteção
└── types/      # Definições de tipos TypeScript
```

---

## 🔐 Fluxo de Autenticação

1. **Login**: O usuário insere as credenciais → `auth.service` envia para a API.
2. **Token**: A API retorna um JWT que é salvo no `localStorage` e no `AuthContext`.
3. **Interceptor**: O `apiClient` anexa o token automaticamente em todas as requisições via interceptor de request.
4. **401 Unauthorized**: Se o token expirar ou for inválido, o interceptor de response captura o erro 401.
5. **Logout**: O sistema limpa o `localStorage`, reseta o estado global e redireciona o usuário para a tela de login.

---

## 📸 Screenshots

<img width="2552" height="1293" alt="image" src="https://github.com/user-attachments/assets/d5c3a606-bef5-4b15-91d8-6cafb0920e6c" />
<img width="2555" height="1299" alt="image" src="https://github.com/user-attachments/assets/82150a34-bf9e-459c-838d-ede2f6be2d4f" />
<img width="2550" height="1303" alt="image" src="https://github.com/user-attachments/assets/94f03eba-de9b-4fe4-87c6-35d4f9af0306" />


---

Desenvolvido por [Rafael Andrade](https://github.com/rafaelandrade-dev).
