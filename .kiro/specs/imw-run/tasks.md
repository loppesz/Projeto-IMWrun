# Implementation Plan: IMW Run

## Overview

Plano de implementação incremental do IMW Run: plataforma web mobile-first de corrida cristã com 12 corridas anuais de 5 km. A stack é Next.js 14 + Node.js/TypeScript + PostgreSQL (Supabase) + Redis/BullMQ + Leaflet + OTP via SMS/WhatsApp. Cada tarefa constrói sobre a anterior, garantindo que nenhuma peça fique órfã. Testes de propriedade (fast-check) são sub-tarefas opcionais distribuídas próximas à implementação correspondente.

---

## Tasks

- [x] 1. Setup do projeto (monorepo, tooling, CI)
  - [x] 1.1 Inicializar monorepo com estrutura `apps/web` (Next.js 14) e `apps/api` (Node.js/TypeScript)
    - Configurar `pnpm workspaces` ou `npm workspaces` com `packages/shared` para tipos compartilhados
    - Criar `tsconfig.base.json` compartilhado; instalar ESLint + Prettier com regras unificadas
    - Configurar path aliases (`@imw/shared`, `@imw/api`, `@imw/web`)
    - _Requirements: 14.1_
  - [x] 1.2 Configurar pipeline CI/CD (GitHub Actions)
    - Jobs: lint, type-check, test (Jest/Vitest), build para `api` e `web`
    - Adicionar cache de dependências e artefatos de build
    - _Requirements: 14.1, 14.2_

- [ ] 2. Banco de dados e migrations
  - [x] 2.1 Criar migrations SQL para as 10 tabelas principais
    - Tabelas: `races`, `routes`, `participants`, `registrations`, `run_sessions`, `gps_points`, `achievements`, `participant_achievements`, `admins`, `sheets_sync_queue`
    - Aplicar constraints: `sequence_number BETWEEN 1 AND 12`, `UNIQUE(participant_id, race_id)`, `UNIQUE(phone)`, `UNIQUE(participant_number)`
    - Criar índices: `idx_registrations_phone_race`, `idx_participants_number`, `idx_active_session` (partial), `idx_run_sessions_completed`, `idx_gps_points_session_time`
    - _Requirements: 2.3, 2.4, 13.1, 14.3_
  - [-] 2.2 Criar seed script para dados iniciais
    - Inserir admin padrão com senha bcrypt; inserir 12 corridas com `sequence_number 1–12` e status inicial (`1 = available`, `2–12 = locked`); inserir achievements base
    - _Requirements: 4.3, 11.1_

- [ ] 3. Pacote `@imw/shared` – Tipos e utilitários TypeScript
  - [x] 3.1 Exportar interfaces TypeScript compartilhadas
    - Interfaces: `Race`, `RoutePoint`, `Route`, `Participant`, `Registration`, `RunSession`, `GpsPoint`, `RankingEntry`, `OtpRecord`, `ApiError`
    - Tipos de status: `RaceStatus`, `RunSessionStatus`, `SheetsSyncStatus`
    - _Requirements: 14.1, 14.2_
  - [-] 3.2 Implementar utilitários de validação compartilhados
    - `validatePhone(phone: string): boolean` — 10–11 dígitos
    - `validateAge(age: number): boolean` — 1–120
    - `validateName(name: string): boolean` — 2–100 chars
    - `padParticipantNumber(n: number): string` — zero-pad 4 dígitos
    - _Requirements: 2.1, 2.3, 2.5_
  - [ ]* 3.3 Escrever property tests para utilitários de validação
    - **Property 7: Validação de formulário de inscrição**
    - **Validates: Requirements 2.5**
    - _Framework: fast-check_

