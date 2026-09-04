import React, { useState, useEffect } from 'react';
import { PhoneCall, Calendar, X } from 'lucide-react';
import { HOSPITAL_INFO } from '../data/hospitalData';

interface FloatingEmergencyButtonProps {
  onBookClick: () => void;
}

export const FloatingEmergencyButton: React.FC<FloatingEmergencyButtonProps> = ({ onBookClick }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div
      id="floating-emergency-widget"
      className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2.5 animate-in fade-in slide-in-from-bottom-4 duration-300"
    >
      <a
        id="floating-emergency-dial"
        href={`tel:${HOSPITAL_INFO.emergencyPhone}`}
        className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-bold px-4 py-2.5 rounded-full shadow-xl shadow-rose-600/30 hover:shadow-2xl transition-all transform hover:-translate-y-0.5 text-xs sm:text-sm"
        title="24/7 Emergency Line"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
        </span>
        <PhoneCall className="w-4 h-4" />
        <span className="hidden sm:inline">Emergency: {HOSPITAL_INFO.emergencyPhone}</span>
        <span className="sm:hidden">Emergency</span>
      </a>

      <button
        id="floating-book-btn"
        onClick={onBookClick}
        className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-4 py-2.5 rounded-full shadow-lg shadow-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/30 transition-all transform hover:-translate-y-0.5 text-xs sm:text-sm"
        title="Book Appointment"
      >
        <Calendar className="w-4 h-4" />
        <span>Book Appointment</span>
      </button>
    </div>
  );
};
