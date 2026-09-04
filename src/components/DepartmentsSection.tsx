import React, { useState } from 'react';
import {
  HeartPulse,
  Brain,
  Activity,
  Baby,
  Sparkles,
  HeartHandshake,
  Headphones,
  Smile,
  Stethoscope,
  ScanLine,
  ShieldAlert,
  Eye,
  ArrowRight,
  UserCheck,
  MapPin,
  Calendar,
} from 'lucide-react';
import { DEPARTMENTS, DOCTORS } from '../data/hospitalData';
import { Department } from '../types/hospital';

interface DepartmentsSectionProps {
  onSelectDepartmentForDoctors: (deptId: string) => void;
  onBookInDepartment: (deptId: string) => void;
}

export const DepartmentsSection: React.FC<DepartmentsSectionProps> = ({
  onSelectDepartmentForDoctors,
  onBookInDepartment,
}) => {
  const [selectedDeptDetail, setSelectedDeptDetail] = useState<Department | null>(null);

  const getDepartmentIcon = (iconName: string) => {
    const props = { className: 'w-6 h-6' };
    switch (iconName) {
      case 'HeartPulse':
        return <HeartPulse {...props} />;
      case 'Brain':
        return <Brain {...props} />;
      case 'Activity':
        return <Activity {...props} />;
      case 'Baby':
        return <Baby {...props} />;
      case 'Sparkles':
        return <Sparkles {...props} />;
      case 'HeartHandshake':
        return <HeartHandshake {...props} />;
      case 'Headphones':
        return <Headphones {...props} />;
      case 'Smile':
        return <Smile {...props} />;
      case 'Stethoscope':
        return <Stethoscope {...props} />;
      case 'ScanLine':
        return <ScanLine {...props} />;
      case 'ShieldAlert':
        return <ShieldAlert {...props} />;
      case 'Eye':
        return <Eye {...props} />;
      default:
        return <HeartPulse {...props} />;
    }
  };

  return (
    <section id="departments" className="py-20 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-50 border border-teal-200/80 text-teal-800 text-xs font-bold uppercase tracking-widest mb-3">
            Centers of Medical Excellence
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Specialized Clinical <span className="text-teal-600">Departments</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Our 12 comprehensive centers of excellence integrate cutting-edge diagnostics, advanced surgical facilities,
            and interdisciplinary care teams to deliver personalized patient outcomes.
          </p>
        </div>

        {/* 12 Departments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {DEPARTMENTS.map((dept) => {
            const doctorCount = DOCTORS.filter((d) => d.departmentId === dept.id).length;

            return (
              <div
                key={dept.id}
                id={`dept-card-${dept.id}`}
                className="bg-white rounded-3xl p-6 border border-slate-200/70 shadow-xs hover:shadow-xl hover:border-teal-300 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
              >
                <div>
                  {/* Icon & Count Badge */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition-all shadow-xs">
                      {getDepartmentIcon(dept.iconName)}
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 group-hover:bg-teal-50 group-hover:text-teal-800 transition-colors">
                      {doctorCount} Specialists
                    </span>
                  </div>

                  {/* Title & Tagline */}
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-teal-600 transition-colors">
                    {dept.name}
                  </h3>
                  <p className="text-xs font-medium text-teal-600 mt-0.5">{dept.tagline}</p>

                  {/* Description */}
                  <p className="text-slate-600 text-sm mt-3 line-clamp-3 leading-relaxed">
                    {dept.description}
                  </p>

                  {/* Key Specialties Pills */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-1.5">
                    {dept.keySpecialties.slice(0, 2).map((item) => (
                      <span
                        key={item}
                        className="text-[11px] font-medium bg-slate-50 text-slate-600 px-2 py-0.5 rounded-md border border-slate-200/60"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Actions: View Doctors & Book */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    id={`view-doctors-${dept.id}`}
                    onClick={() => onSelectDepartmentForDoctors(dept.id)}
                    className="flex items-center gap-1.5 text-xs font-bold text-teal-600 hover:text-teal-700 group/btn py-1"
                  >
                    <span>View Doctors</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                  </button>

                  <button
                    id={`book-dept-${dept.id}`}
                    onClick={() => onBookInDepartment(dept.id)}
                    className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-teal-50 text-teal-800 hover:bg-teal-600 hover:text-white transition-all flex items-center gap-1"
                  >
                    <Calendar className="w-3 h-3" />
                    <span>Book</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Facility Banner */}
        <div className="mt-14 p-6 sm:p-8 rounded-3xl bg-slate-900 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
              Not sure which department you need?
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-white">Speak with our Clinical Triage Team</h3>
            <p className="text-sm text-slate-400 max-w-xl">
              Our registered nurse navigators can assess your symptoms and guide you to the exact department or specialist.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <a
              id="triage-call-btn"
              href="tel:+18007383746"
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-5 py-3 rounded-xl shadow-lg shadow-emerald-500/20 transition-all text-sm"
            >
              Call Clinical Helpline
            </a>
            <button
              id="triage-book-general-btn"
              onClick={() => onBookInDepartment('general-medicine')}
              className="bg-white/10 hover:bg-white/20 text-white font-semibold px-5 py-3 rounded-xl border border-white/20 transition-all text-sm"
            >
              Book General Consultation
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
