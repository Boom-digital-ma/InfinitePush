-- Migration: Create SaaS projects table
-- Description: Stores SaaS customers' projects and their BYOS (Supabase) credentials.

CREATE TABLE IF NOT EXISTS public.projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- The SaaS customer (Developer)
    name TEXT NOT NULL,                                        -- e.g., 'K-Syndic App'
    
    -- BYOS Infrastructure (Target Supabase)
    client_supabase_url TEXT NOT NULL,
    client_supabase_key TEXT NOT NULL,                         -- Service Role Key (Encrypted at rest by Supabase)
    
    -- Subscription & Billing (Lemon Squeezy Integration)
    subscription_status TEXT DEFAULT 'trial',                  -- 'active', 'past_due', 'canceled', 'trial'
    plan_type TEXT DEFAULT 'solo',                             -- 'solo', 'agency', 'enterprise'
    lemon_squeezy_customer_id TEXT,
    lemon_squeezy_subscription_id TEXT,
    
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Index for faster lookups by user
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON public.projects(user_id);

-- Enable RLS for security
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only manage their own projects
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'projects' 
        AND policyname = 'Users can manage their own projects'
    ) THEN
        CREATE POLICY "Users can manage their own projects" ON public.projects
        FOR ALL USING (auth.uid() = user_id);
    END IF;
END
$$;

-- Function to handle project creation (Optionally useful for triggers)
COMMENT ON TABLE public.projects IS 'Stores the link between InfinitePush users and their target BYOS infrastructure.';
