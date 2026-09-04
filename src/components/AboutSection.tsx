import React from 'react';
import { Target, Compass, Award, Shield, CheckCircle2, HeartHandshake, Sparkles } from 'lucide-react';
import { HOSPITAL_INFO } from '../data/hospitalData';

export const AboutSection: React.FC = () => {
  const pillars = [
    {
      title: 'Clinical Integrity',
      description: 'Zero compromise on ethical medical practice, rigorous diagnostic standards, and peer-reviewed treatment pathways.',
      icon: Shield,
    },
    {
      title: 'Patient-First Compassion',
      description: 'Every treatment plan is tailored with warmth, dignity, and deep respect for the physical and emotional well-being of patients and families.',
      icon: HeartHandshake,
    },
    {
      title: 'Advanced Medical Innovation',
      description: 'Continuously upgrading with 4th generation da Vinci robotic surgical suites, 3.0T MRI, and precision molecular tumor profiling.',
      icon: Sparkles,
    },
  ];

  return (
    <section id="about" className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-50 border border-teal-200/80 text-teal-800 text-xs font-bold uppercase tracking-widest mb-3">
            About WeCare Hospital
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Over Two Decades of Healing, <br className="hidden sm:inline" />
            <span className="text-teal-600">Trust, and Clinical Leadership</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Founded in 1998, WeCare Hospital has evolved from a pioneering community medical clinic into a globally accredited
            multi-super-specialty healthcare institution serving patients across the nation with empathy and clinical precision.
          </p>
        </div>

        {/* Grid: Story & Mission/Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
          {/* Left: Interactive Hospital Imagery */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-100">
              <img
                src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80"
                alt="WeCare Hospital Modern Medical Campus"
                className="w-full h-[400px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="inline-block px-3 py-1 rounded-full bg-teal-600 text-xs font-bold uppercase tracking-wider mb-2">
                  Flagship Campus
                </span>
                <h3 className="text-xl font-bold">WeCare Center for Health & Healing</h3>
                <p className="text-xs text-slate-300 mt-1">450-Bed Tertiary Care Facility • 742 Healthcare Boulevard</p>
              </div>
            </div>

            {/* Experience badge */}
            <div className="absolute -bottom-6 -right-6 bg-teal-600 text-white p-6 rounded-2xl shadow-xl shadow-teal-600/20 hidden sm:block">
              <p className="text-3xl font-extrabold">26+</p>
              <p className="text-xs font-medium text-teal-100">Years of Clinical Excellence</p>
            </div>
          </div>

          {/* Right: Hospital History, Mission & Vision */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                <span className="w-2 h-6 bg-teal-600 rounded-full inline-block"></span>
                Our History & Legacy
              </h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                WeCare Hospital was inaugurated with a single guiding promise: to make world-class medical science accessible
                without sacrificing the personal tenderness every patient deserves. Over 26 years, we have expanded our
                clinical facilities to over 450 beds, performing complex organ transplants, delicate neurosurgeries, and
                bringing joy to thousands of growing families through our maternity center.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
                  <Target className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-slate-900">Our Mission</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  To provide holistic, cutting-edge healthcare guided by empathy, precision diagnosis, and unwavering commitment
                  to patient recovery and safety.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <Compass className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-slate-900">Our Vision</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  To be the benchmark in innovative medicine, medical education, and community wellness, setting the gold
                  standard for compassionate clinical outcomes.
                </p>
              </div>
            </div>

            {/* List of Accreditations */}
            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Quality Accreditations</h4>
              <div className="flex flex-wrap gap-2">
                {['JCI Gold Seal of Approval', 'NABH Full Hospital Accreditation', 'NABL Certified Central Labs', 'ISO 9001:2015 Safety Standard'].map((cert) => (
                  <span
                    key={cert}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 text-slate-700 text-xs font-medium border border-slate-200"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{cert}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 3 Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="p-6 rounded-2xl bg-white border border-slate-200/80 hover:border-teal-300 shadow-xs hover:shadow-xl transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-4 group-hover:scale-105 group-hover:bg-teal-600 group-hover:text-white transition-all">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{pillar.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{pillar.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