- [ ] 4. Backend – Configuração base da API (Express/Fastify + TypeScript)
  - [ ] 4.1 Inicializar servidor HTTP com middleware base
    - Instalar e configurar Express ou Fastify com TypeScript; middleware: CORS, body-parser, helmet, morgan
    - Estrutura de rotas modular: `routes/auth`, `routes/races`, `routes/registrations`, `routes/runs`, `routes/ranking`, `routes/admin`
    - Handler global de erros retornando `ApiError` em pt-BR
    - _Requirements: 14.1, 14.2_
  - [~] 4.2 Configurar conexão PostgreSQL (Supabase) e cliente Redis
    - Pool de conexões PostgreSQL via `pg` ou `@supabase/supabase-js`
    - Cliente Redis via `ioredis`; variáveis de ambiente via `.env` com validação de schema (`zod`)
    - _Requirements: 14.1_
  - [~] 4.3 Configurar BullMQ para a fila de sync com Google Sheets
    - Definir queue `sheets-sync`, worker com concurrency 2, retry strategy: 3 tentativas, intervalo mínimo 30s
    - _Requirements: 3.3, 3.5_


- [ ] 5. Backend – Auth Participante (OTP)
  - [~] 5.1 Implementar `OtpService`
    - `requestOtp(phone, channel)`: valida telefone cadastrado, verifica rate limit (Redis `otp_rate:{phone}` ≤ 5/60min), gera código 6 dígitos, armazena hash no Redis `otp:{phone}` TTL 10min, invalida código anterior se existir, envia via Twilio/Z-API
    - `verifyOtp(phone, code)`: recupera hash Redis, valida expiração, valida tentativas (max 3), emite JWT 30 dias sliding window
    - Retornar `PHONE_NOT_FOUND` sem enviar OTP para telefones não cadastrados
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7, 10.8, 10.9_
  - [~] 5.2 Implementar endpoints `POST /api/auth/request-otp` e `POST /api/auth/verify-otp`
    - Rate limiting via Redis; respostas com códigos `OTP_INVALID`, `OTP_EXPIRED`, `OTP_MAX_ATTEMPTS`, `OTP_RATE_LIMITED`, `PHONE_NOT_FOUND`
    - _Requirements: 10.1, 10.8, 10.9_
  - [ ]* 5.3 Escrever property tests para `OtpService`
    - **Property 26: Propriedades do código OTP gerado** — código com 6 dígitos, TTL 10min, distinto do anterior
    - **Property 27: Limite de tentativas incorretas de OTP** — após 3 incorretas, código invalidado
    - **Property 28: Invalidação de OTP anterior ao solicitar novo**
    - **Property 29: Não envio de OTP para telefone não cadastrado**
    - **Property 30: Rate limiting de solicitações de OTP**
    - **Validates: Requirements 10.2, 10.4, 10.5, 10.6, 10.8, 10.9**

- [ ] 6. Backend – Auth Admin (JWT com email/senha)
  - [~] 6.1 Implementar `AdminAuthService` e endpoints de login/logout
    - `POST /api/admin/auth/login`: verifica email/senha (bcrypt compare), emite JWT admin (24h)
    - `POST /api/admin/auth/logout`: invalida token no Redis
    - Middleware `requireAdminAuth`: valida JWT admin em todas as rotas `/api/admin/**`
    - _Requirements: 11.1, 11.2_
  - [ ]* 6.2 Escrever property tests para proteção de rotas admin
    - **Property 31: Proteção de rotas administrativas** — qualquer rota `/api/admin` sem JWT válido retorna HTTP 401
    - **Validates: Requirements 11.2**


- [ ] 7. Backend – Corridas CRUD e controle de status
  - [~] 7.1 Implementar `RaceService` e endpoints públicos de corridas
    - `GET /api/races`: lista corridas com status; `GET /api/races/:id`: detalhes de uma corrida
    - `GET /api/races/:id/route`: retorna percurso (coordenadas) da corrida
    - _Requirements: 1.2, 1.3, 4.1, 4.2, 5.1_
  - [~] 7.2 Implementar endpoints admin de corridas (CRUD + status)
    - `POST /api/admin/races`, `PUT /api/admin/races/:id`, `DELETE /api/admin/races/:id`
    - `PATCH /api/admin/races/:id/status`: alterna `available` ↔ `locked`
    - `DELETE`: exibir contagem de inscritos/resultados antes de confirmar (resposta 409 com metadados)
    - _Requirements: 11.3, 11.7, 11.9_

