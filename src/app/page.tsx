import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'InfinitePush - The Unlimited Capacitor Live Update Platform',
  description: 'Deploy code updates instantly using your own Supabase infrastructure. The robust and affordable alternative to Ionic Appflow.',
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold font-mono text-sm">IP</span>
          </div>
          <span className="text-xl font-bold tracking-tight">InfinitePush</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
          <a href="#pricing" className="hover:text-blue-600 transition-colors">Pricing</a>
          <a href="/login" className="hover:text-blue-600 transition-colors font-bold">Login</a>
        </div>
        <a 
          href="/login"
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
          Global Capacitor Infrastructure
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-6 tracking-tight leading-tight">
          Update Your Mobile Apps <br className="hidden md:block" />
          <span className="text-blue-600 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">On Your Own Terms.</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
          The high-performance, GDPR-ready alternative to Ionic Appflow. 
          Keep your binaries on your <strong>own Supabase</strong> and skip the App Store review process.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="/login" className="w-full sm:w-auto bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg hover:-translate-y-1">
            Start Deploying For Free
          </a>
          <a href="#features" className="w-full sm:w-auto bg-white text-slate-700 border border-slate-200 px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all">
            How BYOS Works
          </a>
        </div>
      </section>

      {/* Stats/Proof */}
      <section className="px-6 py-12 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-slate-900">∞</div>
            <div className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mt-1">Unlimited Updates</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-slate-900">100%</div>
            <div className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mt-1">Data Ownership</div>
          </div>
          <div className="text-center border-x border-slate-100 hidden md:block">
            <div className="text-3xl font-bold text-slate-900 text-blue-600">BYOS</div>
            <div className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mt-1">Supabase Native</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-slate-900 text-emerald-500">$29</div>
            <div className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mt-1">Starting Price</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-6 py-24 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">Enterprise Power, Indie Freedom.</h2>
          <p className="text-slate-600 text-lg">Finally, a live update service that respects your privacy and your budget.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "BYOS Architecture",
              desc: "Bring Your Own Supabase. Your code bundles and deployment history never leave your infrastructure.",
              icon: "🛡️"
            },
            {
              title: "Instant Rollback",
              desc: "One click to revert any bad deployment. Your users never see a broken app again.",
              icon: "🔄"
            },
            {
              title: "Git-Native Pipeline",
              desc: "Trigger builds directly from GitHub. Automate your entire mobile CI/CD in minutes.",
              icon: "⚙️"
            }
          ].map((feat, idx) => (
            <div key={idx} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
              <div className="text-4xl mb-4">{feat.icon}</div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{feat.title}</h3>
              <p className="text-slate-600 leading-relaxed text-sm">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="px-6 py-24 bg-slate-900 text-white rounded-[3rem] mx-4 mb-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Pricing that scales with you</h2>
            <p className="text-slate-400 text-lg">Stop paying for "per-user" or "per-update" seats.</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { name: "Free", price: "$0", period: "/mo", target: "Testing", features: ["1 Active Project", "50 Updates /mo", "Community Support"] },
              { name: "Solo", price: "$29", period: "/mo", target: "Indie Devs", features: ["3 Active Projects", "Unlimited Updates", "GitHub Integration", "Standard Support"] },
              { name: "Agency", price: "$99", period: "/mo", target: "Pro Teams", features: ["15 Active Projects", "Unlimited Updates", "Team Analytics", "Priority Support"] },
              { name: "Enterprise", price: "$249", period: "/mo", target: "Corporate", features: ["Unlimited Projects", "Custom SLAs", "SSO & Audit Logs", "Dedicated Support"] }
            ].map((plan, idx) => (
              <div key={idx} className={`bg-white/5 border ${plan.name === 'Solo' ? 'border-blue-500 ring-4 ring-blue-500/20' : 'border-white/10'} p-8 rounded-2xl flex flex-col relative`}>
                {plan.name === 'Solo' && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">Most Popular</span>}
                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                  <div className="text-slate-400 text-[10px] font-bold mb-4 uppercase tracking-widest">{plan.target}</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold">{plan.price}</span>
                    <span className="text-slate-400 text-sm">{plan.period}</span>
                  </div>
                </div>
                <ul className="space-y-4 mb-8 flex-grow text-left">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-3 text-slate-300 text-xs">
                      <svg className="w-4 h-4 text-blue-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <a 
                  href="/login"
                  className={`w-full py-3 rounded-xl font-bold text-center transition-all text-sm ${plan.name === 'Solo' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-white/10 hover:bg-white/20'}`}
                >
                  Choose {plan.name}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 border-t border-slate-100 pt-12">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-slate-900 rounded flex items-center justify-center">
              <span className="text-white text-[10px] font-bold">IP</span>
            </div>
            <span className="font-bold">InfinitePush</span>
          </div>
          <div className="flex gap-8 text-sm text-slate-500 font-medium">
            <a href="/privacy" className="hover:text-blue-600 transition-colors">Privacy</a>
            <a href="/terms" className="hover:text-blue-600 transition-colors">Terms</a>
            <a href="mailto:support@infinitepush.com" className="hover:text-blue-600 transition-colors">Support</a>
          </div>
          <div className="text-xs text-slate-400 font-medium">
            © 2026 InfinitePush. Built for Capacitor developers.
          </div>
        </div>
      </footer>
    </div>
  );
}
