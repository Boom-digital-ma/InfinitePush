-- Migration: Add API Key to projects and populate existing ones
-- Description: Ensures all projects (new and existing) have a unique API key for CI/CD.

ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS api_key TEXT UNIQUE DEFAULT 'ip_' || encode(gen_random_bytes(24), 'hex');

-- Explicitly populate existing rows that might have NULL api_key
UPDATE public.projects 
SET api_key = 'ip_' || encode(gen_random_bytes(24), 'hex')
WHERE api_key IS NULL;

-- Index for fast lookup during API calls
CREATE INDEX IF NOT EXISTS idx_projects_api_key ON public.projects(api_key);

COMMENT ON COLUMN public.projects.api_key IS 'Secret key for CI/CD deployments via InfinitePush API.';