- [ ] 8. Backend – Percursos (RouteService)
  - [~] 8.1 Implementar `RouteService` e endpoints de percurso
    - `POST /api/admin/races/:id/route`: valida ≥ 3 pontos, ≤ 500 pontos, persiste `jsonb` na tabela `routes`, atualiza `has_route = true` na corrida
    - `GET /api/races/:id/route`: retorna sequência ordenada de coordenadas
    - _Requirements: 5.3, 5.4, 5.5, 5.6_
  - [ ]* 8.2 Escrever property tests para `RouteService`
    - **Property 12: Round-trip de sequência de percurso** — salvar e recuperar deve retornar sequência idêntica na mesma ordem
    - **Validates: Requirements 5.4, 5.6**

- [ ] 9. Backend – Serviço de Inscrições + Google Sheets sync
  - [~] 9.1 Implementar `RegistrationService`
    - `POST /api/registrations`: valida campos (nome, telefone, idade, checkbox), verifica duplicata por (phone, race_id), gera `participant_number` com zero-pad 4 dígitos (sequência atômica via `SELECT ... FOR UPDATE`), persiste registro, enfileira job BullMQ para Sheets sync
    - Retornar `participant_number` na resposta de sucesso; retornar `PHONE_DUPLICATE` ou `VALIDATION_ERROR` conforme o caso
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8_
  - [~] 9.2 Implementar worker BullMQ `SheetsWorker`
    - Job: inserir linha na aba da corrida correspondente no Google Sheets via `googleapis`
    - Retry: máx 3 tentativas, back-off mínimo 30s; após 3 falhas: marcar `sheets_sync_status = 'failed'` e criar entrada em `sheets_sync_queue`
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_
  - [ ]* 9.3 Escrever property tests para `RegistrationService`
    - **Property 5: Unicidade do número de participante**
    - **Property 6: Round-trip de dados de inscrição**
    - **Property 7: Validação de formulário de inscrição**
    - **Property 8: Rejeição de telefone duplicado por corrida**
    - **Property 9: Resiliência da inscrição ao sync do Sheets**
    - **Property 10: Lógica de retry do sync com Google Sheets**
    - **Validates: Requirements 2.3, 2.4, 2.5, 2.6, 3.3, 3.4, 3.5**

- [~] 10. Checkpoint – Testes de integração: auth + corridas + inscrições
  - Garantir que todos os testes Jest passam para os módulos auth, races, registrations e sheets worker. Verificar migrations e seed no ambiente de teste. Perguntar ao usuário se houver dúvidas.


- [ ] 11. Backend – GPS Validation Service
  - [~] 11.1 Implementar `GpsValidationService` com cálculo Haversine
    - `distanceHaversine(p1: GpsPoint, p2: GpsPoint): number` — metros
    - `isWithinBuffer(point: GpsPoint, route: RoutePoint[], bufferMeters = 30): boolean`
    - `isSpeedValid(p1: GpsPoint, p2: GpsPoint): boolean` — rejeita se > 25 km/h (6,94 m/s)
    - `calculateValidDistance(points: GpsPoint[], route: RoutePoint[]): number` — acumula apenas pontos dentro do buffer com velocidade válida
    - _Requirements: 6.5, 6.6, 6.7, 6.9, 13.2, 13.3_
  - [ ]* 11.2 Escrever property tests para `GpsValidationService`
    - **Property 13: Acúmulo de distância apenas dentro do buffer (30m)**
    - **Property 14: Filtragem de pontos GPS inconsistentes (anti-salto > 25 km/h)**
    - **Property 34: Cálculo server-side da distância válida (anti-fraude)**
    - **Validates: Requirements 6.5, 6.6, 6.7, 6.9, 13.2, 13.3**

