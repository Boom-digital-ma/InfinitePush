import React from 'react';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Header />
      <div className="max-w-4xl mx-auto px-6 py-20 font-sans text-slate-800 leading-relaxed bg-white my-12 rounded-3xl border border-slate-200 shadow-sm">
        <h1 className="text-4xl font-bold mb-8 text-slate-900">Privacy Policy</h1>
        <p className="mb-4 text-slate-500">Last updated: March 08, 2026</p>
        
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-slate-900">1. Information We Collect</h2>
          <p>We collect information you provide directly to us when you create an account, such as your name, email address, and payment information processed by our merchant of record, Lemon Squeezy.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-slate-900">2. How We Use Information</h2>
          <p>We use the information we collect to provide, maintain, and improve our services, including the delivery of live updates to your mobile applications.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-slate-900">3. Data Storage (BYOS)</h2>
          <p>InfinitePush follows a "Bring Your Own Supabase" architecture. Your code bundles and deployment metadata are stored on your own Supabase infrastructure. InfinitePush does not store your application source code.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-slate-900">4. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us at <strong>infinitepush.app@proton.me</strong>.</p>
        </section>
      </div>
      <Footer />
    </div>
  );
}
