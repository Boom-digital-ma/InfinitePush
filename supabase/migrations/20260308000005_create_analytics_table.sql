-- Migration: Create Analytics table
-- Description: Stores logs of successful app updates (pings from mobile apps).

CREATE TABLE IF NOT EXISTS public.analytics_installs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now(),
    
    -- Link to the deployment (on the client side)
    -- Note: Since deployments are on client DBs, we store the ID as a string/UUID
    deployment_id UUID NOT NULL,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    
    -- Metadata about the device
    device_platform TEXT, -- 'ios', 'android', 'web'
    version TEXT,         -- The version that was installed
    
    -- Unique device ID (optional, to avoid duplicate pings)
    device_id TEXT
);

-- Index for fast counting
CREATE INDEX IF NOT EXISTS idx_analytics_deployment ON public.analytics_installs(deployment_id);
CREATE INDEX IF NOT EXISTS idx_analytics_project ON public.analytics_installs(project_id);

-- Security: Allow PUBLIC INSERT (Anonymous pings from mobile apps)
ALTER TABLE public.analytics_installs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous pings" 
ON public.analytics_installs FOR INSERT 
TO anon
WITH CHECK (true);

-- Security: Only the project owner can read the stats
CREATE POLICY "Project owners can view their analytics" 
ON public.analytics_installs FOR SELECT 
USING (
    project_id IN (
        SELECT id FROM public.projects WHERE user_id = auth.uid()
    )
);
