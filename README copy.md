# IMW Run

Plataforma web mobile-first de corrida e caminhada organizada pela igreja, com jornada anual de 12 corridas de 5 km.

## Estrutura do Monorepo

```
imw-run/
├── apps/
│   ├── web/          # Next.js 14 (App Router) + Tailwind CSS
│   └── api/          # Node.js / Express + TypeScript
├── packages/
│   └── shared/       # Tipos TypeScript e utilitários compartilhados (@imw/shared)
├── tsconfig.base.json
├── .eslintrc.js
├── .prettierrc.json
└── turbo.json
```

## Pré-requisitos

- Node.js >= 20
- npm >= 10 (workspaces nativos)
- PostgreSQL (via Supabase ou instância local)
- Redis

## Instalação

```bash
npm install
```

## Desenvolvimento

```bash
# Todos os apps em paralelo
npm run dev

# App específico
npm run dev --workspace=apps/web
npm run dev --workspace=apps/api
```

## Comandos úteis

```bash
npm run build          # Build de todos os workspaces
npm run lint           # ESLint em todos os workspaces
npm run type-check     # Type-check TypeScript em todos os workspaces
npm run test           # Testes em todos os workspaces
npm run format         # Formatar com Prettier
```

## Variáveis de ambiente

Copie os arquivos `.env.example` de cada app:

```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
```

## Path Aliases

| Alias | Origem |
|---|---|
| `@imw/shared` | `packages/shared/src/index.ts` |
| `@imw/api/*` | `apps/api/src/*` |
| `@imw/web/*` | `apps/web/src/*` |
| `@/*` | `apps/web/src/*` (dentro do web) |

## Stack

| Camada | Tecnologia |
|---|---|
| Frontend | Next.js 14 (App Router) + Tailwind CSS |
| Backend | Express + TypeScript |
| Banco de dados | PostgreSQL (Supabase) |
| Cache / Filas | Redis + BullMQ |
| Mapa | Leaflet + OpenStreetMap |
| Autenticação participante | OTP 6 dígitos via SMS/WhatsApp |
| Autenticação admin | JWT email/senha (bcrypt) |
| Testes | Vitest + fast-check (property-based) + Playwright |