- [ ] 12. Backend – Run Sessions (start / track / finish)
  - [~] 12.1 Implementar `RunSessionService` — início e rastreamento
    - `POST /api/runs/start`: verifica participante autenticado, corrida ativa, sem sessão ativa duplicada (partial unique index); cria `run_sessions` com status `active`; inicia chave Redis `run_session:{sessionId}` TTL 4h; registra `device_id` e `user_agent`
    - `POST /api/runs/:sessionId/track`: recebe `{lat, lng, timestamp}`; executa `GpsValidationService`; acumula `valid_distance` no Redis; persiste `gps_point`; retorna `{valid_distance, elapsed_time, on_route}`; finaliza automaticamente se `valid_distance >= 5000`
    - _Requirements: 6.1, 6.2, 6.4, 6.5, 6.6, 6.8, 13.5_
  - [~] 12.2 Implementar finalização de sessão
    - `POST /api/runs/:sessionId/finish`: encerra sessão (manual ou automática); valida `>= 10 gps_points` (caso contrário: `status = rejected`); calcula `avg_pace`; verifica velocidade máxima inter-pontos; marca `completed` ou `pending_review`; atualiza `run_sessions`; dispara lógica de desbloqueio de próxima corrida; retorna dados de conclusão
    - `GET /api/runs/:sessionId/status`: retorna estado atual da sessão Redis
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 13.1, 13.4, 13.6_
  - [ ]* 12.3 Escrever property tests para `RunSessionService`
    - **Property 15: Finalização automática ao atingir 5000m válidos**
    - **Property 16: Corrida concluída se e somente se valid_distance >= 5000m**
    - **Property 17: Cálculo correto do ritmo médio (avg_pace)**
    - **Property 18: Round-trip de dados de resultado de corrida**
    - **Property 33: Persistência completa do histórico GPS para auditoria**
    - **Property 35: Rejeição de sessões com < 10 pontos GPS**
    - **Validates: Requirements 7.1, 7.2, 7.4, 7.6, 7.7, 13.1, 13.6**

- [ ] 13. Backend – Transição de status de corridas + Conquistas
  - [~] 13.1 Implementar `RaceProgressionService`
    - Ao finalizar sessão com `status = completed`: atualizar corrida N para `finished` e corrida N+1 para `available` (se N < 12)
    - Verificar se participante concluiu todas as 12 corridas; desbloquear achievement `IMW RUN 12/12`
    - _Requirements: 4.4, 4.5_
  - [ ]* 13.2 Escrever property tests para progressão de corridas
    - **Property 11: Transição de status de corridas** — corrida N → finished, N+1 → available; N=12 → só N=finished
    - **Property 4: Progressão visual da jornada** — N concluídas → corrida N completed, N+1 unlocked
    - **Validates: Requirements 1.8, 4.4**


- [ ] 14. Backend – Ranking Service
  - [~] 14.1 Implementar `RankingService` e endpoint `GET /api/ranking`
    - Query com `ORDER BY races_completed DESC, total_km DESC, name ASC`
    - Suporte a query params: `filter` (geral/M/F/18-29/30-39/40-49/50-59/60+), `raceId`, `page` (paginação)
    - Resposta contém apenas `position`, `name`, `races_completed`, `total_km` — sem PII
    - Dropdown de corridas: apenas corridas com ao menos 1 `status = completed`
    - Atualização após conclusão: cache invalidado / query atualizada em ≤ 60s
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6_
  - [ ]* 14.2 Escrever property tests para `RankingService`
    - **Property 19: Ordenação correta do ranking** — races_completed DESC → total_km DESC → name ASC
    - **Property 20: Filtros do ranking retornam apenas participantes correspondentes**
    - **Property 21: Dados pessoais sensíveis ausentes do ranking**
    - **Property 22: Filtro de corridas com conclusões**
    - **Validates: Requirements 8.2, 8.3, 8.4, 8.6**

