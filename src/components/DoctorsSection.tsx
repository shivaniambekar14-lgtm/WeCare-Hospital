import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Star,
  Clock,
  Calendar,
  Award,
  GraduationCap,
  X,
  ChevronRight,
  Info,
  Check,
} from 'lucide-react';
import { DOCTORS, DEPARTMENTS } from '../data/hospitalData';
import { Doctor } from '../types/hospital';

interface DoctorsSectionProps {
  selectedDeptFilter: string;
  onFilterChange: (deptId: string) => void;
  onBookWithDoctor: (doctor: Doctor) => void;
}

export const DoctorsSection: React.FC<DoctorsSectionProps> = ({
  selectedDeptFilter,
  onFilterChange,
  onBookWithDoctor,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDoctorModal, setActiveDoctorModal] = useState<Doctor | null>(null);

  const filteredDoctors = useMemo(() => {
    return DOCTORS.filter((doc) => {
      const matchesDept =
        selectedDeptFilter === 'all' || doc.departmentId === selectedDeptFilter;
      const matchesSearch =
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.departmentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.specializations.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesDept && matchesSearch;
    });
  }, [selectedDeptFilter, searchQuery]);

  return (
    <section id="doctors" className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-50 border border-teal-200/80 text-teal-800 text-xs font-bold uppercase tracking-widest mb-3">
            Medical Faculty & Specialists
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Meet Our <span className="text-teal-600">Expert Physicians</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Over 65 board-certified medical leaders across cardiology, oncology, neurosurgery, orthopedics, and more.
            Filter by medical specialty or search by name.
          </p>
        </div>

        {/* Controls Bar: Search & Department Tabs */}
        <div className="mb-10 space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="doctor-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search doctors, specializations..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Total matching badge */}
            <div className="text-xs font-semibold text-slate-500 self-end md:self-center">
              Showing <span className="text-slate-900 font-bold">{filteredDoctors.length}</span> specialists
            </div>
          </div>

          {/* Department Filter Tabs (Horizontally scrollable on mobile) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none pt-1">
            <button
              id="filter-tab-all"
              onClick={() => onFilterChange('all')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                selectedDeptFilter === 'all'
                  ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All Specialists ({DOCTORS.length})
            </button>

            {DEPARTMENTS.map((dept) => {
              const count = DOCTORS.filter((d) => d.departmentId === dept.id).length;
              const isSelected = selectedDeptFilter === dept.id;

              return (
                <button
                  key={dept.id}
                  id={`filter-tab-${dept.id}`}
                  onClick={() => onFilterChange(dept.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {dept.name} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Doctors Grid */}
        {filteredDoctors.length === 0 ? (
          <div className="text-center py-16 bg-slate-50 rounded-2xl border border-slate-200 p-8">
            <Filter className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800">No doctors match your criteria</h3>
            <p className="text-sm text-slate-500 mt-1">Try clearing your search query or selecting a different department.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                onFilterChange('all');
              }}
              className="mt-4 px-4 py-2 rounded-lg bg-sky-600 text-white text-xs font-semibold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDoctors.map((doc) => (
              <div
                key={doc.id}
                id={`doctor-card-${doc.id}`}
                className="bg-white rounded-3xl border border-slate-200/70 shadow-xs hover:shadow-xl hover:border-teal-300 transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:-translate-y-1"
              >
                <div>
                  {/* Photo & Rating Banner */}
                  <div className="relative h-64 overflow-hidden bg-slate-100">
                    <img
                      src={doc.photoUrl}
                      alt={doc.name}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                    {/* Department Badge */}
                    <div className="absolute top-3 left-3">
                      <span className="bg-white/90 backdrop-blur-md text-slate-800 text-xs font-bold px-2.5 py-1 rounded-lg shadow-sm border border-slate-200/60">
                        {doc.departmentName}
                      </span>
                    </div>

                    {/* Experience Badge */}
                    <div className="absolute top-3 right-3">
                      <span className="bg-teal-600 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-sm flex items-center gap-1">
                        <Award className="w-3.5 h-3.5" />
                        <span>{doc.experienceYears}+ Yrs Exp</span>
                      </span>
                    </div>

                    {/* Bottom Info on Image */}
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-xl font-bold leading-tight drop-shadow-sm">{doc.name}</h3>
                          <p className="text-xs text-teal-300 font-medium line-clamp-1">{doc.title}</p>
                        </div>
                        <div className="flex items-center gap-1 bg-amber-500/90 text-white text-xs font-bold px-2 py-0.5 rounded-md">
                          <Star className="w-3 h-3 fill-current" />
                          <span>{doc.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 space-y-3">
                    {/* Qualification */}
                    <div className="flex items-start gap-2 text-xs text-slate-600">
                      <GraduationCap className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                      <span className="font-semibold text-slate-700 line-clamp-1">{doc.qualifications}</span>
                    </div>

                    {/* Bio Snippet */}
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {doc.bio}
                    </p>

                    {/* Specializations Pills */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      {doc.specializations.slice(0, 3).map((spec) => (
                        <span
                          key={spec}
                          className="text-[10px] font-medium bg-teal-50 text-teal-800 px-2 py-0.5 rounded border border-teal-200/60"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>

                    {/* Availability */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-teal-600" />
                        <span className="line-clamp-1">{doc.availability}</span>
                      </div>
                      <span className="font-bold text-slate-800">Fee: {doc.consultationFee}</span>
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="p-5 pt-0 grid grid-cols-2 gap-2.5">
                  <button
                    id={`doc-details-btn-${doc.id}`}
                    onClick={() => setActiveDoctorModal(doc)}
                    className="py-2.5 px-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                  >
                    <Info className="w-3.5 h-3.5 text-slate-500" />
                    <span>View Profile</span>
                  </button>

                  <button
                    id={`doc-book-btn-${doc.id}`}
                    onClick={() => onBookWithDoctor(doc)}
                    className="py-2.5 px-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-teal-600/20 transition-all"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Book Visit</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Doctor Details Modal */}
        {activeDoctorModal && (
          <div
            id="doctor-detail-modal-backdrop"
            className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"
            onClick={() => setActiveDoctorModal(null)}
          >
            <div
              id="doctor-detail-modal-card"
              className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative my-8"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                id="close-doctor-modal-btn"
                onClick={() => setActiveDoctorModal(null)}
                className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <img
                  src={activeDoctorModal.photoUrl}
                  alt={activeDoctorModal.name}
                  className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl object-cover object-top shadow-md border-2 border-teal-100 shrink-0"
                />
                <div className="space-y-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-600">
                    {activeDoctorModal.departmentName}
                  </span>
                  <h3 className="text-2xl font-extrabold text-slate-900">{activeDoctorModal.name}</h3>
                  <p className="text-sm font-semibold text-slate-700">{activeDoctorModal.title}</p>
                  <p className="text-xs text-slate-500">{activeDoctorModal.qualifications}</p>

                  <div className="flex items-center gap-3 pt-2">
                    <div className="flex items-center gap-1 bg-amber-50 text-amber-800 text-xs font-bold px-2.5 py-1 rounded-md border border-amber-200">
                      <Star className="w-3.5 h-3.5 fill-current text-amber-500" />
                      <span>{activeDoctorModal.rating} / 5.0 ({activeDoctorModal.reviewCount} reviews)</span>
                    </div>
                    <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
                      {activeDoctorModal.experienceYears}+ Years Clinical Practice
                    </span>
                  </div>
                </div>
              </div>

              {/* Bio & Education */}
              <div className="mt-6 space-y-4 pt-4 border-t border-slate-100">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Physician Overview</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">{activeDoctorModal.bio}</p>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Key Areas of Focus</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {activeDoctorModal.specializations.map((item) => (
                      <span
                        key={item}
                        className="text-xs font-medium bg-teal-50 text-teal-800 px-3 py-1 rounded-lg border border-teal-200/60"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Credentials & Training</h4>
                  <ul className="space-y-1.5 text-xs text-slate-600">
                    {activeDoctorModal.education.map((edu) => (
                      <li key={edu} className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                        <span>{edu}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="block text-xs text-slate-500">Regular OP Schedule</span>
                    <span className="text-xs font-bold text-slate-800">{activeDoctorModal.availability}</span>
                  </div>
                  <div>
                    <span className="block text-xs text-slate-500">Standard Consultation</span>
                    <span className="text-sm font-extrabold text-teal-600">{activeDoctorModal.consultationFee}</span>
                  </div>
                  <button
                    id="modal-book-doctor-action"
                    onClick={() => {
                      const doc = activeDoctorModal;
                      setActiveDoctorModal(null);
                      onBookWithDoctor(doc);
                    }}
                    className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md shadow-teal-600/20 transition-all"
                  >
                    Book with this Doctor
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
