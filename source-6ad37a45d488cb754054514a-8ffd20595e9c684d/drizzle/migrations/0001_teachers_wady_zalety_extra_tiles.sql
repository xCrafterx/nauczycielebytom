ALTER TABLE public.teachers
  ADD COLUMN wady text NOT NULL DEFAULT '',
  ADD COLUMN zalety text NOT NULL DEFAULT '',
  ADD COLUMN extra jsonb NOT NULL DEFAULT '[]'::jsonb;