- [ ] 15. Backend – Perfil do Participante + Conquistas
  - [~] 15.1 Implementar `ProfileService` e endpoint `GET /api/profile`
    - Retornar: nome, `races_completed/12`, `total_km` (1 casa decimal), conquistas desbloqueadas com `unlocked_at`, sequência consecutiva atual
    - Verificar autenticação: retornar apenas perfil do próprio participante (403 para acesso a outro ID)
    - `ROUND(races_completed / 12 * 100)` para barra de progresso
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6_
  - [ ]* 15.2 Escrever property tests para `ProfileService`
    - **Property 23: Cálculo correto de métricas do perfil** — progresso, distância total, corridas no formato N/12
    - **Property 24: Conquistas persistidas e recuperáveis no perfil**
    - **Property 25: Isolamento de perfil entre participantes** — participante A não acessa dados de B
    - **Validates: Requirements 9.1, 9.3, 9.4, 9.5, 9.6**

- [ ] 16. Backend – Endpoints Admin (dashboard, inscritos, resultados)
  - [~] 16.1 Implementar endpoints de gestão de inscrições e dashboard
    - `GET /api/admin/races/:id/registrations`: lista inscritos (número, nome, telefone, idade, data)
    - `GET /api/admin/races/:id/registrations/csv`: exporta CSV com os mesmos campos
    - `GET /api/admin/dashboard`: total participantes, corridas concluídas, km registrados, participantes ativos por corrida
    - `GET /api/admin/results/pending`: resultados com `status = pending_review`
    - _Requirements: 11.5, 11.6, 11.8_
  - [ ]* 16.2 Escrever property tests para estatísticas do dashboard
    - **Property 32: Correção das estatísticas do dashboard admin** — valores iguais a queries diretas no banco
    - **Validates: Requirements 11.8**

- [~] 17. Checkpoint – Testes de integração: GPS + sessions + ranking + perfil + admin
  - Garantir que todos os testes Jest passam para os módulos GPS, run sessions, ranking, profile e admin. Verificar Redis e BullMQ no ambiente de teste. Perguntar ao usuário se houver dúvidas.


- [ ] 18. Frontend – Layout base, design system e BottomNav
  - [~] 18.1 Configurar Next.js 14 App Router com Tailwind CSS e design system
    - Criar `app/layout.tsx` raiz com fontes, cores IMW Run (Tailwind config), meta tags globais
    - Implementar `<BottomNav />`: visível em `< 768px`, itens Início/Corridas/Ranking/Percurso/Perfil com indicador de ativo; oculto em `>= 768px`
    - Implementar menu superior/lateral para `>= 768px` com mesmos itens
    - Garantir WCAG 2.1 AA: contraste 4.5:1, área toque 44×44px, navegação por teclado
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_
  - [~] 18.2 Criar componentes de UI reutilizáveis
    - `<ProgressBar />`, `<AchievementBadge />` (animação 1–3s), `<OtpForm />` (campo telefone + 6 dígitos), `<RankingTable />` (filtros mutuamente exclusivos)
    - _Requirements: 1.9, 4.5, 8.3, 9.3, 10.1_

- [ ] 19. Frontend – Página inicial e `<JourneyTrack />`
  - [~] 19.1 Implementar página inicial `app/(public)/page.tsx`
    - Exibir slogan "Corra. Supere seus limites. Faça parte da missão."
    - Se houver corrida `available` ou `ongoing`: exibir data/horário/local/distância + botão "Inscreva-se" + botão "Ver percurso" (somente se `has_route = true`)
    - Se nenhuma corrida disponível: mensagem sem botões
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_
  - [~] 19.2 Implementar `<JourneyTrack />` para exibição das 12 corridas
    - Não autenticado: todos os 12 ícones com cadeado fechado
    - Autenticado: corridas concluídas (✅), corrida N+1 desbloqueada (🔓), demais bloqueadas (🔒)
    - Animação de desbloqueio 1–3s ao desbloquear nova corrida
    - _Requirements: 1.6, 1.7, 1.8, 1.9_
  - [ ]* 19.3 Escrever property tests frontend para exibição condicional
    - **Property 1: Exibição condicional de informações de corrida**
    - **Property 2: Botão "Ver percurso" condicional ao percurso**
    - **Property 3: Jornada bloqueada para não autenticados**
    - **Validates: Requirements 1.2, 1.3, 1.4, 1.5, 1.7**

