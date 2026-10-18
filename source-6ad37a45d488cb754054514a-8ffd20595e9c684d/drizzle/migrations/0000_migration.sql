CREATE TYPE public.app_role AS ENUM ('admin');
CREATE TABLE public.user_roles (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE, role public.app_role NOT NULL, UNIQUE(user_id, role));
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role) RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION public.grant_owner_admin() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF lower(NEW.email) = 'tymek2008@protonmail.com' THEN
    INSERT INTO public.user_roles(user_id, role) VALUES (NEW.id, 'admin') ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER on_auth_user_created_admin AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.grant_owner_admin();

CREATE TABLE public.teachers (id text PRIMARY KEY, position int NOT NULL DEFAULT 0, name text NOT NULL DEFAULT '', role text NOT NULL DEFAULT '', funkcja text NOT NULL DEFAULT '', wprowadzil text NOT NULL DEFAULT '', cele text NOT NULL DEFAULT '', styl text NOT NULL DEFAULT '', image text);
GRANT SELECT ON public.teachers TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.teachers TO authenticated;
GRANT ALL ON public.teachers TO service_role;
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read" ON public.teachers FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admin write" ON public.teachers FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.admins (id text PRIMARY KEY, position int NOT NULL DEFAULT 0, name text NOT NULL DEFAULT '', role text NOT NULL DEFAULT '', descr text NOT NULL DEFAULT '', image text);
GRANT SELECT ON public.admins TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.admins TO authenticated;
GRANT ALL ON public.admins TO service_role;
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read" ON public.admins FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admin write" ON public.admins FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

INSERT INTO public.teachers (id, position, name, role, funkcja, wprowadzil, cele, styl)
SELECT 't'||g, g, CASE g WHEN 1 THEN 'Dyrektor' WHEN 2 THEN 'Wicedyrektor' ELSE 'Nauczyciel '||(g-2) END, 'xxx',
 'Stanowisko, lata pracy, zakres obowiązków.', 'Modernizacja, nowe zajęcia, lepsza organizacja.', 'Bezpieczeństwo uczniów, rozwój szkoły, nowe projekty.', 'Spokojny, uporządkowany, nastawiony na współpracę.'
FROM generate_series(1,20) g;
INSERT INTO public.admins (id, position, name, role, descr) VALUES
('oliwia',1,'Oliwia Hajduk','Informatyk / Przewodnicząca Szkoły','TIR'),
('tymek',2,'Tymek Czech','Założyciel strony / Informatyk','TIR'),
('pomocnik',3,'Pomocnik / Pomysłodawca','==SZUKAMY==','Cosinus');