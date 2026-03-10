-- Migration: Create user profiles and centralized subscription management
-- Description: Centralizes subscription data at the user level for the InfinitePush SaaS.

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),

    -- Lemon Squeezy Global Subscription Info
    subscription_status TEXT DEFAULT 'free',                  -- 'free', 'active', 'past_due', 'canceled', 'on_hold'
    plan_name TEXT DEFAULT 'Free',                            -- 'Free', 'Pro', 'Enterprise'
    variant_id TEXT,                                          -- Lemon Squeezy Variant ID (Product ID)
    lemon_squeezy_customer_id TEXT,
    lemon_squeezy_subscription_id TEXT,
    
    -- Quotas (can be updated based on plan)
    max_projects INTEGER DEFAULT 1,                           -- Free: 1 project, Pro: Unlimited or more
    deployment_limit_monthly INTEGER DEFAULT 50               -- Free: 50 deployments/mo
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view and update their own profile
CREATE POLICY "Users can manage their own profile" ON public.profiles
FOR ALL USING (auth.uid() = id);

-- Trigger to automatically create a profile when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Indexing for speed
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_status ON public.profiles(subscription_status);
