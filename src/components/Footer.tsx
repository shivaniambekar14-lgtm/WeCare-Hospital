import React, { useState, useEffect } from 'react';
import {
  Plus,
  Phone,
  Mail,
  MapPin,
  Heart,
  ShieldCheck,
  ChevronRight,
  ArrowUp,
  Lock,
  Shield,
  Sparkles,
} from 'lucide-react';
import { HOSPITAL_INFO, DEPARTMENTS } from '../data/hospitalData';
import { isSingleAdminSlotClaimed } from '../lib/adminAuth';

interface FooterProps {
  onOpenAdminPortal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdminPortal }) => {
  const [isSlotClaimed, setIsSlotClaimed] = useState(false);

  useEffect(() => {
    setIsSlotClaimed(isSingleAdminSlotClaimed());
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="main-hospital-footer" className="bg-slate-950 text-slate-300 pt-16 pb-8 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-800">
          {/* Col 1: Brand & Overview */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-lg shadow-teal-600/30">
                <Plus className="w-6 h-6 stroke-[3]" />
              </div>
              <span className="text-2xl font-extrabold text-white tracking-tight">
                WeCare<span className="text-teal-400">Hospital</span>
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              WeCare Hospital is a multi-super-specialty healthcare institution dedicated to providing compassionate,
              evidence-based clinical excellence, advanced surgical procedures, and empathetic patient care since 1998.
            </p>

            <div className="space-y-2 pt-1 text-xs text-slate-400">
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-teal-400 shrink-0" />
                <span>742 Healthcare Boulevard, Medical District, NY 10016</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Central Scheduling: {HOSPITAL_INFO.generalPhone}</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Inquiries: {HOSPITAL_INFO.email}</span>
              </p>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">Quick Navigation</h4>
            <ul className="space-y-2 text-xs">
              {[
                { label: 'Home', href: '#home' },
                { label: 'About Us', href: '#about' },
                { label: 'Clinical Departments', href: '#departments' },
                { label: 'Specialist Doctors', href: '#doctors' },
                { label: 'Hospital Services', href: '#services' },
                { label: 'Why Choose Us', href: '#why-us' },
                { label: 'Patient Testimonials', href: '#testimonials' },
                { label: 'Hospital Gallery', href: '#gallery' },
                { label: 'Health Tips Blog', href: '#blog' },
                { label: 'Frequently Asked Questions', href: '#faq' },
                { label: 'Contact & Directions', href: '#contact' },
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-slate-400 hover:text-teal-400 transition-colors flex items-center gap-1.5"
                  >
                    <ChevronRight className="w-3 h-3 text-teal-500" />
                    <span>{link.label}</span>
                  </a>
                </li>
              ))}

              {/* Staff / Admin Portal Footer Link */}
              <li className="pt-2">
                <button
                  type="button"
                  onClick={onOpenAdminPortal}
                  className="w-full text-left p-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-teal-500/30 text-teal-400 hover:text-teal-300 transition-all flex items-center justify-between group cursor-pointer shadow-xs"
                >
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-teal-400" />
                    <div>
                      <span className="font-bold text-xs block text-white group-hover:text-teal-300">
                        Admin Portal
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        {isSlotClaimed ? 'Sign In / View Bookings' : 'Claim 1 Admin Slot'}
                      </span>
                    </div>
                  </div>
                  {isSlotClaimed ? (
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-semibold border border-slate-700">
                      Login
                    </span>
                  ) : (
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-950/80 text-emerald-300 border border-emerald-800 font-bold flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5" />
                      1 Slot Open
                    </span>
                  )}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Department Directory */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">Key Departments</h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2 text-xs">
              {DEPARTMENTS.slice(0, 8).map((dept) => (
                <li key={dept.id}>
                  <a
                    href="#departments"
                    className="text-slate-400 hover:text-teal-400 transition-colors flex items-center gap-1.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                    <span>{dept.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Emergency Alert & Accreditations */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">Emergency Hotlines</h4>
            <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-900/60 space-y-2">
              <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wide block">
                24/7 Trauma Hotline
              </span>
              <a
                href={`tel:${HOSPITAL_INFO.emergencyPhone}`}
                className="text-lg font-black text-white hover:text-rose-300 transition-colors block"
              >
                {HOSPITAL_INFO.emergencyPhone}
              </a>
              <span className="text-[11px] text-slate-400 block">
                Ambulance Dispatch: {HOSPITAL_INFO.ambulancePhone}
              </span>
            </div>

            <div className="pt-2">
              <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Accreditations</h5>
              <div className="flex flex-wrap gap-2 text-[11px]">
                <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-teal-300 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                  <span>JCI Gold Seal</span>
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-teal-300 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                  <span>NABH Accredited</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Social Links */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} WeCare Hospital. All rights reserved. Compassionate Care, Advanced Medicine.</p>

          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={onOpenAdminPortal}
              className="text-slate-400 hover:text-teal-400 transition-colors flex items-center gap-1.5 font-semibold"
              title="Administrator Login & Bookings Management"
            >
              <Shield className="w-3.5 h-3.5 text-teal-400" />
              <span>Admin {isSlotClaimed ? 'Login' : 'Sign Up (1 Slot)'}</span>
            </button>
            <span className="text-slate-700">•</span>
            <a href="#appointment" className="hover:text-teal-400 transition-colors">
              Online Booking
            </a>
            <span className="text-slate-700">•</span>
            <a href="#about" className="hover:text-teal-400 transition-colors">
              Hospital Ethics Policy
            </a>
            <span className="text-slate-700">•</span>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors flex items-center gap-1"
              title="Scroll to Top"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span>Top</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