- [ ] 20. Frontend – Calendário das 12 corridas
  - [~] 20.1 Implementar página `app/(public)/calendar/page.tsx`
    - Cards para cada corrida: número sequencial, nome, data, horário, local, distância, status com badge visual (`Bloqueada`/`Disponível`/`Em andamento`/`Concluída`)
    - Ao completar todas as 12: exibir conquest "IMW RUN 12/12" + animação ≥ 2s
    - _Requirements: 4.1, 4.2, 4.3, 4.5, 4.6_

- [ ] 21. Frontend – Página de inscrição
  - [~] 21.1 Implementar página `app/(public)/race/[id]/page.tsx` com formulário de inscrição
    - Campos: Nome (2–100), Telefone (10–11 dígitos), Idade (1–120), Checkbox de aceite
    - Validação client-side com mensagem por campo; submit chama `POST /api/registrations`
    - Sucesso: exibir número de participante gerado; erro duplicata: mensagem `PHONE_DUPLICATE`
    - _Requirements: 2.1, 2.2, 2.3, 2.5, 2.6, 2.7, 2.8_


- [ ] 22. Frontend – Auth OTP (login participante)
  - [~] 22.1 Implementar página `app/(auth)/login/page.tsx`
    - Step 1: input de telefone + escolha de canal (SMS/WhatsApp) → `POST /api/auth/request-otp`
    - Step 2: input de 6 dígitos → `POST /api/auth/verify-otp`; tratar erros `OTP_INVALID`, `OTP_EXPIRED`, `OTP_MAX_ATTEMPTS`, `OTP_RATE_LIMITED`, `PHONE_NOT_FOUND`
    - Armazenar JWT em cookie HttpOnly; redirect para `/profile` após sucesso
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.8, 10.9_

- [ ] 23. Frontend – Mapa do percurso (`<RouteMap />`)
  - [~] 23.1 Implementar `<RouteMap />` e página `app/(public)/race/[id]/map/page.tsx`
    - Integrar Leaflet + OpenStreetMap; renderizar polilinha a partir das coordenadas de `GET /api/races/:id/route`
    - Marcadores distintos para ponto inicial (verde) e ponto final (vermelho)
    - Se sem percurso cadastrado: mensagem "percurso ainda não foi definido"
    - _Requirements: 5.1, 5.2, 5.6, 5.7_

- [ ] 24. Frontend – Tela de corrida + `<LiveTracker />`
  - [~] 24.1 Implementar página `app/(auth)/run/[raceId]/page.tsx` com rastreamento GPS
    - Botão "Iniciar Corrida" (somente participante autenticado + corrida ativa); solicitar permissão de geolocalização
    - Se permissão negada: mensagem explicativa; manter botão disponível
    - Após início: `POST /api/runs/start` → obter `sessionId`; iniciar `watchPosition` / polling 5s
    - A cada posição: `POST /api/runs/:sessionId/track`; atualizar distância válida, tempo decorrido, posição no mapa
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.8_
  - [~] 24.2 Implementar `<LiveTracker />` — mapa em tempo real + lógica de perda de sinal
    - Exibir posição atual sobre percurso (polilinha); contador de distância válida + timer
    - Se GPS perdido ≤ 60s: aviso de perda de sinal, pausa acúmulo
    - Se GPS perdido > 60s: oferecer botão "Encerrar com km parciais"
    - Botão "Encerrar Corrida": `POST /api/runs/:sessionId/finish`
    - _Requirements: 6.8, 6.10, 6.11, 6.12, 6.13_

