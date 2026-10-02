BEGIN;

ALTER TABLE users ALTER COLUMN cpf DROP NOT NULL;
DROP INDEX IF EXISTS users_cpf_idx;
CREATE UNIQUE INDEX users_cpf_idx ON users (cpf) WHERE cpf IS NOT NULL AND cpf <> '';

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE lawyers ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointment_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_daily_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_popular_areas ENABLE ROW LEVEL SECURITY;

CREATE POLICY frontend_users_access ON users FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY frontend_lawyers_access ON lawyers FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY frontend_services_access ON services FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY frontend_appointments_access ON appointments FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY frontend_appointment_logs_access ON appointment_logs FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY frontend_notifications_access ON notifications FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY frontend_site_analytics_access ON site_analytics FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY frontend_daily_visits_access ON analytics_daily_visits FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY frontend_popular_areas_access ON analytics_popular_areas FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

INSERT INTO users (id, name, email, phone, cpf, role, city)
VALUES ('user-admin', 'Administrador Moraes', 'admin@moraes.adv.br', '(11) 3456-7890', '000.000.000-00', 'admin', 'São Paulo - SP')
ON CONFLICT (id) DO UPDATE SET role = EXCLUDED.role;

INSERT INTO site_analytics (id)
VALUES (true)
ON CONFLICT (id) DO NOTHING;

COMMIT;
