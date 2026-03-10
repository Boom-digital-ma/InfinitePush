import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const WEBHOOK_SECRET = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-signature');

    // 1. Verify Signature
    if (!signature) {
      return NextResponse.json({ error: 'No signature' }, { status: 400 });
    }

    const hmac = crypto.createHmac('sha256', WEBHOOK_SECRET);
    const digest = Buffer.from(hmac.update(rawBody).digest('hex'), 'utf8');
    const signatureBuffer = Buffer.from(signature, 'utf8');

    if (!crypto.timingSafeEqual(digest, signatureBuffer)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);
    const eventName = payload.meta.event_name;
    const data = payload.data;

    console.log(`[LemonSqueezy Webhook] Received event: ${eventName}`);

    // 2. Handle Subscription Events
    if (eventName === 'subscription_created' || eventName === 'subscription_updated' || eventName === 'subscription_resumed') {
      const attributes = data.attributes;
      const userEmail = attributes.user_email;
      const status = attributes.status;
      const variantId = attributes.variant_id.toString();
      const customerId = attributes.customer_id.toString();
      const subscriptionId = data.id.toString();

      let planName = 'Free';
      let maxProjects = 1;
      let deploymentLimit = 50;

      // Logic to determine plan based on variant ID (InfinitePush Pro)
      if (variantId === '882356' && status === 'active') {
        planName = 'Pro';
        maxProjects = 10;
        deploymentLimit = 1000;
      }

      const { error: updateError } = await supabaseAdmin
        .from('profiles')
        .update({
          subscription_status: status,
          plan_name: planName,
          variant_id: variantId,
          lemon_squeezy_customer_id: customerId,
          lemon_squeezy_subscription_id: subscriptionId,
          max_projects: maxProjects,
          deployment_limit_monthly: deploymentLimit,
          updated_at: new Date().toISOString(),
        })
        .eq('email', userEmail);

      if (updateError) {
        console.error('[LemonSqueezy Webhook] DB Update Error:', updateError);
        return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
      }
    }

    if (eventName === 'subscription_cancelled' || eventName === 'subscription_expired' || eventName === 'subscription_payment_failed') {
        const userEmail = data.attributes.user_email;
        const status = data.attributes.status;
        
        await supabaseAdmin
          .from('profiles')
          .update({
            subscription_status: status || 'canceled',
            plan_name: 'Free',
            max_projects: 1,
            deployment_limit_monthly: 50,
            updated_at: new Date().toISOString(),
          })
          .eq('email', userEmail);
    }

    if (eventName === 'subscription_payment_success') {
        console.log('[LemonSqueezy Webhook] Payment Successful for:', data.attributes.user_email);
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error('[LemonSqueezy Webhook] Main Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
