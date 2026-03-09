import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { deployment_id, project_id, device_platform, version, device_id } = body;

    if (!deployment_id || !project_id) {
      return NextResponse.json({ error: 'Missing metadata' }, { status: 400 });
    }

    // Use Service Role to bypass RLS for insertion
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { error } = await supabase.from('analytics_installs').insert({
      deployment_id,
      project_id,
      device_platform,
      version,
      device_id
    });

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Analytics Ping Error:', err.message);
    return NextResponse.json({ error: 'Failed to log install' }, { status: 500 });
  }
}
