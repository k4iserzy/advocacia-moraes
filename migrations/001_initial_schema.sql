BEGIN;

CREATE TYPE user_role AS ENUM ('client', 'admin');
CREATE TYPE appointment_status AS ENUM ('pendente', 'confirmada', 'reagendada', 'cancelada', 'concluida');
CREATE TYPE appointment_format AS ENUM ('presencial', 'online');
CREATE TYPE notification_type AS ENUM ('info', 'success', 'warning', 'rescheduled', 'cancelled');

CREATE TABLE users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  cpf TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'client',
  city TEXT,
  avatar TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX users_email_lower_idx ON users (LOWER(email));
CREATE UNIQUE INDEX users_cpf_idx ON users (cpf);

CREATE TABLE lawyers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  oab TEXT NOT NULL,
  title TEXT NOT NULL,
  specialty TEXT NOT NULL,
  bio TEXT NOT NULL,
  experience_years INTEGER NOT NULL CHECK (experience_years >= 0),
  education TEXT[] NOT NULL DEFAULT '{}',
  photo TEXT NOT NULL,
  email TEXT NOT NULL,
  instagram TEXT NOT NULL,
  phone TEXT NOT NULL,
  available_days TEXT[] NOT NULL DEFAULT '{}',
  available_hours TEXT[] NOT NULL DEFAULT '{}'
);

CREATE TABLE services (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  icon_name TEXT NOT NULL,
  category TEXT NOT NULL,
  short_desc TEXT NOT NULL,
  full_desc TEXT NOT NULL,
  highlights TEXT[] NOT NULL DEFAULT '{}'
);

CREATE TABLE appointments (
  id TEXT PRIMARY KEY,
  protocol_number TEXT NOT NULL UNIQUE,
  user_id TEXT NOT NULL REFERENCES users(id),
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  client_cpf TEXT NOT NULL,
  lawyer_id TEXT NOT NULL REFERENCES lawyers(id),
  lawyer_name TEXT NOT NULL,
  practice_area TEXT NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  format appointment_format NOT NULL,
  status appointment_status NOT NULL DEFAULT 'pendente',
  notes TEXT,
  cancel_reason TEXT,
  reschedule_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX appointments_user_id_idx ON appointments (user_id);
CREATE INDEX appointments_date_status_idx ON appointments (appointment_date, status);
CREATE UNIQUE INDEX appointments_active_slot_idx
  ON appointments (lawyer_id, appointment_date, appointment_time)
  WHERE status <> 'cancelada';

CREATE TABLE appointment_logs (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  appointment_id TEXT NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  logged_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actor TEXT NOT NULL,
  reason TEXT
);

CREATE INDEX appointment_logs_appointment_id_idx ON appointment_logs (appointment_id, logged_at);

CREATE TABLE notifications (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  notification_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  type notification_type NOT NULL
);

CREATE INDEX notifications_user_read_idx ON notifications (user_id, is_read, notification_date DESC);

CREATE TABLE site_analytics (
  id BOOLEAN PRIMARY KEY DEFAULT TRUE CHECK (id),
  total_visits INTEGER NOT NULL DEFAULT 0 CHECK (total_visits >= 0),
  page_views INTEGER NOT NULL DEFAULT 0 CHECK (page_views >= 0),
  unique_visitors INTEGER NOT NULL DEFAULT 0 CHECK (unique_visitors >= 0),
  registered_users_count INTEGER NOT NULL DEFAULT 0 CHECK (registered_users_count >= 0),
  total_appointments_count INTEGER NOT NULL DEFAULT 0 CHECK (total_appointments_count >= 0),
  confirmed_appointments_count INTEGER NOT NULL DEFAULT 0 CHECK (confirmed_appointments_count >= 0),
  cancelled_appointments_count INTEGER NOT NULL DEFAULT 0 CHECK (cancelled_appointments_count >= 0)
);

CREATE TABLE analytics_daily_visits (
  visit_date DATE PRIMARY KEY,
  visits INTEGER NOT NULL DEFAULT 0 CHECK (visits >= 0),
  bookings INTEGER NOT NULL DEFAULT 0 CHECK (bookings >= 0)
);

CREATE TABLE analytics_popular_areas (
  area TEXT PRIMARY KEY,
  count INTEGER NOT NULL DEFAULT 0 CHECK (count >= 0)
);

COMMIT;