- [ ] 25. Frontend – Tela de conclusão de corrida
  - [~] 25.1 Implementar tela de conclusão após `finish`
    - Exibir: tempo total, distância válida, ritmo médio (`avg_pace` em min/km), data, nome do percurso
    - Se `valid_distance >= 5000`: "Corrida concluída!" + marcar no perfil; se < 5000: indicar distância mínima não atingida
    - Confirmar salvamento dos dados; se erro de persistência: mensagem de erro + instruções
    - _Requirements: 7.2, 7.3, 7.4, 7.5, 7.6, 7.7_

- [ ] 26. Frontend – Ranking com filtros
  - [~] 26.1 Implementar página `app/(public)/ranking/page.tsx`
    - Tabela com colunas: Posição, Nome, Corridas Concluídas, Km Acumulados
    - Filtros mutuamente exclusivos: geral, M, F, faixas etárias, corrida específica
    - Dropdown de corridas: apenas as com resultados concluídos
    - Paginação; sem exibição de PII
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.6_

- [ ] 27. Frontend – Perfil do participante
  - [~] 27.1 Implementar página `app/(auth)/profile/page.tsx`
    - Exibir: nome, `N/12` corridas, km acumulados (1 decimal), barra de progresso (0–100 inteiro), conquistas desbloqueadas, sequência consecutiva
    - Visualização das 12 corridas com estados: ✅ Concluída / 🔓 Disponível / 🔒 Bloqueada
    - Proteção de rota: redirect para `/login` se não autenticado
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_


- [ ] 28. Frontend – Área administrativa
  - [~] 28.1 Implementar login admin `app/admin/login/page.tsx`
    - Formulário email/senha; `POST /api/admin/auth/login`; armazenar JWT admin em cookie HttpOnly
    - Middleware Next.js: redirect para `/admin/login` para qualquer rota `/admin/**` sem JWT válido
    - _Requirements: 11.1, 11.2_
  - [~] 28.2 Implementar dashboard admin `app/admin/dashboard/page.tsx`
    - Cards com estatísticas: total participantes, corridas concluídas, km registrados, participantes ativos
    - Lista de registros pendentes de review (`status = pending_review`)
    - Indicadores de sync pendente com Google Sheets
    - _Requirements: 11.8, 3.5_
  - [~] 28.3 Implementar CRUD de corridas e percursos no admin
    - `app/admin/races/page.tsx`: lista corridas com botões criar/editar/excluir/alterar status
    - `app/admin/races/[id]/edit/page.tsx`: formulário de edição (nome, data, horário, local, distância)
    - `app/admin/races/[id]/route/page.tsx`: mapa interativo Leaflet para clicar e adicionar pontos ao percurso; botão salvar + validação ≥ 3 pontos
    - Confirmação de exclusão com contagem de inscritos/resultados
    - _Requirements: 11.3, 11.4, 11.7, 11.9, 5.3, 5.4, 5.5_
  - [~] 28.4 Implementar lista de inscritos e exportação CSV
    - `app/admin/registrations/[raceId]/page.tsx`: tabela com número, nome, telefone, idade, data
    - Botão exportar CSV; dados completos sem omissão
    - _Requirements: 11.5, 11.6_

- [ ] 29. Checkpoint – Testes E2E com Playwright
  - [~] 29.1 Implementar testes E2E Playwright para fluxos críticos
    - Fluxo 1: Inscrição → OTP login → ver perfil
    - Fluxo 2: Admin login → criar corrida → criar percurso → publicar
    - Fluxo 3: Participante inicia corrida → rastreia (mock GPS) → atinge 5km → vê tela de conclusão
    - Fluxo 4: Visualizar ranking com filtros diferentes
    - _Requirements: todos os fluxos principais_
  - [ ]* 29.2 Implementar smoke tests pós-deploy
    - Verificar que todos os endpoints principais retornam status esperado (200/401/etc.)
    - Validar que `GET /api-docs` retorna OpenAPI 3.0 válido
    - Verificar que `/admin` sem auth retorna redirect para login
    - _Requirements: 14.2_

