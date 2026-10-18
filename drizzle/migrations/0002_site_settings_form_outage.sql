CREATE TABLE public.site_settings (id text PRIMARY KEY, form_outage boolean NOT NULL DEFAULT false);
GRANT SELECT ON public.site_settings TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read" ON public.site_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admin write" ON public.site_settings FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
INSERT INTO public.site_settings (id, form_outage) VALUES ('main', false);
