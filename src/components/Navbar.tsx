import React, { useState, useEffect } from 'react';
import { Plus, Menu, X, PhoneCall, Calendar, HeartPulse, ChevronRight } from 'lucide-react';
import { HOSPITAL_INFO } from '../data/hospitalData';

interface NavbarProps {
  onBookAppointmentClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onBookAppointmentClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      const sections = ['home', 'about', 'departments', 'doctors', 'services', 'appointment', 'contact'];
      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 140 && rect.bottom >= 140) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '#home', id: 'home' },
    { label: 'About Us', href: '#about', id: 'about' },
    { label: 'Departments', href: '#departments', id: 'departments' },
    { label: 'Doctors', href: '#doctors', id: 'doctors' },
    { label: 'Services', href: '#services', id: 'services' },
    { label: 'Why Us', href: '#why-us', id: 'why-us' },
    { label: 'Health Tips', href: '#blog', id: 'blog' },
    { label: 'Contact', href: '#contact', id: 'contact' },
  ];

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      id="main-navbar-header"
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md py-3 border-b border-slate-200/80'
          : 'bg-white py-4 shadow-sm border-b border-slate-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo & Name */}
          <a
            id="brand-logo-link"
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('#home');
            }}
            className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-teal-500 rounded-xl p-1 transition-all"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-700 text-white flex items-center justify-center shadow-lg shadow-teal-600/25 group-hover:scale-105 transition-transform">
              <div className="relative flex items-center justify-center">
                <HeartPulse className="w-6 h-6 stroke-[2.4]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-black tracking-tight text-slate-900">
                  We<span className="text-teal-600">Care</span>
                </span>
                <span className="text-[10px] font-extrabold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md uppercase tracking-wider border border-teal-200/80">
                  Hospital
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] font-semibold text-slate-400 tracking-wider">
                Compassionate Care • Advanced Healing
              </p>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav id="desktop-nav-menu" className="hidden lg:flex items-center space-x-1 xl:space-x-1.5 bg-slate-50/80 p-1.5 rounded-2xl border border-slate-200/60">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  id={`nav-link-${link.id}`}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'text-teal-800 bg-white shadow-xs border border-slate-200/80'
                      : 'text-slate-600 hover:text-teal-700 hover:bg-white/60'
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          {/* Desktop Action Area: Emergency Contact & Book Appointment CTA */}
          <div className="hidden md:flex items-center gap-5">
            <a
              id="navbar-emergency-dial"
              href={`tel:${HOSPITAL_INFO.emergencyPhone}`}
              className="text-right hidden sm:block group focus:outline-none"
              title="24/7 Emergency Line"
            >
              <div className="flex items-center justify-end gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                </span>
                <p className="text-[10px] uppercase tracking-wider text-rose-600 font-bold">
                  24/7 Emergency
                </p>
              </div>
              <p className="text-sm font-extrabold text-slate-800 group-hover:text-rose-600 transition-colors">
                {HOSPITAL_INFO.emergencyPhone}
              </p>
            </a>

            <button
              id="navbar-book-appointment-btn"
              onClick={onBookAppointmentClick}
              className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-teal-600/20 hover:shadow-xl hover:shadow-teal-600/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              id="mobile-book-quick-btn"
              onClick={onBookAppointmentClick}
              className="bg-teal-600 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-md shadow-teal-600/20"
            >
              Book
            </button>
            <button
              id="mobile-hamburger-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:text-teal-600 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
              aria-label="Toggle navigation menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div
          id="mobile-menu-drawer"
          className="lg:hidden bg-white border-b border-slate-200 shadow-xl px-4 pt-3 pb-6 animate-in slide-in-from-top-2 duration-200"
        >
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.id}
                id={`mobile-link-${link.id}`}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-bold ${
                  activeSection === link.id
                    ? 'bg-teal-50 text-teal-700'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{link.label}</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </a>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-200 space-y-3">
            <a
              id="mobile-emergency-call"
              href={`tel:${HOSPITAL_INFO.emergencyPhone}`}
              className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-rose-50 text-rose-700 font-bold border border-rose-200 text-sm"
            >
              <PhoneCall className="w-4 h-4 text-rose-600" />
              <span>Emergency Hotline: {HOSPITAL_INFO.emergencyPhone}</span>
            </a>

            <button
              id="mobile-menu-book-btn"
              onClick={() => {
                setIsMobileMenuOpen(false);
                onBookAppointmentClick();
              }}
              className="w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white py-3 px-4 rounded-xl font-bold text-sm shadow-lg shadow-teal-600/20"
            >
              <Calendar className="w-4 h-4" />
              <span>Book An Appointment</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
