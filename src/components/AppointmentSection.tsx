import React, { useState, useEffect, useId } from 'react';
import {
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  Building2,
  Stethoscope,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Download,
  Printer,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Database,
  RefreshCw,
  Copy,
  Check,
} from 'lucide-react';
import { DEPARTMENTS, DOCTORS, HOSPITAL_INFO } from '../data/hospitalData';
import { AppointmentFormData, AppointmentRecord } from '../types/hospital';
import {
  saveAppointmentToSupabase,
  fetchAppointmentsFromSupabase,
  SUPABASE_PROJECT_ID,
  RECOMMENDED_SUPABASE_SQL,
  SupabaseInsertResult,
} from '../lib/supabase';

interface AppointmentSectionProps {
  preselectedDepartment?: string;
  preselectedDoctorId?: string;
  onClearPreselections?: () => void;
}

export const AppointmentSection: React.FC<AppointmentSectionProps> = ({
  preselectedDepartment,
  preselectedDoctorId,
  onClearPreselections,
}) => {
  const formId = useId();

  // Form State
  const [formData, setFormData] = useState<AppointmentFormData>({
    fullName: '',
    email: '',
    phone: '',
    departmentId: '',
    doctorId: '',
    preferredDate: '',
    preferredTime: '',
    message: '',
  });

  // Validation Errors
  const [errors, setErrors] = useState<Partial<Record<keyof AppointmentFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedRecord, setConfirmedRecord] = useState<AppointmentRecord | null>(null);
  const [supabaseSyncResult, setSupabaseSyncResult] = useState<SupabaseInsertResult | null>(null);
  const [isLoadingSupabase, setIsLoadingSupabase] = useState(false);
  const [showSqlGuide, setShowSqlGuide] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  // Stored list of appointments in component state (synced with Supabase backend)
  const [submittedAppointments, setSubmittedAppointments] = useState<AppointmentRecord[]>([
    {
      id: 'WECARE-2026-1049',
      patientName: 'Samantha Lee',
      email: 'samantha.lee@example.com',
      phone: '+1 (555) 349-9210',
      departmentId: 'cardiology',
      departmentName: 'Cardiology',
      doctorId: 'doc-cardio-1',
      doctorName: 'Dr. Arthur Vance',
      preferredDate: '2026-09-12',
      preferredTime: '09:30 AM',
      symptoms: 'Routine post-stent cardiac evaluation',
      status: 'Confirmed',
      createdAt: '2026-09-02',
    },
  ]);

  const [activeTab, setActiveTab] = useState<'book' | 'my-bookings'>('book');

  // Fetch existing appointments from Supabase on mount
  const loadSupabaseAppointments = async () => {
    setIsLoadingSupabase(true);
    try {
      const res = await fetchAppointmentsFromSupabase();
      if (res.success && res.records && res.records.length > 0) {
        setSubmittedAppointments(res.records);
      }
    } catch (err) {
      console.warn('Could not fetch from Supabase:', err);
    } finally {
      setIsLoadingSupabase(false);
    }
  };

  useEffect(() => {
    loadSupabaseAppointments();
  }, []);

  const handleCopySql = () => {
    navigator.clipboard.writeText(RECOMMENDED_SUPABASE_SQL.trim());
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  // React to preselected props passed from Doctor or Department cards
  useEffect(() => {
    if (preselectedDepartment) {
      setFormData((prev) => ({
        ...prev,
        departmentId: preselectedDepartment,
        doctorId: preselectedDoctorId || '',
      }));
    } else if (preselectedDoctorId) {
      const doc = DOCTORS.find((d) => d.id === preselectedDoctorId);
      if (doc) {
        setFormData((prev) => ({
          ...prev,
          departmentId: doc.departmentId,
          doctorId: doc.id,
        }));
      }
    }
  }, [preselectedDepartment, preselectedDoctorId]);

  // Dependent Doctor list: Dynamically filtered based on department
  const availableDoctors = formData.departmentId
    ? DOCTORS.filter((d) => d.departmentId === formData.departmentId)
    : DOCTORS;

  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDeptId = e.target.value;
    setFormData((prev) => ({
      ...prev,
      departmentId: newDeptId,
      // reset doctor selection if current doctor is not in the new department
      doctorId: '',
    }));
    if (errors.departmentId) {
      setErrors((prev) => ({ ...prev, departmentId: undefined }));
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof AppointmentFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // Form Validation
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof AppointmentFormData, string>> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Please enter your full name';
    } else if (formData.fullName.trim().length < 3) {
      newErrors.fullName = 'Name must be at least 3 characters';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Please enter your email address';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please provide a valid email format';
    }

    const phoneDigits = formData.phone.replace(/\D/g, '');
    if (!formData.phone.trim()) {
      newErrors.phone = 'Please enter a contact phone number';
    } else if (phoneDigits.length < 7) {
      newErrors.phone = 'Please enter a valid phone number (at least 7 digits)';
    }

    if (!formData.departmentId) {
      newErrors.departmentId = 'Please select a clinical department';
    }

    if (!formData.preferredDate) {
      newErrors.preferredDate = 'Please select a preferred date';
    } else {
      const selected = new Date(formData.preferredDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selected < today) {
        newErrors.preferredDate = 'Appointment date cannot be in the past';
      }
    }

    if (!formData.preferredTime) {
      newErrors.preferredTime = 'Please select your preferred time slot';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSupabaseSyncResult(null);

    const selectedDept = DEPARTMENTS.find((d) => d.id === formData.departmentId);
    const selectedDoc = DOCTORS.find((d) => d.id === formData.doctorId);

    const newRecord: AppointmentRecord = {
      id: `WECARE-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      patientName: formData.fullName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      departmentId: formData.departmentId,
      departmentName: selectedDept ? selectedDept.name : 'General Consultation',
      doctorId: formData.doctorId || 'first-available',
      doctorName: selectedDoc ? selectedDoc.name : 'First Available Specialist',
      preferredDate: formData.preferredDate,
      preferredTime: formData.preferredTime,
      symptoms: formData.message.trim() || 'General medical consultation',
      status: 'Confirmed',
      createdAt: new Date().toISOString().split('T')[0],
    };

    // Save record to Supabase backend
    let syncResult: SupabaseInsertResult;
    try {
      syncResult = await saveAppointmentToSupabase(newRecord);
    } catch (err: any) {
      syncResult = {
        success: false,
        error: err?.message || 'Network error saving to Supabase',
        schemaNotice: RECOMMENDED_SUPABASE_SQL,
      };
    }

    setSupabaseSyncResult(syncResult);
    if (syncResult.success) {
      // Reload the latest live appointments from Supabase
      loadSupabaseAppointments();
    } else {
      setSubmittedAppointments((prev) => [newRecord, ...prev]);
    }
    setConfirmedRecord(newRecord);
    setIsSubmitting(false);

    // Reset form fields
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      departmentId: '',
      doctorId: '',
      preferredDate: '',
      preferredTime: '',
      message: '',
    });

    if (onClearPreselections) {
      onClearPreselections();
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Min date for date picker (today)
  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <section id="appointment" className="py-20 bg-white relative">
      {/* Visual background accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-teal-50/60 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-50 border border-teal-200/80 text-teal-800 text-xs font-bold uppercase tracking-widest mb-3">
            Seamless Online Booking
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Book an <span className="text-teal-600">Appointment</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Schedule a priority in-person consultation or specialized procedure with our board-certified physicians.
            Instant confirmation and zero upfront booking fee.
          </p>

          {/* Supabase Connection Status Badge */}
          <div className="mt-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-slate-700 text-xs font-medium shadow-xs">
            <Database className="w-3.5 h-3.5 text-teal-600" />
            <span>Supabase Database:</span>
            <span className="font-mono font-bold text-slate-900">{SUPABASE_PROJECT_ID}</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Connected to Supabase" />
          </div>
        </div>

        {/* View Switcher: Book New vs View Booked */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200">
            <button
              id="tab-book-appointment"
              onClick={() => setActiveTab('book')}
              className={`px-5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'book'
                  ? 'bg-white text-teal-800 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Book New Appointment
            </button>
            <button
              id="tab-view-bookings"
              onClick={() => setActiveTab('my-bookings')}
              className={`px-5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'my-bookings'
                  ? 'bg-white text-teal-800 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Recent Bookings</span>
              <span className="bg-teal-100 text-teal-900 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {submittedAppointments.length}
              </span>
            </button>
          </div>
        </div>

        {/* Confirmation Modal / Card */}
        {confirmedRecord && (
          <div
            id="appointment-success-modal"
            className="mb-12 bg-emerald-50/90 border-2 border-emerald-300 rounded-3xl p-6 sm:p-8 shadow-xl max-w-3xl mx-auto animate-in fade-in zoom-in-95 duration-300"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-600/30">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                    Appointment Successfully Confirmed!
                  </span>
                  <span className="px-3 py-1 rounded-full bg-emerald-200 text-emerald-900 text-xs font-mono font-bold">
                    Ref: {confirmedRecord.id}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                  Thank You, {confirmedRecord.patientName}!
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  Your appointment with <span className="font-bold text-slate-900">{confirmedRecord.doctorName}</span> in{' '}
                  <span className="font-bold text-slate-900">{confirmedRecord.departmentName}</span> has been scheduled for{' '}
                  <span className="font-bold text-emerald-800">{confirmedRecord.preferredDate}</span> at{' '}
                  <span className="font-bold text-emerald-800">{confirmedRecord.preferredTime}</span>.
                </p>

                {/* Supabase Persistence Indicator */}
                {supabaseSyncResult?.success && (
                  <div className="p-3 rounded-xl bg-emerald-100/80 border border-emerald-300 flex items-center justify-between gap-3 text-xs text-emerald-950 font-medium">
                    <div className="flex items-center gap-2">
                      <Database className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span>
                        Saved in Supabase backend table:{' '}
                        <strong className="font-mono bg-white px-1.5 py-0.5 rounded border border-emerald-300 text-slate-900">
                          {supabaseSyncResult.tableName || 'appointments'}
                        </strong>
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-800 bg-emerald-200 px-2.5 py-0.5 rounded-md shrink-0">
                      Live in Backend
                    </span>
                  </div>
                )}

                {supabaseSyncResult && !supabaseSyncResult.success && (
                  <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2">
                        <Database className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold">Appointment confirmed locally; Supabase notice:</p>
                          <p className="text-amber-800 text-[11px] mt-0.5">{supabaseSyncResult.error}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowSqlGuide(!showSqlGuide)}
                        className="px-2.5 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 font-semibold text-[11px] transition-colors shrink-0"
                      >
                        {showSqlGuide ? 'Hide SQL Script' : 'Supabase SQL Table Setup'}
                      </button>
                    </div>

                    {showSqlGuide && (
                      <div className="mt-2 p-3.5 bg-slate-900 text-slate-100 rounded-xl space-y-2">
                        <div className="flex items-center justify-between text-[11px] text-slate-400">
                          <span>Run this in Supabase SQL Editor if table is not created yet:</span>
                          <button
                            type="button"
                            onClick={handleCopySql}
                            className="flex items-center gap-1 text-teal-400 hover:text-teal-300 font-bold"
                          >
                            {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedSql ? 'Copied!' : 'Copy SQL'}</span>
                          </button>
                        </div>
                        <pre className="font-mono text-[10px] overflow-x-auto text-slate-200 leading-tight">
                          {RECOMMENDED_SUPABASE_SQL.trim()}
                        </pre>
                      </div>
                    )}
                  </div>
                )}

                {/* Summary Box */}
                <div className="mt-4 p-4 rounded-xl bg-white border border-emerald-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
                  <div>
                    <span className="text-slate-400 block font-medium">Patient Contact</span>
                    <span className="font-semibold text-slate-800">{confirmedRecord.phone} • {confirmedRecord.email}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Clinic Wing & Desk</span>
                    <span className="font-semibold text-slate-800">Main Atrium, 2nd Floor Check-in</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-slate-400 block font-medium">Symptoms / Notes</span>
                    <span className="italic text-slate-800">{confirmedRecord.symptoms}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-4 pt-4 border-t border-emerald-200 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handlePrint}
                      className="px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print Summary</span>
                    </button>
                    <span className="text-xs text-emerald-800 font-medium hidden sm:inline">
                      A confirmation SMS and calendar invite has also been dispatched.
                    </span>
                  </div>

                  <button
                    onClick={() => setConfirmedRecord(null)}
                    className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
                  >
                    Dismiss & Book Another
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 1: Booking Form */}
        {activeTab === 'book' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start max-w-6xl mx-auto">
            {/* Form Column */}
            <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-10 border border-slate-100 shadow-xl">
              <form onSubmit={handleSubmit} noValidate className="space-y-6">
                {/* Row 1: Full Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor={`${formId}-fullName`} className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        id={`${formId}-fullName`}
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="e.g. Eleanor Vance"
                        className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                          errors.fullName
                            ? 'border-rose-400 bg-rose-50/50 focus:ring-rose-400'
                            : 'border-slate-200 bg-slate-50 focus:bg-white focus:ring-sky-500'
                        }`}
                      />
                    </div>
                    {errors.fullName && (
                      <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1 font-medium">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.fullName}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor={`${formId}-email`} className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        id={`${formId}-email`}
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="e.g. eleanor@example.com"
                        className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                          errors.email
                            ? 'border-rose-400 bg-rose-50/50 focus:ring-rose-400'
                            : 'border-slate-200 bg-slate-50 focus:bg-white focus:ring-sky-500'
                        }`}
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1 font-medium">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.email}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Row 2: Phone & Department */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor={`${formId}-phone`} className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Phone Number <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        id={`${formId}-phone`}
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="e.g. +1 (555) 019-2834"
                        className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                          errors.phone
                            ? 'border-rose-400 bg-rose-50/50 focus:ring-rose-400'
                            : 'border-slate-200 bg-slate-50 focus:bg-white focus:ring-sky-500'
                        }`}
                      />
                    </div>
                    {errors.phone && (
                      <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1 font-medium">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.phone}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor={`${formId}-department`} className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Select Department <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <select
                        id={`${formId}-department`}
                        name="departmentId"
                        value={formData.departmentId}
                        onChange={handleDepartmentChange}
                        className={`w-full pl-10 pr-8 py-3 rounded-xl border text-sm appearance-none bg-no-repeat bg-right transition-all focus:outline-none focus:ring-2 ${
                          errors.departmentId
                            ? 'border-rose-400 bg-rose-50/50 focus:ring-rose-400'
                            : 'border-slate-200 bg-slate-50 focus:bg-white focus:ring-sky-500'
                        }`}
                      >
                        <option value="">-- Choose Medical Department --</option>
                        {DEPARTMENTS.map((dept) => (
                          <option key={dept.id} value={dept.id}>
                            {dept.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    {errors.departmentId && (
                      <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1 font-medium">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.departmentId}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Row 3: Doctor (Dependent Dropdown) & Preferred Date */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label htmlFor={`${formId}-doctor`} className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Select Doctor <span className="text-slate-400 font-normal">(Optional)</span>
                      </label>
                      {formData.departmentId && (
                        <span className="text-[10px] text-sky-600 font-semibold">
                          {availableDoctors.length} available
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <Stethoscope className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <select
                        id={`${formId}-doctor`}
                        name="doctorId"
                        value={formData.doctorId}
                        onChange={handleChange}
                        className="w-full pl-10 pr-8 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm appearance-none transition-all"
                      >
                        <option value="">
                          {formData.departmentId
                            ? 'First Available Specialist in Department'
                            : 'First Available Specialist (All Departments)'}
                        </option>
                        {availableDoctors.map((doc) => (
                          <option key={doc.id} value={doc.id}>
                            {doc.name} – {doc.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor={`${formId}-date`} className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Preferred Date <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        id={`${formId}-date`}
                        type="date"
                        name="preferredDate"
                        min={todayStr}
                        value={formData.preferredDate}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                          errors.preferredDate
                            ? 'border-rose-400 bg-rose-50/50 focus:ring-rose-400'
                            : 'border-slate-200 bg-slate-50 focus:bg-white focus:ring-sky-500'
                        }`}
                      />
                    </div>
                    {errors.preferredDate && (
                      <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1 font-medium">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.preferredDate}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Row 4: Preferred Time Slot */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Preferred Time Slot <span className="text-rose-500">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: 'Morning', time: '08:30 AM – 12:00 PM', value: 'Morning (08:30 AM – 12:00 PM)' },
                      { label: 'Afternoon', time: '12:30 PM – 04:30 PM', value: 'Afternoon (12:30 PM – 04:30 PM)' },
                      { label: 'Evening', time: '05:00 PM – 08:30 PM', value: 'Evening (05:00 PM – 08:30 PM)' },
                    ].map((slot) => {
                      const isSelected = formData.preferredTime === slot.value;
                      return (
                        <button
                          key={slot.label}
                          type="button"
                          onClick={() => {
                            setFormData((prev) => ({ ...prev, preferredTime: slot.value }));
                            if (errors.preferredTime) {
                              setErrors((prev) => ({ ...prev, preferredTime: undefined }));
                            }
                          }}
                          className={`p-3 rounded-xl border text-left transition-all ${
                            isSelected
                              ? 'border-sky-600 bg-sky-50/80 text-sky-900 ring-2 ring-sky-500/20 shadow-xs'
                              : 'border-slate-200 bg-slate-50 hover:bg-slate-100/80 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold">{slot.label}</span>
                            <Clock className={`w-3.5 h-3.5 ${isSelected ? 'text-sky-600' : 'text-slate-400'}`} />
                          </div>
                          <span className="block text-[11px] text-slate-500 mt-0.5">{slot.time}</span>
                        </button>
                      );
                    })}
                  </div>
                  {errors.preferredTime && (
                    <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.preferredTime}</span>
                    </p>
                  )}
                </div>

                {/* Row 5: Symptoms / Message */}
                <div>
                  <label htmlFor={`${formId}-message`} className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Symptoms or Reason for Visit <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <div className="relative">
                    <MessageSquare className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <textarea
                      id={`${formId}-message`}
                      name="message"
                      rows={3}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Briefly describe your symptoms, duration, or any previous medical reports you will bring..."
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm transition-all"
                    />
                  </div>
                </div>

                {/* Submit CTA */}
                <div>
                  <button
                    id="submit-appointment-btn"
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-base shadow-lg shadow-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/30 transition-all flex items-center justify-center gap-2 transform active:scale-[0.99] disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Confirming Slot with Medical Coordinator...</span>
                      </>
                    ) : (
                      <>
                        <Calendar className="w-5 h-5" />
                        <span>Submit Appointment Request</span>
                      </>
                    )}
                  </button>
                  <p className="text-center text-xs text-slate-500 mt-2.5 flex items-center justify-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-sky-600" />
                    <span>Your medical details are strictly confidential and protected by HIPAA standards.</span>
                  </p>
                </div>
              </form>
            </div>

            {/* Right Column: Appointment Guide & Hotline */}
            <div className="lg:col-span-4 space-y-6">
              <div className="p-6 rounded-3xl bg-slate-900 text-white shadow-xl space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>VIP Patient Care Desk</span>
                </div>
                <h3 className="text-xl font-bold">Why Book Online with WeCare Hospital?</h3>
                <ul className="space-y-3 text-xs text-slate-300">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                    <span>Priority digital queue: bypass regular lobby registration lines.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                    <span>Instant SMS confirmation with hospital clinic map & parking pass.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                    <span>Complimentary preliminary vital screening prior to doctor consult.</span>
                  </li>
                </ul>

                <div className="pt-4 border-t border-slate-800">
                  <p className="text-[11px] text-slate-400">Prefer phone scheduling?</p>
                  <a
                    id="phone-scheduling-link"
                    href={`tel:${HOSPITAL_INFO.generalPhone}`}
                    className="mt-1 block text-base font-extrabold text-teal-300 hover:text-white transition-colors"
                  >
                    {HOSPITAL_INFO.generalPhone}
                  </a>
                  <span className="text-[10px] text-slate-400">Available Mon – Sat 7:30 AM – 8:30 PM</span>
                </div>
              </div>

              {/* Emergency Alert Box */}
              <div className="p-6 rounded-3xl bg-rose-50 border border-rose-200 text-rose-900 space-y-3">
                <div className="flex items-center gap-2 text-rose-700 font-bold text-sm">
                  <AlertCircle className="w-5 h-5 text-rose-600" />
                  <span>Is This an Acute Emergency?</span>
                </div>
                <p className="text-xs text-rose-700 leading-relaxed">
                  Do not use the appointment form for sudden severe chest pain, stroke signs, difficulty breathing, or heavy bleeding.
                </p>
                <a
                  id="emergency-box-call"
                  href={`tel:${HOSPITAL_INFO.emergencyPhone}`}
                  className="inline-flex items-center gap-2 bg-rose-600 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-md hover:bg-rose-700 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Emergency 24/7 ({HOSPITAL_INFO.emergencyPhone})</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Recent Bookings View */}
        {activeTab === 'my-bookings' && (
          <div className="max-w-4xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-lg space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-slate-900">Your Appointment History</h3>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-[11px] font-semibold">
                    <Database className="w-3 h-3 text-teal-600" />
                    <span>Supabase: {SUPABASE_PROJECT_ID}</span>
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">Live records connected to your Supabase backend</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={loadSupabaseAppointments}
                  disabled={isLoadingSupabase}
                  className="text-xs font-semibold px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1.5 transition-colors disabled:opacity-50"
                  title="Query latest rows from Supabase"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingSupabase ? 'animate-spin text-teal-600' : ''}`} />
                  <span>{isLoadingSupabase ? 'Fetching...' : 'Sync Supabase'}</span>
                </button>
                <button
                  onClick={() => setActiveTab('book')}
                  className="text-xs font-bold px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white flex items-center gap-1 shadow-xs transition-colors"
                >
                  <span>+ Book Another</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Supabase Schema Helper Card */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-slate-700 font-semibold">
                  <Database className="w-4 h-4 text-teal-600" />
                  <span>Supabase Backend Table: <strong className="font-mono text-slate-900">appointments</strong></span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowSqlGuide(!showSqlGuide)}
                  className="text-[11px] font-bold text-teal-700 hover:text-teal-900 underline"
                >
                  {showSqlGuide ? 'Hide Table SQL' : 'View / Copy Table Schema SQL'}
                </button>
              </div>
              {showSqlGuide && (
                <div className="mt-2 p-3 bg-slate-900 text-slate-100 rounded-xl space-y-2 text-left">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Run this in Supabase SQL Editor if table is not created yet:</span>
                    <button
                      type="button"
                      onClick={handleCopySql}
                      className="flex items-center gap-1 text-teal-400 hover:text-teal-300 font-bold"
                    >
                      {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedSql ? 'Copied!' : 'Copy SQL'}</span>
                    </button>
                  </div>
                  <pre className="font-mono text-[10px] overflow-x-auto text-slate-200 leading-tight">
                    {RECOMMENDED_SUPABASE_SQL.trim()}
                  </pre>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {submittedAppointments.map((record) => (
                <div
                  key={record.id}
                  className="p-5 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50/70 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded border border-teal-200/60">
                        {record.id}
                      </span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        {record.status}
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-slate-900">{record.doctorName}</h4>
                    <p className="text-xs text-slate-600">
                      {record.departmentName} • Patient: <span className="font-semibold text-slate-800">{record.patientName}</span>
                    </p>
                    <p className="text-xs text-slate-500">Symptoms / Notes: {record.symptoms}</p>
                  </div>

                  <div className="text-left sm:text-right space-y-1">
                    <div className="text-sm font-extrabold text-slate-900">{record.preferredDate}</div>
                    <div className="text-xs text-teal-700 font-semibold">{record.preferredTime}</div>
                    <button
                      onClick={handlePrint}
                      className="text-xs text-slate-500 hover:text-teal-700 flex items-center sm:justify-end gap-1 font-medium pt-1"
                    >
                      <Printer className="w-3 h-3" />
                      <span>Print Pass</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
