import React from 'react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold font-mono">IP</span>
          </div>
          <span className="text-xl font-bold tracking-tight">InfinitePush</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
          <a href="#pricing" className="hover:text-blue-600 transition-colors">Pricing</a>
          <a href="#docs" className="hover:text-blue-600 transition-colors">Documentation</a>
        </div>
        <a 
          href="#pricing"
          className="bg-blue-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-blue-700 transition-all shadow-sm"
        >
          Get Started
        </a>
      </nav>

      {/* Hero Section */}
      <section className="px-6 py-20 md:py-32 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold mb-6 tracking-wide uppercase">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
          </span>
          The Unlimited Capacitor Live Update Platform
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-6 tracking-tight leading-tight">
          Live Update Your Mobile Apps <br className="hidden md:block" />
          <span className="text-blue-600">Without Limits.</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
          The robust and affordable alternative to Ionic Appflow. 
          Deploy code updates instantly using your own Supabase infrastructure.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="#pricing" className="w-full sm:w-auto bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg hover:-translate-y-1">
            Start Deploying Now
          </a>
          <a href="#features" className="w-full sm:w-auto bg-white text-slate-700 border border-slate-200 px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all">
            See How it Works
          </a>
        </div>
      </section>

      {/* Stats/Proof */}
      <section className="px-6 py-12 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-slate-900">∞</div>
            <div className="text-sm text-slate-500 uppercase font-semibold tracking-wider">Unlimited Updates</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-slate-900">0ms</div>
            <div className="text-sm text-slate-500 uppercase font-semibold tracking-wider">Deploy Latency</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-slate-900">BYOS</div>
            <div className="text-sm text-slate-500 uppercase font-semibold tracking-wider">Bring Your Own Supabase</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-slate-900">29€</div>
            <div className="text-sm text-slate-500 uppercase font-semibold tracking-wider">Starting Price</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-6 py-24 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">Why InfinitePush?</h2>
          <p className="text-slate-600 text-lg">Stop paying per update. Start building with freedom.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "BYOS Architecture",
              desc: "Bring Your Own Supabase. Your code bundles and data stay on your own infrastructure.",
              icon: "🛡️"
            },
            {
              title: "Auto-Rollback",
              desc: "Intelligent crash detection automatically reverts to the previous version if an update fails.",
              icon: "🔄"
            },
            {
              title: "SDK Wrapper",
              desc: "A lightweight TypeScript wrapper that makes live updates seamless in your Capacitor app.",
              icon: "📦"
            }
          ].map((feat, idx) => (
            <div key={idx} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-4xl mb-4">{feat.icon}</div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{feat.title}</h3>
              <p className="text-slate-600 leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="px-6 py-24 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-slate-400 text-lg">Choose the plan that fits your development needs.</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { name: "Solo", price: "29€", period: "/mo", target: "Independent Devs", features: ["1 Active Project", "Unlimited Updates", "Unlimited Users", "Standard Support"] },
              { name: "Agency", price: "99€", period: "/mo", target: "Digital Agencies", features: ["10 Active Projects", "Team Management", "Unified Dashboard", "Priority Support"] },
              { name: "Enterprise", price: "249€", period: "/mo", target: "Large Scale", features: ["Unlimited Projects", "SSO Authentication", "Audit Logs", "SLA Support"] },
              { name: "Lifetime", price: "199€", period: "once", target: "Early Adopters", features: ["1 Project For Life", "Future SDK Updates", "No Subscriptions", "Limited Offer"] }
            ].map((plan, idx) => (
              <div key={idx} className={`bg-white/5 border ${plan.name === 'Solo' ? 'border-blue-500' : 'border-white/10'} p-8 rounded-2xl flex flex-col`}>
                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                  <div className="text-slate-400 text-sm font-medium mb-4 uppercase tracking-wider">{plan.target}</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold">{plan.price}</span>
                    <span className="text-slate-400 text-sm">{plan.period}</span>
                  </div>
                </div>
                <ul className="space-y-4 mb-8 flex-grow">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-3 text-slate-300 text-sm">
                      <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-3 rounded-xl font-bold transition-all ${plan.name === 'Solo' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-white/10 hover:bg-white/20'}`}>
                  Select Plan
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-2 grayscale opacity-75">
            <div className="w-6 h-6 bg-slate-900 rounded flex items-center justify-center">
              <span className="text-white text-xs font-bold">IP</span>
            </div>
            <span className="font-bold">InfinitePush</span>
          </div>
          <div className="flex gap-8 text-sm text-slate-500 font-medium">
            <a href="/privacy" className="hover:text-blue-600 transition-colors">Privacy Policy</a>
            <a href="/terms" className="hover:text-blue-600 transition-colors">Terms of Service</a>
            <a href="mailto:support@infinitepush.com" className="hover:text-blue-600 transition-colors">Support</a>
          </div>
          <div className="text-sm text-slate-400">
            © 2026 InfinitePush. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
