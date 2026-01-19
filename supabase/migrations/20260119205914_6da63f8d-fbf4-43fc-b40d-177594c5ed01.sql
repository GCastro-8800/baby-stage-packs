-- Tabla para capturar leads del MVP
CREATE TABLE public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  plan TEXT NOT NULL,
  postal_code TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(email)
);

-- Habilitar RLS
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Política: permitir inserciones anónimas (landing pública sin auth)
CREATE POLICY "Allow anonymous inserts" 
ON public.leads 
FOR INSERT 
TO anon 
WITH CHECK (true);