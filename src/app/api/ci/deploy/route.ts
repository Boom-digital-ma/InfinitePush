import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// SaaS Admin client to check project credentials
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Missing or invalid API Key' }, { status: 401 });
    }

    const apiKey = authHeader.replace('Bearer ', '');
    const formData = await req.formData();
    
    const projectId = formData.get('project_id') as string;
    const version = formData.get('version') as string;
    const channel = formData.get('channel') as string || 'production';
    const is_mandatory = formData.get('is_mandatory') === 'true';
    const file = formData.get('file') as File;

    if (!projectId || !version || !file) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // 1. Validate Project & API Key
    const { data: project, error: projectError } = await supabaseAdmin
      .from('projects')
      .select('*, profiles(subscription_status, deployment_limit_monthly)')
      .eq('id', projectId)
      .eq('api_key', apiKey)
      .single();

    if (projectError || !project) {
      return NextResponse.json({ error: 'Unauthorized: Project not found or invalid API Key' }, { status: 403 });
    }

    // 2. Check Subscription Quota (Paywall Security)
    const profile = (project as any).profiles;
    if (profile.subscription_status !== 'active') {
        // Here you could count monthly deployments and block if limit reached for Free users
        // For now, we allow but this is where your business logic lives
    }

    // 3. Connect to Client's Supabase (BYOS)
    const clientSupabase = createClient(
      project.client_supabase_url,
      project.client_supabase_key
    );

    const fileName = `updates/${channel}/${version}/update.zip`;

    // 4. Upload ZIP to Client's Storage
    const { error: uploadError } = await clientSupabase.storage
      .from('infinite-push')
      .upload(fileName, file, {
        upsert: true,
        contentType: 'application/zip',
      });

    if (uploadError) {
      return NextResponse.json({ error: `Upload to client storage failed: ${uploadError.message}` }, { status: 500 });
    }

    const { data: { publicUrl } } = clientSupabase.storage
      .from('infinite-push')
      .getPublicUrl(fileName);

    // 5. Clean up & Register Deployment (The "Secret" logic)
    // Deactivate old versions
    await clientSupabase
      .from('infinite_push_deployments')
      .update({ status: 'inactive' })
      .eq('channel', channel);

    // Insert new active version
    const { error: deploymentError } = await clientSupabase
      .from('infinite_push_deployments')
      .insert({
        version,
        build_number: Math.floor(Date.now() / 1000),
        zip_url: publicUrl,
        channel,
        status: 'active',
        is_mandatory,
      });

    if (deploymentError) {
      return NextResponse.json({ error: `Registry update failed: ${deploymentError.message}` }, { status: 500 });
    }

    console.log(`[CI/CD] Successful deployment for project ${projectId} (v${version})`);

    return NextResponse.json({ 
      success: true, 
      message: `Version ${version} deployed successfully to ${channel} channel.` 
    });

  } catch (err: any) {
    console.error('[CI/CD API Error]', err.message);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
