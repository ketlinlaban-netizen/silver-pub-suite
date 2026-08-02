ALTER TABLE public.dispensing_units ADD COLUMN IF NOT EXISTS price_per_unit numeric NOT NULL DEFAULT 0;
ALTER TABLE public.dispensing_sessions ADD COLUMN IF NOT EXISTS price_per_unit_snapshot numeric NOT NULL DEFAULT 0;
ALTER TABLE public.dispensing_sessions ADD COLUMN IF NOT EXISTS opening_revenue numeric NOT NULL DEFAULT 0;