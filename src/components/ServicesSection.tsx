import React, { useState } from 'react';
import {
  Ambulance,
  Microscope,
  Pill,
  Truck,
  HeartHandshake,
  Syringe,
  Footprints,
  FileCheck,
  Video,
  Baby,
  CheckCircle2,
  Clock,
  PhoneCall,
  Calendar,
} from 'lucide-react';
import { SERVICES, HOSPITAL_INFO } from '../data/hospitalData';

interface ServicesSectionProps {
  onBookService: () => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onBookService }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Emergency', 'Diagnostics', 'Inpatient', 'Specialty', 'Support'];

  const filteredServices = selectedCategory === 'All'
    ? SERVICES
    : SERVICES.filter((s) => s.category === selectedCategory);

  const getServiceIcon = (iconName: string) => {
    const props = { className: 'w-6 h-6' };
    switch (iconName) {
      case 'Ambulance':
        return <Ambulance {...props} />;
      case 'Microscope':
        return <Microscope {...props} />;
      case 'Pill':
        return <Pill {...props} />;
      case 'Truck':
        return <Truck {...props} />;
      case 'HeartHandshake':
        return <HeartHandshake {...props} />;
      case 'Syringe':
        return <Syringe {...props} />;
      case 'Footprints':
        return <Footprints {...props} />;
      case 'FileCheck':
        return <FileCheck {...props} />;
      case 'Video':
        return <Video {...props} />;
      case 'Baby':
        return <Baby {...props} />;
      default:
        return <HeartHandshake {...props} />;
    }
  };

  return (
    <section id="services" className="py-20 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-50 border border-teal-200/80 text-teal-800 text-xs font-bold uppercase tracking-widest mb-3">
            Comprehensive Clinical Facilities
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Integrated Healthcare <span className="text-teal-600">Services</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            From 24/7 Level-1 trauma resuscitation and robotic surgical suites to automated pathology and virtual telemedicine,
            we provide end-to-end medical care under one roof.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center justify-center gap-2 flex-wrap mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat === 'All' ? 'All Services (10)' : cat}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              id={`service-card-${service.id}`}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/70 shadow-xs hover:shadow-xl hover:border-teal-300 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
            >
              <div>
                {/* Header with Icon and Badge */}
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition-all shadow-xs">
                    {getServiceIcon(service.iconName)}
                  </div>
                  {service.badge && (
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {service.badge}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-teal-600 transition-colors">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                  {service.description}
                </p>

                {/* Feature checklist */}
                <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                  {service.features.map((feat) => (
                    <div key={feat} className="flex items-start gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Availability & Action */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 text-slate-500 font-medium">
                  <Clock className="w-3.5 h-3.5 text-teal-600" />
                  <span className="line-clamp-1">{service.availability}</span>
                </div>

                <button
                  id={`service-req-btn-${service.id}`}
                  onClick={onBookService}
                  className="font-bold text-teal-600 hover:text-teal-700 hover:underline"
                >
                  Inquire Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Emergency Callout Card */}
        <div className="mt-14 rounded-3xl bg-slate-900 text-white p-6 sm:p-10 relative overflow-hidden shadow-2xl">
          <div className="absolute right-0 bottom-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
                <span>24/7 Mobile Ambulance Dispatch</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold">Need Immediate Emergency Assistance?</h3>
              <p className="text-slate-400 text-sm max-w-xl">
                Our Advanced Cardiac Life Support (ACLS) fleet operates 24/7 with GPS-enabled response times averaging under 12 minutes.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              <a
                id="services-ambulance-call"
                href={`tel:${HOSPITAL_INFO.ambulancePhone}`}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-extrabold px-6 py-3.5 rounded-xl shadow-lg shadow-rose-600/30 transition-all text-sm"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Ambulance: {HOSPITAL_INFO.ambulancePhone}</span>
              </a>
              <button
                id="services-book-appointment-btn"
                onClick={onBookService}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-6 py-3.5 rounded-xl shadow-lg shadow-emerald-500/20 transition-all text-sm"
              >
                <Calendar className="w-4 h-4" />
                <span>Schedule Non-Urgent Visit</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