- [ ] 30. Documentação OpenAPI e finalização
  - [~] 30.1 Gerar documentação OpenAPI 3.0 para todos os endpoints
    - Anotar todos os endpoints com JSDoc/decorators ou schema manual: método, caminho, request schema, response schema, requisito de autenticação
    - Servir `GET /api-docs` via Swagger UI ou Redoc
    - _Requirements: 14.2_
  - [~] 30.2 Configurar variáveis de ambiente de produção e deploy scripts
    - Documentar todas as variáveis: `DATABASE_URL`, `REDIS_URL`, `JWT_SECRET`, `TWILIO_*` / `ZAPI_*`, `GOOGLE_SHEETS_*`, `NEXT_PUBLIC_API_URL`
    - Criar `docker-compose.yml` para ambiente local com PostgreSQL + Redis
    - _Requirements: 14.1_

- [~] 31. Checkpoint final – Ensure all tests pass
  - Garantir que todos os testes Jest, Vitest e Playwright passam. Verificar lint e type-check. Perguntar ao usuário se houver dúvidas antes de considerar a implementação concluída.


---

## Notes

- Tarefas marcadas com `*` são opcionais e podem ser puladas para um MVP mais rápido
- Cada property test referencia explicitamente o número da propriedade do `design.md` e o(s) requisito(s) que valida
- Os checkpoints nas tarefas 10, 17 e 31 garantem validação incremental do sistema
- A stack foi definida no `design.md`: Next.js 14 + Node.js/TypeScript + PostgreSQL (Supabase) + Redis + BullMQ + Leaflet + fast-check + Jest + Playwright
- Todo cálculo de distância válida (GPS) é **exclusivamente server-side** (Property 34) — nunca confiar em dados enviados pelo cliente
- O `participant_number` deve ser gerado com lock transacional para garantir unicidade (Property 5)
- Propriedades 1–35 do `design.md` estão distribuídas pelas sub-tarefas opcionais correspondentes ao módulo que implementam

---

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2"] },
    { "id": 1, "tasks": ["2.1", "3.1"] },
    { "id": 2, "tasks": ["2.2", "3.2", "4.1"] },
    { "id": 3, "tasks": ["3.3", "4.2", "4.3"] },
    { "id": 4, "tasks": ["5.1", "6.1", "7.1"] },
    { "id": 5, "tasks": ["5.2", "5.3", "6.2", "7.2", "8.1"] },
    { "id": 6, "tasks": ["8.2", "9.1"] },
    { "id": 7, "tasks": ["9.2", "9.3", "11.1"] },
    { "id": 8, "tasks": ["11.2", "12.1", "13.1"] },
    { "id": 9, "tasks": ["12.2", "12.3", "13.2", "14.1"] },
    { "id": 10, "tasks": ["14.2", "15.1", "16.1"] },
    { "id": 11, "tasks": ["15.2", "16.2", "18.1"] },
    { "id": 12, "tasks": ["18.2", "19.1", "20.1"] },
    { "id": 13, "tasks": ["19.2", "21.1", "22.1"] },
    { "id": 14, "tasks": ["19.3", "23.1", "24.1"] },
    { "id": 15, "tasks": ["24.2", "25.1", "26.1"] },
    { "id": 16, "tasks": ["27.1", "28.1"] },
    { "id": 17, "tasks": ["28.2", "28.3"] },
    { "id": 18, "tasks": ["28.4", "29.1"] },
    { "id": 19, "tasks": ["29.2", "30.1"] },
    { "id": 20, "tasks": ["30.2"] }
  ]
}
```
