-- =============================================================================
-- IMW Run – Initial Schema Migration
-- Requirements: 2.3, 2.4, 13.1, 14.3
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Enable pgcrypto for gen_random_uuid()
-- ---------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ---------------------------------------------------------------------------
-- 1. races
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS races (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  sequence_number  INT         NOT NULL,
  name             VARCHAR     NOT NULL,
  race_date        TIMESTAMPTZ NOT NULL,
  location         VARCHAR     NOT NULL,
  distance_meters  INT         NOT NULL DEFAULT 5000,
  status           VARCHAR     NOT NULL DEFAULT 'locked'
                               CHECK (status IN ('locked', 'available', 'ongoing', 'finished')),
  has_route        BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT chk_sequence_number CHECK (sequence_number BETWEEN 1 AND 12)
);

-- ---------------------------------------------------------------------------
-- 2. routes
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS routes (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  race_id       UUID        NOT NULL REFERENCES races (id) ON DELETE CASCADE,
  points        JSONB       NOT NULL DEFAULT '[]',
  total_points  INT         NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- 3. participants
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS participants (
  id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_number  CHAR(4)     NOT NULL,
  name                VARCHAR     NOT NULL,
  phone               VARCHAR     NOT NULL,
  age                 INT         NOT NULL,
  gender              CHAR(1),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT chk_age    CHECK (age BETWEEN 1 AND 120),
  CONSTRAINT chk_gender CHECK (gender IN ('M', 'F'))
);

-- ---------------------------------------------------------------------------
-- 4. registrations
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS registrations (
  id                    UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_id        UUID        NOT NULL REFERENCES participants (id) ON DELETE RESTRICT,
  race_id               UUID        NOT NULL REFERENCES races       (id) ON DELETE RESTRICT,
  registered_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  sheets_sync_status    VARCHAR     NOT NULL DEFAULT 'pending'
                                    CHECK (sheets_sync_status IN ('pending', 'synced', 'failed')),
  sheets_sync_attempts  INT         NOT NULL DEFAULT 0,

  CONSTRAINT uq_participant_race UNIQUE (participant_id, race_id)
);

-- ---------------------------------------------------------------------------
-- 5. run_sessions
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS run_sessions (
  id                     UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_id         UUID        NOT NULL REFERENCES participants (id) ON DELETE RESTRICT,
  race_id                UUID        NOT NULL REFERENCES races        (id) ON DELETE RESTRICT,
  started_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ended_at               TIMESTAMPTZ,
  valid_distance_meters  INT         NOT NULL DEFAULT 0,
  total_time_seconds     INT         NOT NULL DEFAULT 0,
  avg_pace               NUMERIC(6, 2),
  status                 VARCHAR     NOT NULL DEFAULT 'active'
                                     CHECK (status IN ('active', 'completed', 'manual_stop', 'pending_review', 'rejected')),
  device_id              VARCHAR,
  user_agent             TEXT,
  created_at             TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- 6. gps_points
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS gps_points (
  id              UUID     PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id      UUID     NOT NULL REFERENCES run_sessions (id) ON DELETE CASCADE,
  lat             FLOAT8   NOT NULL,
  lng             FLOAT8   NOT NULL,
  captured_at     BIGINT   NOT NULL,   -- Unix epoch ms
  on_route        BOOLEAN  NOT NULL DEFAULT FALSE,
  distance_delta  FLOAT8   NOT NULL DEFAULT 0
);

-- ---------------------------------------------------------------------------
-- 7. achievements
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS achievements (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  code         VARCHAR     NOT NULL,
  name         VARCHAR     NOT NULL,
  description  TEXT,
  icon         VARCHAR,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT uq_achievement_code UNIQUE (code)
);

-- ---------------------------------------------------------------------------
-- 8. participant_achievements
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS participant_achievements (
  participant_id  UUID        NOT NULL REFERENCES participants  (id) ON DELETE CASCADE,
  achievement_id  UUID        NOT NULL REFERENCES achievements  (id) ON DELETE CASCADE,
  unlocked_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  PRIMARY KEY (participant_id, achievement_id)
);

-- ---------------------------------------------------------------------------
-- 9. admins
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS admins (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  email          VARCHAR     NOT NULL,
  password_hash  VARCHAR     NOT NULL,
  last_login     TIMESTAMPTZ,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT uq_admin_email UNIQUE (email)
);

-- ---------------------------------------------------------------------------
-- 10. sheets_sync_queue
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS sheets_sync_queue (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id  UUID        NOT NULL REFERENCES registrations (id) ON DELETE CASCADE,
  attempts         INT         NOT NULL DEFAULT 0,
  last_error       TEXT,
  next_retry_at    TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- Indexes
-- =============================================================================

-- Unique index: one registration per (participant, race) — redundant with
-- the table constraint above, kept as named index for explicit reference
-- in query plans and documentation.
CREATE UNIQUE INDEX IF NOT EXISTS idx_registrations_phone_race
  ON registrations (participant_id, race_id);

-- Unique index: participant_number must be globally unique
CREATE UNIQUE INDEX IF NOT EXISTS idx_participants_number
  ON participants (participant_number);

-- Unique index: phone must be globally unique across participants
CREATE UNIQUE INDEX IF NOT EXISTS idx_participants_phone
  ON participants (phone);

-- Partial unique index: at most one *active* session per (participant, race)
-- Satisfies Requirement 13.1 / design constraint on run_sessions
CREATE UNIQUE INDEX IF NOT EXISTS idx_active_session
  ON run_sessions (participant_id, race_id)
  WHERE status = 'active';

-- Covering index for ranking / profile queries on completed sessions
CREATE INDEX IF NOT EXISTS idx_run_sessions_completed
  ON run_sessions (participant_id, race_id, status, valid_distance_meters)
  WHERE status = 'completed';

-- Index for ordered GPS point retrieval by session (audit + validation)
CREATE INDEX IF NOT EXISTS idx_gps_points_session_time
  ON gps_points (session_id, captured_at);
