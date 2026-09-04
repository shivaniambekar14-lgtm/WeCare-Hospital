import React from 'react';
import { Phone, Ambulance, Clock, ShieldCheck, HeartPulse } from 'lucide-react';
import { HOSPITAL_INFO } from '../data/hospitalData';

export const TopBar: React.FC = () => {
  return (
    <div id="top-announcement-bar" className="bg-slate-900 text-slate-300 text-xs py-2 px-4 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <a
            id="topbar-emergency-link"
            href={`tel:${HOSPITAL_INFO.emergencyPhone}`}
            className="flex items-center gap-2 font-bold text-rose-400 hover:text-rose-300 transition-colors"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
            </span>
            <Phone className="w-3.5 h-3.5" />
            <span>24/7 Emergency: {HOSPITAL_INFO.emergencyPhone}</span>
          </a>

          <a
            id="topbar-ambulance-link"
            href={`tel:${HOSPITAL_INFO.ambulancePhone}`}
            className="hidden sm:flex items-center gap-1.5 text-amber-400 hover:text-amber-300 transition-colors font-medium"
          >
            <Ambulance className="w-3.5 h-3.5" />
            <span>Ambulance Dispatch: {HOSPITAL_INFO.ambulancePhone}</span>
          </a>

          <div className="hidden lg:flex items-center gap-1.5 text-slate-400 font-medium">
            <Clock className="w-3.5 h-3.5 text-teal-400" />
            <span>OPD Consultation: Mon – Sat 7:30 AM – 8:30 PM</span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <span className="hidden md:flex items-center gap-1.5 text-teal-400 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
            <span>JCI Gold Seal & NABH Certified</span>
          </span>
          <a
            id="topbar-book-btn"
            href="#appointment"
            className="bg-teal-600 hover:bg-teal-500 text-white px-3 py-1 rounded-full transition-all text-xs font-semibold shadow-xs shadow-teal-500/20"
          >
            Book Consultation
          </a>
        </div>
      </div>
    </div>
  );
};
