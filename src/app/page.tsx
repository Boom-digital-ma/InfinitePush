import React from 'react';
import { Metadata } from 'next';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import { 
  Play, 
  ShieldCheck, 
  Zap, 
  Repeat, 
  Github, 
  Database, 
  Smartphone, 
  Star,
  CheckCircle2,
  TrendingUp,
  Lock
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'InfinitePush - The Unlimited Capacitor Live Update Platform',
  description: 'Deploy code updates instantly using your own Supabase infrastructure. The robust and affordable alternative to Ionic Appflow.',
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Header />

      {/* Hero Section */}
      <section className="px-6 py-20 md:py-32 max-w-7xl mx-auto text-center relative overflow-hidden">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold mb-6 tracking-wide uppercase">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
          </span>
          Global Capacitor Infrastructure
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-6 tracking-tight leading-tight">
          Update Your Mobile Apps <br className="hidden md:block" />
          <span className="text-blue-600 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 font-black">On Your Own Terms.</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
          The high-performance, GDPR-compliant alternative to Ionic Appflow. 
          Keep your binaries on your <strong>own Supabase</strong> and skip the App Store review process.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="/login" className="w-full sm:w-auto bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg hover:-translate-y-1 flex items-center justify-center gap-2">
            <Zap className="w-5 h-5" />
            Start Deploying For Free
          </a>
          <button className="w-full sm:w-auto bg-white text-slate-700 border border-slate-200 px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
            <Play className="w-5 h-5 text-blue-600" />
            Watch Demo
          </button>
        </div>

        {/* Integration Logos */}
        <div className="mt-20 pt-10 border-t border-slate-100">
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-[0.2em] mb-8">Works seamlessly with your stack</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="flex items-center gap-2 font-bold text-xl text-slate-800">
              <Smartphone className="w-6 h-6" /> Capacitor
            </div>
            <div className="flex items-center gap-2 font-bold text-xl text-slate-800">
              <Database className="w-6 h-6 text-emerald-500 fill-emerald-500/10" /> Supabase
            </div>
            <div className="flex items-center gap-2 font-bold text-xl text-slate-800">
              <Github className="w-6 h-6" /> GitHub
            </div>
            <div className="flex items-center gap-2 font-bold text-xl text-slate-800">
              <Zap className="w-6 h-6 text-yellow-500 fill-yellow-500/10" /> Vite
            </div>
          </div>
        </div>
      </section>

      {/* Stats/Proof */}
      <section className="px-6 py-12 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-slate-900 flex items-center justify-center gap-2">
              <Repeat className="w-6 h-6 text-blue-500" /> ∞
            </div>
            <div className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mt-1">Unlimited Updates</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-slate-900 flex items-center justify-center gap-2">
              <Lock className="w-6 h-6 text-blue-500" /> 100%
            </div>
            <div className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mt-1">Data Ownership</div>
          </div>
          <div className="text-center border-x border-slate-100 hidden md:block">
            <div className="text-3xl font-bold text-blue-600 uppercase">BYOS</div>
            <div className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mt-1">Supabase Native</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-emerald-500 flex items-center justify-center gap-1">
              $29 <span className="text-sm font-medium text-slate-400">/mo</span>
            </div>
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
              icon: <ShieldCheck className="w-8 h-8 text-blue-600" />
            },
            {
              title: "Instant Rollback",
              desc: "One click to revert any bad deployment. Your users never see a broken app again.",
              icon: <Repeat className="w-8 h-8 text-blue-600" />
            },
            {
              title: "Git-Native Pipeline",
              desc: "Trigger builds directly from GitHub. Automate your entire mobile CI/CD in minutes.",
              icon: <Github className="w-8 h-8 text-blue-600" />
            }
          ].map((feat, idx) => (
            <div key={idx} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
              <div className="mb-4 p-3 bg-blue-50 w-fit rounded-xl group-hover:bg-blue-100 transition-colors">{feat.icon}</div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{feat.title}</h3>
              <p className="text-slate-600 leading-relaxed text-sm">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Social Proof / Testimonials */}
      <section className="px-6 py-24 bg-blue-600 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Trusted by Mobile Developers</h2>
            <div className="flex items-center justify-center gap-1 text-yellow-400">
              <Star className="w-5 h-5 fill-current" />
              <Star className="w-5 h-5 fill-current" />
              <Star className="w-5 h-5 fill-current" />
              <Star className="w-5 h-5 fill-current" />
              <Star className="w-5 h-5 fill-current" />
              <span className="ml-2 text-white/80 font-medium">Loved by the community</span>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "InfinitePush is the first solution that actually respects GDPR for mobile updates. Keeping everything on our Supabase is a game-changer.",
                author: "Sarah J.",
                role: "Lead Mobile Dev @ FinTech Solutions",
                avatar: "SJ"
              },
              {
                quote: "The pricing of Ionic Appflow was killing our margins. Moving to InfinitePush took us 10 minutes and saved us $3,000/year.",
                author: "Marc-Antoine R.",
                role: "CTO @ HealthTech Startup",
                avatar: "MR"
              },
              {
                quote: "The 'Bring Your Own Supabase' architecture is genius. I have full control over my artifacts and deployments. No more black box.",
                author: "David K.",
                role: "Independent Indie Hacker",
                avatar: "DK"
              }
            ].map((t, idx) => (
              <div key={idx} className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/10 flex flex-col justify-between">
                <div>
                  <div className="flex gap-1 mb-6">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  </div>
                  <p className="text-lg italic mb-8 leading-relaxed">"{t.quote}"</p>
                </div>
                <div className="flex items-center gap-4 border-t border-white/10 pt-6">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold text-sm">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-bold">{t.author}</div>
                    <div className="text-xs text-white/60">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="px-6 py-24 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <div className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-xs font-bold tracking-widest uppercase mb-4">
              Transparent Pricing
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">
              Predictable costs, <br className="hidden md:block" />
              <span className="text-blue-600">No surprises.</span>
            </h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              Stop paying for "per-user" seats or "per-update" fees. 
              Our plans are designed to scale with your app's growth.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { 
                name: "Free", 
                price: "$0", 
                target: "Individual devs", 
                features: ["1 Active Project", "50 Updates / month", "Community Support", "BYOS Enabled"],
                cta: "Start for Free",
                popular: false
              },
              { 
                name: "Solo", 
                price: "$29", 
                target: "Professional devs", 
                features: ["3 Active Projects", "Unlimited Updates", "GitHub CI/CD Action", "Email Support", "Custom Domains"],
                cta: "Go Pro Now",
                popular: true
              },
              { 
                name: "Agency", 
                price: "$99", 
                target: "Development teams", 
                features: ["15 Active Projects", "Unlimited Updates", "Team Collaboration", "Priority Support", "Advanced Analytics"],
                cta: "Scale your Agency",
                popular: false
              },
              { 
                name: "Enterprise", 
                price: "$249", 
                target: "Large organizations", 
                features: ["Unlimited Projects", "Custom SLAs", "SSO & Audit Logs", "Dedicated Account Manager", "White-label options"],
                cta: "Contact Sales",
                popular: false
              }
            ].map((plan, idx) => (
              <div 
                key={idx} 
                className={`relative flex flex-col p-8 rounded-[2rem] transition-all duration-300 ${
                  plan.popular 
                    ? 'bg-white border-2 border-blue-600 shadow-2xl scale-105 z-10' 
                    : 'bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                    Most Popular
                  </div>
                )}
                
                <div className="mb-8">
                  <h3 className="text-xl font-black text-slate-900 mb-1">{plan.name}</h3>
                  <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-6">{plan.target}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-black text-slate-900 tracking-tighter">{plan.price}</span>
                    <span className="text-slate-400 font-bold text-sm">/mo</span>
                  </div>
                </div>

                <div className="space-y-4 mb-10 flex-grow">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3 text-sm text-slate-600 font-medium">
                      <CheckCircle2 className={`w-5 h-5 shrink-0 ${plan.popular ? 'text-blue-600' : 'text-emerald-500'}`} />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <a 
                  href={plan.name === 'Enterprise' ? 'mailto:infinitepush.app@proton.me' : '/login'}
                  className={`w-full py-4 rounded-2xl font-black text-center transition-all ${
                    plan.popular 
                      ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200 shadow-lg' 
                      : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                  }`}
                >
                  {plan.cta}
                </a>
              </div>
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <p className="text-slate-400 text-sm font-medium">
              All plans include our 7-day no-questions-asked refund policy. <br className="md:hidden" />
              Need a custom plan? <a href="mailto:infinitepush.app@proton.me" className="text-blue-600 underline underline-offset-4 font-bold">Talk to us</a>.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="px-6 py-24 text-center max-w-4xl mx-auto">
        <h2 className="text-4xl font-black mb-6">Ready to take control of your mobile deployments?</h2>
        <p className="text-xl text-slate-600 mb-10 leading-relaxed">
          Join hundreds of developers who have already switched to a more secure, more affordable Capacitor live update platform.
        </p>
        <a href="/login" className="bg-slate-900 text-white px-12 py-5 rounded-2xl font-bold text-xl hover:bg-slate-800 transition-all shadow-xl hover:-translate-y-1 inline-block">
          Launch Your First Update Now
        </a>
      </section>

      <Footer />
    </div>
  );
}
