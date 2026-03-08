import React from 'react';

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20 font-sans text-slate-800 leading-relaxed">
      <h1 className="text-4xl font-bold mb-8 text-slate-900">Terms of Service</h1>
      <p className="mb-4 text-slate-500">Last updated: March 08, 2026</p>
      
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-slate-900">1. Acceptance of Terms</h2>
        <p>By accessing and using InfinitePush, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the service.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-slate-900">2. Service Description</h2>
        <p>InfinitePush provides a management layer for mobile application live updates. Users are responsible for their own Supabase infrastructure.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-slate-900">3. Subscriptions and Payments</h2>
        <p>Payments are processed via Lemon Squeezy. Subscriptions can be cancelled at any time from your billing dashboard.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-slate-900">4. Limitation of Liability</h2>
        <p>InfinitePush is provided "as is" without warranty of any kind. We are not liable for any damages resulting from the use of our services.</p>
      </section>

      <a href="/" className="text-blue-600 font-bold hover:underline">← Back to Home</a>
    </div>
  );
}
