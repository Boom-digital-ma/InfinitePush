-- Migration: Add GitHub integration fields to projects
-- Description: Stores GitHub repository info and access tokens for integrated CI/CD.

ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS github_repo TEXT, -- Format: 'owner/repo'
ADD COLUMN IF NOT EXISTS github_branch TEXT DEFAULT 'main',
ADD COLUMN IF NOT EXISTS github_token TEXT; -- Personal Access Token (Encrypted)

COMMENT ON COLUMN public.projects.github_repo IS 'The GitHub repository identifier (e.g., Boom-digital-ma/InfinitePush)';
