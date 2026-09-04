import React, { useState, useEffect, useMemo } from 'react';
import {
  Shield,
  Database,
  RefreshCw,
  Search,
  Filter,
  Download,
  Printer,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  Stethoscope,
  Trash2,
  CheckCircle2,
  AlertCircle,
  XCircle,
  ArrowLeft,
  LogOut,
  ExternalLink,
  ChevronDown,
  Eye,
  SlidersHorizontal,
  FileText,
  Lock,
} from 'lucide-react';
import { AppointmentRecord } from '../types/hospital';
import {
  fetchAppointmentsFromSupabase,
  updateAppointmentInSupabase,
  deleteAppointmentFromSupabase,
  SUPABASE_PROJECT_ID,
} from '../lib/supabase';
import { AdminUser, logoutAdmin } from '../lib/adminAuth';
import { DEPARTMENTS } from '../data/hospitalData';

interface AdminPanelProps {
  adminUser: AdminUser;
  onLogout: () => void;
  onBackToWebsite: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  adminUser,
  onLogout,
  onBackToWebsite,
}) => {
  const [appointments, setAppointments] = useState<AppointmentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'upcoming'>('all');

  // Detail modal state
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentRecord | null>(null);

  // Delete confirmation
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadBookings = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetchAppointmentsFromSupabase();
      if (res.success) {
        setAppointments(res.records);
      } else {
        setErrorMessage(res.error || 'Could not fetch appointments from Supabase.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Error communicating with Supabase database.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const triggerToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  // Status update handler
  const handleStatusChange = async (recordId: string, newStatus: 'Confirmed' | 'Completed' | 'Cancelled') => {
    // Optimistic UI update
    setAppointments((prev) =>
      prev.map((item) => (item.id === recordId ? { ...item, status: newStatus } : item))
    );

    const res = await updateAppointmentInSupabase(recordId, { status: newStatus });
    if (res.success) {
      triggerToast(`Appointment ${recordId} updated to "${newStatus}" in Supabase.`);
    } else {
      setErrorMessage(`Failed to update status in Supabase: ${res.error}`);
      loadBookings(); // Rollback
    }
  };

  // Delete booking handler
  const handleDeleteBooking = async (recordId: string) => {
    if (!window.confirm(`Are you sure you want to delete appointment ${recordId} from Supabase?`)) {
      return;
    }

    setDeletingId(recordId);
    const res = await deleteAppointmentFromSupabase(recordId);
    setDeletingId(null);

    if (res.success) {
      setAppointments((prev) => prev.filter((item) => item.id !== recordId));
      triggerToast(`Appointment ${recordId} was permanently deleted from Supabase.`);
      if (selectedAppointment?.id === recordId) {
        setSelectedAppointment(null);
      }
    } else {
      setErrorMessage(`Failed to delete appointment: ${res.error}`);
    }
  };

  // Export to CSV
  const handleExportCsv = () => {
    if (filteredAppointments.length === 0) {
      alert('No appointments match current filters to export.');
      return;
    }

    const headers = [
      'Appointment ID',
      'Patient Name',
      'Email',
      'Phone',
      'Department',
      'Doctor Name',
      'Preferred Date',
      'Preferred Time',
      'Symptoms / Notes',
      'Status',
      'Created At',
    ];

    const rows = filteredAppointments.map((a) => [
      `"${a.id}"`,
      `"${a.patientName}"`,
      `"${a.email}"`,
      `"${a.phone}"`,
      `"${a.departmentName}"`,
      `"${a.doctorName}"`,
      `"${a.preferredDate}"`,
      `"${a.preferredTime}"`,
      `"${(a.symptoms || '').replace(/"/g, '""')}"`,
      `"${a.status}"`,
      `"${a.createdAt}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `wecare_hospital_bookings_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  // Filtered appointments computation
  const filteredAppointments = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];

    return appointments.filter((app) => {
      // Search term
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matches =
          app.id.toLowerCase().includes(query) ||
          app.patientName.toLowerCase().includes(query) ||
          app.email.toLowerCase().includes(query) ||
          app.phone.toLowerCase().includes(query) ||
          app.doctorName.toLowerCase().includes(query) ||
          app.departmentName.toLowerCase().includes(query) ||
          app.symptoms.toLowerCase().includes(query);
        if (!matches) return false;
      }

      // Department filter
      if (selectedDept !== 'all' && app.departmentId !== selectedDept) {
        return false;
      }

      // Status filter
      if (selectedStatus !== 'all' && app.status !== selectedStatus) {
        return false;
      }

      // Date filter
      if (dateFilter === 'today') {
        if (app.preferredDate !== todayStr) return false;
      } else if (dateFilter === 'upcoming') {
        if (app.preferredDate < todayStr) return false;
      }

      return true;
    });
  }, [appointments, searchTerm, selectedDept, selectedStatus, dateFilter]);

  // Quick statistics
  const stats = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const total = appointments.length;
    const confirmed = appointments.filter((a) => a.status === 'Confirmed').length;
    const completed = appointments.filter((a) => a.status === 'Completed').length;
    const cancelled = appointments.filter((a) => a.status === 'Cancelled').length;
    const todayCount = appointments.filter((a) => a.preferredDate === todayStr).length;

    return { total, confirmed, completed, cancelled, todayCount };
  }, [appointments]);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Admin Panel Header */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Brand & Context */}
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToWebsite}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-semibold"
              title="Return to public hospital website"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Hospital Site</span>
            </button>

            <div className="h-6 w-px bg-slate-800 hidden sm:block" />

            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-white tracking-tight">
                  WeCare <span className="text-teal-400">Admin Console</span>
                </span>
                <span className="px-2 py-0.5 rounded-md bg-teal-500/20 text-teal-300 border border-teal-500/30 text-[10px] font-mono font-bold">
                  v2.0
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Central Clinical Scheduling & Patient Booking Management
              </p>
            </div>
          </div>

          {/* Connected Backend & Master Admin Info */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            {/* Supabase status badge */}
            <div className="px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center gap-2 text-slate-300">
              <Database className="w-3.5 h-3.5 text-teal-400 shrink-0" />
              <span className="text-[11px]">
                Supabase: <strong className="font-mono text-white">{SUPABASE_PROJECT_ID}</strong>
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            {/* Admin Profile indicator */}
            <div className="px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center gap-2 text-slate-300">
              <User className="w-3.5 h-3.5 text-teal-400 shrink-0" />
              <div className="text-left">
                <span className="font-bold text-white block text-[11px] leading-tight">
                  {adminUser.fullName}
                </span>
                <span className="text-[9px] text-teal-300 block font-medium">
                  Single Master Slot (Claimed)
                </span>
              </div>
            </div>

            {/* Logout button */}
            <button
              onClick={() => {
                logoutAdmin();
                onLogout();
              }}
              className="p-2 rounded-xl bg-rose-950/50 hover:bg-rose-900 border border-rose-800 text-rose-300 hover:text-white transition-colors flex items-center gap-1 text-xs font-semibold"
              title="Log out of Admin Portal"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Toast Notification */}
        {successToast && (
          <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-emerald-900 text-white border border-emerald-700 shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="text-xs font-medium">{successToast}</span>
          </div>
        )}

        {/* Error Notification */}
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start justify-between gap-3 shadow-xs">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Database Error:</p>
                <p className="mt-0.5">{errorMessage}</p>
              </div>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-rose-600 hover:text-rose-800 font-bold text-xs"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Top Summary KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Total Bookings
            </span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-black text-slate-900">{stats.total}</span>
              <FileText className="w-4 h-4 text-slate-400" />
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">Live in Supabase</span>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider block">
              Confirmed
            </span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-black text-emerald-700">{stats.confirmed}</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
            <span className="text-[11px] text-emerald-600 mt-1 block">Active patient visits</span>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <span className="text-xs font-semibold text-teal-700 uppercase tracking-wider block">
              Today's Visits
            </span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-black text-teal-700">{stats.todayCount}</span>
              <Calendar className="w-4 h-4 text-teal-500" />
            </div>
            <span className="text-[11px] text-teal-600 mt-1 block">Scheduled for today</span>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <span className="text-xs font-semibold text-sky-700 uppercase tracking-wider block">
              Completed
            </span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-black text-sky-700">{stats.completed}</span>
              <CheckCircle2 className="w-4 h-4 text-sky-500" />
            </div>
            <span className="text-[11px] text-sky-600 mt-1 block">Finished visits</span>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs col-span-2 sm:col-span-1">
            <span className="text-xs font-semibold text-rose-700 uppercase tracking-wider block">
              Cancelled
            </span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-black text-rose-700">{stats.cancelled}</span>
              <XCircle className="w-4 h-4 text-rose-500" />
            </div>
            <span className="text-[11px] text-rose-600 mt-1 block">Voided requests</span>
          </div>
        </div>

        {/* Toolbar & Filter Bar */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Search input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by patient name, phone, email, doctor, ID..."
                className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-colors"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={loadBookings}
                disabled={isLoading}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
                title="Reload data from Supabase backend"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-teal-600' : ''}`} />
                <span>{isLoading ? 'Syncing...' : 'Sync Supabase'}</span>
              </button>

              <button
                onClick={handleExportCsv}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-1.5 transition-colors"
                title="Export matching bookings as CSV spreadsheet"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>

              <button
                onClick={handlePrint}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-1.5 transition-colors"
                title="Print appointments list"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print</span>
              </button>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-3 text-xs">
            <span className="font-semibold text-slate-500 flex items-center gap-1 text-[11px]">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters:</span>
            </span>

            {/* Department selector */}
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="py-1.5 px-3 rounded-lg border border-slate-300 text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="all">All Clinical Departments</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>

            {/* Status Tabs */}
            <div className="flex rounded-lg bg-slate-100 p-0.5 border border-slate-200">
              {(['all', 'Confirmed', 'Completed', 'Cancelled'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`px-3 py-1 rounded-md font-semibold text-[11px] transition-colors ${
                    selectedStatus === status
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {status === 'all' ? 'All Status' : status}
                </button>
              ))}
            </div>

            {/* Date Filters */}
            <div className="flex rounded-lg bg-slate-100 p-0.5 border border-slate-200">
              {(
                [
                  { id: 'all', label: 'All Dates' },
                  { id: 'today', label: 'Today' },
                  { id: 'upcoming', label: 'Upcoming' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setDateFilter(tab.id)}
                  className={`px-3 py-1 rounded-md font-semibold text-[11px] transition-colors ${
                    dateFilter === tab.id
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <span className="ml-auto text-slate-400 text-[11px]">
              Showing <strong>{filteredAppointments.length}</strong> of <strong>{appointments.length}</strong> bookings
            </span>
          </div>
        </div>

        {/* Bookings Data Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center space-y-3">
              <RefreshCw className="w-8 h-8 text-teal-600 animate-spin mx-auto" />
              <p className="text-sm font-semibold text-slate-700">Connecting to Supabase and loading patient bookings...</p>
              <p className="text-xs text-slate-400">Project: {SUPABASE_PROJECT_ID} • Table: appointments</p>
            </div>
          ) : filteredAppointments.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <FileText className="w-10 h-10 text-slate-300 mx-auto" />
              <h4 className="text-base font-bold text-slate-800">No Patient Bookings Found</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {searchTerm || selectedDept !== 'all' || selectedStatus !== 'all'
                  ? 'No appointments matched your current search or filter criteria. Try resetting filters.'
                  : 'No appointments have been booked on the website yet, or none have synced to Supabase.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3.5">Booking Reference</th>
                    <th className="px-4 py-3.5">Patient Details</th>
                    <th className="px-4 py-3.5">Department & Specialist</th>
                    <th className="px-4 py-3.5">Scheduled Slot</th>
                    <th className="px-4 py-3.5">Symptoms / Notes</th>
                    <th className="px-4 py-3.5">Status</th>
                    <th className="px-4 py-3.5 text-right">Admin Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAppointments.map((record) => (
                    <tr key={record.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* ID & date booked */}
                      <td className="px-4 py-4 align-top">
                        <span className="font-mono font-bold text-slate-900 block">
                          {record.id}
                        </span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          Booked: {record.createdAt}
                        </span>
                      </td>

                      {/* Patient Details */}
                      <td className="px-4 py-4 align-top space-y-1">
                        <span className="font-bold text-slate-900 block text-xs">
                          {record.patientName}
                        </span>
                        <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                          <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                          <a href={`tel:${record.phone}`} className="hover:text-teal-600">
                            {record.phone}
                          </a>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                          <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                          <a href={`mailto:${record.email}`} className="hover:text-teal-600 truncate max-w-[150px]">
                            {record.email}
                          </a>
                        </div>
                      </td>

                      {/* Department & Doctor */}
                      <td className="px-4 py-4 align-top space-y-0.5">
                        <span className="font-semibold text-slate-800 block">
                          {record.departmentName}
                        </span>
                        <span className="text-slate-500 text-[11px] block">
                          {record.doctorName}
                        </span>
                      </td>

                      {/* Scheduled Date & Time */}
                      <td className="px-4 py-4 align-top space-y-0.5">
                        <div className="flex items-center gap-1.5 text-slate-800 font-semibold">
                          <Calendar className="w-3 h-3 text-teal-600 shrink-0" />
                          <span>{record.preferredDate}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                          <Clock className="w-3 h-3 text-teal-600 shrink-0" />
                          <span>{record.preferredTime}</span>
                        </div>
                      </td>

                      {/* Symptoms */}
                      <td className="px-4 py-4 align-top max-w-[200px]">
                        <p className="text-slate-600 line-clamp-2 text-[11px]">
                          {record.symptoms || 'General medical consultation'}
                        </p>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4 align-top">
                        <div className="relative inline-block">
                          <select
                            value={record.status}
                            onChange={(e) =>
                              handleStatusChange(
                                record.id,
                                e.target.value as 'Confirmed' | 'Completed' | 'Cancelled'
                              )
                            }
                            className={`font-semibold text-[11px] px-2.5 py-1 rounded-full border appearance-none pr-6 cursor-pointer transition-colors ${
                              record.status === 'Confirmed'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                                : record.status === 'Completed'
                                ? 'bg-sky-50 text-sky-800 border-sky-300 hover:bg-sky-100'
                                : 'bg-rose-50 text-rose-800 border-rose-300 hover:bg-rose-100'
                            }`}
                          >
                            <option value="Confirmed">Confirmed</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                          <ChevronDown className="w-3 h-3 text-slate-500 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                      </td>

                      {/* Action buttons */}
                      <td className="px-4 py-4 align-top text-right space-x-1 whitespace-nowrap">
                        <button
                          onClick={() => setSelectedAppointment(record)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-teal-700 hover:bg-slate-100 transition-colors"
                          title="View clinical booking details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteBooking(record.id)}
                          disabled={deletingId === record.id}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors disabled:opacity-50"
                          title="Delete from Supabase"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Appointment Details Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="bg-slate-900 text-white p-6 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-teal-400 font-bold uppercase tracking-wider block">
                  Patient Booking Record
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">{selectedAppointment.id}</h3>
              </div>
              <button
                onClick={() => setSelectedAppointment(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs text-slate-700">
              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-100">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Patient Name</span>
                  <span className="font-bold text-slate-900 text-sm">{selectedAppointment.patientName}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Current Status</span>
                  <span
                    className={`inline-block font-bold text-xs px-2.5 py-0.5 rounded-full mt-0.5 ${
                      selectedAppointment.status === 'Confirmed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : selectedAppointment.status === 'Completed'
                        ? 'bg-sky-100 text-sky-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {selectedAppointment.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Contact Email</span>
                  <a href={`mailto:${selectedAppointment.email}`} className="text-teal-700 font-semibold underline">
                    {selectedAppointment.email}
                  </a>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Contact Phone</span>
                  <a href={`tel:${selectedAppointment.phone}`} className="text-teal-700 font-semibold underline">
                    {selectedAppointment.phone}
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Department</span>
                  <span className="font-semibold text-slate-800">{selectedAppointment.departmentName}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Attending Physician</span>
                  <span className="font-semibold text-slate-800">{selectedAppointment.doctorName}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Consultation Date</span>
                  <span className="font-semibold text-slate-800">{selectedAppointment.preferredDate}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Time Window</span>
                  <span className="font-semibold text-slate-800">{selectedAppointment.preferredTime}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 text-[10px] uppercase font-bold block mb-1">
                  Symptoms & Clinical Remarks
                </span>
                <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                  {selectedAppointment.symptoms || 'No specific clinical symptoms submitted.'}
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedAppointment(null)}
                  className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors"
                >
                  Close Record
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
