import React from 'react';
import {
  Users,
  Clock,
  Cpu,
  BadgeDollarSign,
  HeartHandshake,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { HOSPITAL_INFO } from '../data/hospitalData';

export const WhyChooseUs: React.FC = () => {
  const differentiators = [
    {
      title: 'Experienced Medical Leaders',
      description: 'Over 65 board-certified specialist physicians, professors, and surgeons with decades of collective tertiary clinical expertise.',
      icon: Users,
      badge: '65+ Specialists',
    },
    {
      title: '24/7 Rapid Emergency & Trauma',
      description: 'Fully equipped Level-1 emergency department with dedicated catheterization labs, zero triage waits, and ACLS mobile ambulance fleet.',
      icon: Clock,
      badge: 'Zero-Wait Triage',
    },
    {
      title: 'Modern Robotic & Diagnostic Tech',
      description: 'Equipped with 4th-gen da Vinci Xi surgical robotics, quiet-bore 3.0T MRI, 256-slice CT, and high-precision genetic molecular diagnostics.',
      icon: Cpu,
      badge: 'da Vinci Robotic',
    },
    {
      title: 'Transparent & Affordable Care',
      description: 'Clear upfront pricing estimates, direct cashless billing with major health insurance networks, and no hidden facility charges.',
      icon: BadgeDollarSign,
      badge: 'Cashless Tie-ups',
    },
    {
      title: 'Patient-Centered Compassion',
      description: 'Holistic healing philosophy addressing psychological comfort, family counseling, pain management, and personalized nursing care.',
      icon: HeartHandshake,
      badge: '99.4% Rating',
    },
    {
      title: 'Stringent Infection Control',
      description: 'Laminar air flow HEPA filtration throughout surgical theatres, strict hygiene surveillance, and hospital-acquired infection rate below 0.1%.',
      icon: ShieldCheck,
      badge: 'JCI Accredited',
    },
  ];

  return (
    <section id="why-us" className="py-20 bg-slate-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-50 border border-teal-200/80 text-teal-800 text-xs font-bold uppercase tracking-widest mb-3">
            Why WeCare Hospital
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Setting the Standard in <span className="text-teal-600">Patient Excellence</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Healthcare is a deeply human bond of trust. Here is why over 150,000 patients and families have chosen
            WeCare Hospital for their most critical healthcare milestones.
          </p>
        </div>

        {/* 6 Differentiators Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {differentiators.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="bg-white rounded-3xl p-7 border border-slate-200/70 shadow-xs hover:shadow-xl hover:border-teal-300 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition-all shadow-xs">
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 group-hover:bg-teal-50 group-hover:text-teal-800 transition-colors">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-teal-600 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-slate-600 text-sm mt-3 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-teal-800">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Verified Clinical Standard</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Institutional Stats Banner */}
        <div className="mt-14 rounded-3xl bg-white border border-slate-200/80 p-8 shadow-sm">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
            {HOSPITAL_INFO.stats.slice(0, 4).map((stat) => (
              <div key={stat.label} className="pt-4 sm:pt-0 sm:px-4">
                <p className="text-3xl sm:text-4xl font-black text-teal-600">{stat.value}</p>
                <p className="text-xs sm:text-sm font-semibold text-slate-700 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
