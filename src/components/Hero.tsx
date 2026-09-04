import React from 'react';
import { Calendar, ArrowRight, ShieldCheck, Heart, Award, Clock, Star, PhoneCall, Sparkles, Activity, FileText, UserCheck } from 'lucide-react';
import { HOSPITAL_INFO } from '../data/hospitalData';

interface HeroProps {
  onBookClick: () => void;
  onExploreDepartmentsClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onBookClick, onExploreDepartmentsClick }) => {
  return (
    <section id="home" className="relative bg-slate-50/70 pt-8 pb-16 lg:pt-12 lg:pb-20 overflow-hidden">
      {/* Decorative subtle medical pattern background */}
      <div className="absolute inset-0 bg-[radial-gradient(#0d9488_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

      {/* Ambient glow shapes */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-teal-100/40 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-cyan-100/40 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Hospital Live Readiness Status Bar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-2.5 bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-slate-200/80 shadow-xs text-xs">
          <div className="flex items-center gap-2 text-slate-700 font-semibold">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-emerald-700 font-bold">Hospital Active:</span>
            <span>OPD Triage Wait &lt; 15 min</span>
            <span className="text-slate-300">•</span>
            <span className="hidden sm:inline text-slate-600">Level-1 Trauma Center Ready</span>
          </div>

          <div className="flex items-center gap-3 text-slate-500">
            <span className="flex items-center gap-1 text-teal-700 font-bold">
              <Activity className="w-3.5 h-3.5 text-teal-600" />
              65+ Specialists On Duty
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Hospital Messaging & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Trust Pill */}
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-teal-50 text-teal-800 text-xs font-bold rounded-full uppercase tracking-widest border border-teal-200/70">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span>WeCare Health System • Est. 1998</span>
            </span>

            {/* Main Hospital Tagline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.14]">
              Compassionate Care, <br className="hidden sm:inline" />
              <span className="text-teal-600">Advanced Healing.</span>
            </h1>

            {/* Short Intro Paragraph */}
            <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0">
              At WeCare Hospital, our patient-centered multidisciplinary teams combine the latest robotic surgical precision with genuine bedside warmth to ensure you and your loved ones recover safely and swiftly.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                id="hero-primary-book-btn"
                onClick={onBookClick}
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold px-8 py-4 rounded-xl shadow-lg shadow-teal-600/25 hover:shadow-xl hover:shadow-teal-600/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-base"
              >
                <Calendar className="w-5 h-5" />
                <span>Book Appointment</span>
              </button>

              <button
                id="hero-secondary-depts-btn"
                onClick={onExploreDepartmentsClick}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-800 font-bold px-8 py-4 rounded-xl border border-slate-200 shadow-xs hover:border-teal-300 hover:text-teal-700 transition-all text-base"
              >
                <span>Explore Departments</span>
                <ArrowRight className="w-4 h-4 text-teal-600" />
              </button>
            </div>

            {/* Highlight Badges */}
            <div className="pt-6 border-t border-slate-200/80 grid grid-cols-2 sm:grid-cols-3 gap-4 text-left">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 border border-teal-100 font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">JCI & NABH</h4>
                  <p className="text-xs text-slate-500">Gold Standard Safety</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-100 font-bold">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">24/7 Trauma</h4>
                  <p className="text-xs text-slate-500">Zero Triage Wait</p>
                </div>
              </div>

              <div className="col-span-2 sm:col-span-1 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100 font-bold">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">da Vinci Robotic</h4>
                  <p className="text-xs text-slate-500">Minimally Invasive</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual & Medical Staff Composition */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Main Image Container */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-100 bg-slate-100">
                <img
                  src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80"
                  alt="Doctor at WeCare Hospital providing compassionate medical care"
                  className="w-full h-[420px] sm:h-[480px] object-cover object-top"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent" />

                {/* Bottom Overlay Label */}
                <div className="absolute bottom-4 left-4 right-4 text-white p-3.5 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-white/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-teal-300 uppercase tracking-wider">Chief Medical Officer</p>
                      <h3 className="text-base font-bold text-white">Dr. Arthur Vance, MD</h3>
                      <p className="text-xs text-slate-300">Leading WeCare's 65+ Board-Certified Specialists</p>
                    </div>
                    <div className="flex items-center gap-1 bg-emerald-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-xs">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>4.9 / 5.0</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Stat Card: 99.4% Patient Recovery Rate */}
              <div className="absolute -top-4 -left-4 sm:-left-6 bg-white p-3 sm:p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 font-bold">
                  <Heart className="w-6 h-6 fill-current" />
                </div>
                <div>
                  <span className="text-xl sm:text-2xl font-extrabold text-slate-900">99.4%</span>
                  <p className="text-xs font-semibold text-slate-500">Patient Satisfaction</p>
                </div>
              </div>

              {/* Floating Emergency Badge */}
              <div className="absolute -bottom-5 -right-3 sm:-right-6 bg-white p-3.5 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 font-bold">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-rose-600 uppercase tracking-wider">Emergency 24/7</p>
                  <p className="text-sm font-extrabold text-slate-900">{HOSPITAL_INFO.emergencyPhone}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Bottom Credibility Ribbon */}
        <div className="mt-14 pt-8 border-t border-slate-200/80">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-xs hover:border-teal-200 transition-colors">
              <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-700 font-extrabold text-lg shrink-0">
                26+
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-slate-800">Years of Care</p>
                <p className="text-xs text-slate-500">Established since 1998</p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-xs hover:border-emerald-200 transition-colors">
              <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-700 font-extrabold text-lg shrink-0">
                65+
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-slate-800">Expert Doctors</p>
                <p className="text-xs text-slate-500">Board-certified specialists</p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-xs hover:border-cyan-200 transition-colors">
              <div className="w-12 h-12 bg-cyan-50 rounded-2xl flex items-center justify-center text-cyan-700 font-extrabold text-lg shrink-0">
                12+
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-slate-800">Super Specialties</p>
                <p className="text-xs text-slate-500">Advanced medical centers</p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-xs hover:border-purple-200 transition-colors">
              <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-700 font-extrabold text-lg shrink-0">
                150k+
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-slate-800">Patients Healed</p>
                <p className="text-xs text-slate-500">Trusted by community</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

