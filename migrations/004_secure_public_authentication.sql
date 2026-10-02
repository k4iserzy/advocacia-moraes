BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

CREATE OR REPLACE FUNCTION public.authenticate_public_user(p_email TEXT, p_password TEXT)
RETURNS TABLE (id TEXT, name TEXT, email TEXT, phone TEXT, cpf TEXT, role user_role, city TEXT, avatar TEXT, created_at TIMESTAMPTZ)
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public, extensions
AS $$
  SELECT u.id, u.name, u.email, u.phone, u.cpf, u.role, u.city, u.avatar, u.created_at
  FROM public.users u
  WHERE lower(u.email) = lower(p_email)
    AND u.password_hash = encode(digest(convert_to(p_password, 'UTF8'), 'sha256'), 'hex');
$$;

CREATE OR REPLACE FUNCTION public.register_public_user(
  p_id TEXT, p_name TEXT, p_email TEXT, p_phone TEXT, p_cpf TEXT, p_password TEXT, p_city TEXT
)
RETURNS TABLE (id TEXT, name TEXT, email TEXT, phone TEXT, cpf TEXT, role user_role, city TEXT, avatar TEXT, created_at TIMESTAMPTZ)
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public, extensions
AS $$
  INSERT INTO public.users (id, name, email, phone, cpf, password_hash, city, role)
  VALUES (p_id, p_name, p_email, p_phone, p_cpf, encode(digest(convert_to(p_password, 'UTF8'), 'sha256'), 'hex'), p_city, 'client')
  ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, phone = EXCLUDED.phone, cpf = EXCLUDED.cpf, password_hash = EXCLUDED.password_hash, city = EXCLUDED.city
  RETURNING users.id, users.name, users.email, users.phone, users.cpf, users.role, users.city, users.avatar, users.created_at;
$$;

REVOKE ALL ON FUNCTION public.authenticate_public_user(TEXT, TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.register_public_user(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.authenticate_public_user(TEXT, TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.register_public_user(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT) TO anon, authenticated;

COMMIT;