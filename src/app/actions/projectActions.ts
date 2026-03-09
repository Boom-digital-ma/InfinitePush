'use server';

import { createClient } from '@/utils/supabase/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

export async function getProjects() {
  const supabase = await createClient();
  const { data: projects, error } = await supabase.from('projects').select('*');
  if (error) return { error: error.message };
  return { projects };
}

export async function connectProject(formData: FormData) {
  const supabase = await createClient();

  const name = formData.get('name') as string;
  const client_supabase_url = formData.get('client_supabase_url') as string;
  const client_supabase_key = formData.get('client_supabase_key') as string;

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Not authenticated');
  }

  const { error } = await supabase.from('projects').insert({
    user_id: user.id,
    name,
    client_supabase_url,
    client_supabase_key,
    subscription_status: 'trial',
    plan_type: 'solo',
  });

  if (error) {
    console.error('Error connecting project:', error.message);
    return { error: error.message };
  }

  revalidatePath('/dashboard');
  return { success: true };
}

export async function getDeployments(projectId: string) {
  const supabase = await createClient();

  const { data: project, error: projectError } = await supabase
    .from('projects')
    .select('*')
    .eq('id', projectId)
    .single();

  if (projectError || !project) {
    return { error: 'Project not found' };
  }

  try {
    const clientSupabase = createSupabaseClient(
      project.client_supabase_url,
      project.client_supabase_key
    );

    // 1. Fetch deployments from Client Supabase
    const { data: deployments, error: deploymentError } = await clientSupabase
      .from('infinite_push_deployments')
      .select('*')
      .order('created_at', { ascending: false });

    if (deploymentError) {
      return { error: deploymentError.message };
    }

    // 2. Fetch install counts from our SaaS Brain
    const { data: stats } = await supabase
      .from('analytics_installs')
      .select('deployment_id')
      .eq('project_id', projectId);

    const statsMap: Record<string, number> = {};
    stats?.forEach((s) => {
      statsMap[s.deployment_id] = (statsMap[s.deployment_id] || 0) + 1;
    });

    // 3. Merge stats into deployments
    const deploymentsWithStats = deployments.map((d) => ({
      ...d,
      install_count: statsMap[d.id] || 0,
    }));

    return { deployments: deploymentsWithStats };
  } catch (err: any) {
    return { error: err.message };
  }
}

export async function rollbackToVersion(projectId: string, deploymentId: string) {
  const supabase = await createClient();

  const { data: project, error: projectError } = await supabase
    .from('projects')
    .select('*')
    .eq('id', projectId)
    .single();

  if (projectError || !project) {
    return { error: 'Project not found' };
  }

  try {
    const clientSupabase = createSupabaseClient(
      project.client_supabase_url,
      project.client_supabase_key
    );

    const { data: targetDeployment } = await clientSupabase
      .from('infinite_push_deployments')
      .select('channel')
      .eq('id', deploymentId)
      .single();

    if (!targetDeployment) return { error: 'Deployment not found' };

    await clientSupabase
      .from('infinite_push_deployments')
      .update({ status: 'inactive' })
      .eq('channel', targetDeployment.channel);

    const { error: updateError } = await clientSupabase
      .from('infinite_push_deployments')
      .update({ status: 'active' })
      .eq('id', deploymentId);

    if (updateError) {
      return { error: updateError.message };
    }

    revalidatePath('/dashboard');
    return { success: true };
  } catch (err: any) {
    return { error: err.message };
  }
}

export async function deployZip(projectId: string, formData: FormData) {
  const supabase = await createClient();

  const { data: project, error: projectError } = await supabase
    .from('projects')
    .select('*')
    .eq('id', projectId)
    .single();

  if (projectError || !project) {
    return { error: 'Project not found' };
  }

  const file = formData.get('file') as File;
  const version = formData.get('version') as string;
  const channel = formData.get('channel') as string || 'production';

  if (!file || !version) {
    return { error: 'Missing file or version' };
  }

  try {
    const clientSupabase = createSupabaseClient(
      project.client_supabase_url,
      project.client_supabase_key
    );

    const fileName = `updates/${channel}/${version}/update.zip`;

    const { error: uploadError } = await clientSupabase.storage
      .from('infinite-push')
      .upload(fileName, file, {
        upsert: true,
        contentType: 'application/zip',
      });

    if (uploadError) {
      return { error: `Upload failed: ${uploadError.message}` };
    }

    const { data: { publicUrl } } = clientSupabase.storage
      .from('infinite-push')
      .getPublicUrl(fileName);

    await clientSupabase
      .from('infinite_push_deployments')
      .update({ status: 'inactive' })
      .eq('channel', channel);

    const is_mandatory = formData.get('is_mandatory') === 'true';

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
      return { error: `Database update failed: ${deploymentError.message}` };
    }

    revalidatePath('/dashboard');
    return { success: true };
  } catch (err: any) {
    return { error: err.message || 'An unexpected error occurred' };
  }
}
