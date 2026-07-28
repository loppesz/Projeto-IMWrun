-- =============================================================================
-- IMW Run – Schema Principal (simplificado)
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ---------------------------------------------------------------------------
-- races — as 12 corridas do ano
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS races (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  sequence_number INT         NOT NULL CHECK (sequence_number BETWEEN 1 AND 12),
  name            VARCHAR     NOT NULL,
  race_date       TIMESTAMPTZ NOT NULL,
  location        VARCHAR     NOT NULL,
  distance_meters INT         NOT NULL DEFAULT 5000,
  status          VARCHAR     NOT NULL DEFAULT 'locked'
                              CHECK (status IN ('locked', 'available', 'ongoing', 'finished')),
  has_route       BOOLEAN     NOT NULL DEFAULT FALSE,
  map_url         TEXT,                          -- link externo ou embed do mapa
  photos_url      TEXT,                          -- link da galeria de fotos
  donation_info   TEXT,                          -- texto sobre doação de alimentos
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- participants — quem se inscreveu
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS participants (
  id                 UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_number CHAR(4) NOT NULL,
  name               VARCHAR NOT NULL,
  phone              VARCHAR NOT NULL,
  age                INT     NOT NULL CHECK (age BETWEEN 1 AND 120),
  gender             CHAR(1) CHECK (gender IN ('M', 'F')),
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT uq_participants_number UNIQUE (participant_number),
  CONSTRAINT uq_participants_phone  UNIQUE (phone)
);

-- ---------------------------------------------------------------------------
-- registrations — inscrições por corrida
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS registrations (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_id UUID        NOT NULL REFERENCES participants (id) ON DELETE RESTRICT,
  race_id        UUID        NOT NULL REFERENCES races       (id) ON DELETE RESTRICT,
  group_id       UUID,                          -- preenchido ao escolher grupo
  registered_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT uq_registration UNIQUE (participant_id, race_id)
);

-- ---------------------------------------------------------------------------
-- groups — grupos de corrida por evento
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS groups (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  race_id          UUID        NOT NULL REFERENCES races (id) ON DELETE CASCADE,
  name             VARCHAR     NOT NULL,
  max_size         INT         NOT NULL DEFAULT 10,
  scheduled_start  TIMESTAMPTZ,                  -- horário agendado pelo admin
  started_at       TIMESTAMPTZ,                  -- quando o admin realmente clicou iniciar
  finished_at      TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- FK agora que groups existe
ALTER TABLE registrations
  DROP CONSTRAINT IF EXISTS fk_registration_group;
ALTER TABLE registrations
  ADD CONSTRAINT fk_registration_group
  FOREIGN KEY (group_id) REFERENCES groups (id) ON DELETE SET NULL;

-- ---------------------------------------------------------------------------
-- group_members — quem está em qual grupo
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS group_members (
  group_id       UUID NOT NULL REFERENCES groups       (id) ON DELETE CASCADE,
  participant_id UUID NOT NULL REFERENCES participants  (id) ON DELETE CASCADE,
  present        BOOLEAN NOT NULL DEFAULT FALSE,  -- marcado pelo admin no dia
  PRIMARY KEY (group_id, participant_id)
);

-- ---------------------------------------------------------------------------
-- run_results — resultado de cada participante em cada corrida
-- Preenchido pelo admin ou pelo próprio sistema ao cruzar a linha
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS run_results (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_id UUID        NOT NULL REFERENCES participants (id) ON DELETE RESTRICT,
  race_id        UUID        NOT NULL REFERENCES races       (id) ON DELETE RESTRICT,
  group_id       UUID        REFERENCES groups (id) ON DELETE SET NULL,
  total_seconds  INT         NOT NULL,           -- tempo total em segundos
  valid_km       NUMERIC(5,2) NOT NULL DEFAULT 5.00,
  completed      BOOLEAN     NOT NULL DEFAULT TRUE,
  recorded_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  notes          TEXT,                           -- observações do admin

  CONSTRAINT uq_run_result UNIQUE (participant_id, race_id)
);

-- ---------------------------------------------------------------------------
-- achievements — conquistas disponíveis
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS achievements (
  id          UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  code        VARCHAR NOT NULL UNIQUE,
  name        VARCHAR NOT NULL,
  description TEXT,
  icon        VARCHAR,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- participant_achievements — conquistas desbloqueadas
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS participant_achievements (
  participant_id UUID NOT NULL REFERENCES participants (id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES achievements (id) ON DELETE CASCADE,
  unlocked_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (participant_id, achievement_id)
);

-- ---------------------------------------------------------------------------
-- admins — usuários do painel
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS admins (
  id            UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  email         VARCHAR NOT NULL UNIQUE,
  password_hash VARCHAR NOT NULL,
  last_login    TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- Índices úteis
-- ---------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_registrations_race     ON registrations (race_id);
CREATE INDEX IF NOT EXISTS idx_registrations_group    ON registrations (group_id);
CREATE INDEX IF NOT EXISTS idx_run_results_race       ON run_results   (race_id);
CREATE INDEX IF NOT EXISTS idx_group_members_group    ON group_members (group_id);
CREATE INDEX IF NOT EXISTS idx_groups_race            ON groups        (race_id);
