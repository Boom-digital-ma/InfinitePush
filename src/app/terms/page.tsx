import React from 'react';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Header />
      <div className="max-w-4xl mx-auto px-6 py-20 font-sans text-slate-800 leading-relaxed bg-white my-12 rounded-3xl border border-slate-200 shadow-sm">
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
          <p>Payments are processed via <strong>Lemon Squeezy</strong>, our Merchant of Record. Subscriptions can be cancelled at any time from your billing dashboard. Cancellations will take effect at the end of the current billing cycle.</p>
        </section>

        <section id="refund" className="mb-8 scroll-mt-24 p-6 bg-blue-50 rounded-2xl border border-blue-100">
          <h2 className="text-2xl font-bold mb-4 text-slate-900 text-blue-800">4. Refund Policy</h2>
          <p className="mb-4">We provide a <strong>Free Tier</strong> specifically to allow users to test InfinitePush and ensure it meets their needs before committing to a paid plan.</p>
          <p className="mb-4 font-semibold text-slate-900">For all first-time paid subscriptions, we offer a 7-day "no-questions-asked" refund policy.</p>
          <p className="mb-4">If you are not satisfied with the service within the first <strong>7 days</strong> of your initial upgrade, you can request a full refund by contacting our support team at <a href="mailto:infinitepush.app@proton.me" className="text-blue-600 underline">infinitepush.app@proton.me</a>.</p>
          <p className="text-sm text-slate-500 italic">Note: After the initial 7-day period, all payments are non-refundable.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-slate-900">5. Limitation of Liability</h2>
          <p>InfinitePush is provided "as is" without warranty of any kind. We are not liable for any damages resulting from the use of our services.</p>
        </section>
      </div>
      <Footer />
    </div>
  );
}
