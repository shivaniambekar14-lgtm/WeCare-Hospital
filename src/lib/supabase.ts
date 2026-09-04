import { createClient } from '@supabase/supabase-js';
import { AppointmentRecord } from '../types/hospital';

// Supabase project credentials provided by the user
export const SUPABASE_PROJECT_ID = 'rcrcchbdizkpolahjtqj';
export const SUPABASE_URL =
  (import.meta.env.VITE_SUPABASE_URL as string) ||
  `https://${SUPABASE_PROJECT_ID}.supabase.co`;

export const SUPABASE_ANON_KEY =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string) ||
  (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string) ||
  'sb_publishable_oiPBOlVchKHzT1wMYWxhuQ_AvM_74A0';

// Initialize the Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export interface SupabaseInsertResult {
  success: boolean;
  data?: any;
  error?: string;
  tableName?: string;
  schemaNotice?: string;
}

/**
 * Recommended SQL query if the user needs to create or verify the table in Supabase SQL Editor
 */
export const RECOMMENDED_SUPABASE_SQL = `
-- Run this in your Supabase SQL Editor if table 'appointments' does not exist yet:
CREATE TABLE IF NOT EXISTS appointments (
  id BIGSERIAL PRIMARY KEY,
  reference_id TEXT,
  patient_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  department_id TEXT,
  department_name TEXT,
  doctor_id TEXT,
  doctor_name TEXT,
  preferred_date DATE,
  preferred_time TEXT,
  symptoms TEXT,
  status TEXT DEFAULT 'Confirmed',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable public read & insert policies for web booking form:
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public inserts on appointments" 
  ON appointments FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Allow public reads on appointments" 
  ON appointments FOR SELECT 
  USING (true);
`;

/**
 * Inserts an appointment record into Supabase backend
 */
export async function saveAppointmentToSupabase(
  record: AppointmentRecord
): Promise<SupabaseInsertResult> {
  const tableNames = ['appointments', 'appointment_bookings'];

  // Primary standard payload matching the table schema
  const primaryPayload = {
    id: record.id,
    patient_name: record.patientName,
    email: record.email,
    phone: record.phone,
    department_id: record.departmentId,
    department_name: record.departmentName,
    doctor_id: record.doctorId,
    doctor_name: record.doctorName,
    preferred_date: record.preferredDate,
    preferred_time: record.preferredTime,
    symptoms: record.symptoms,
    status: record.status || 'Confirmed',
  };

  // Alternative payload without 'id' if the table uses an auto-generated integer/bigserial id
  const payloadWithoutId = {
    reference_id: record.id,
    patient_name: record.patientName,
    email: record.email,
    phone: record.phone,
    department_id: record.departmentId,
    department_name: record.departmentName,
    doctor_id: record.doctorId,
    doctor_name: record.doctorName,
    preferred_date: record.preferredDate,
    preferred_time: record.preferredTime,
    symptoms: record.symptoms,
    status: record.status || 'Confirmed',
  };

  // Alternative camelCase payload in case table schema was created with camelCase
  const camelPayload = {
    id: record.id,
    patientName: record.patientName,
    email: record.email,
    phone: record.phone,
    departmentId: record.departmentId,
    departmentName: record.departmentName,
    doctorId: record.doctorId,
    doctorName: record.doctorName,
    preferredDate: record.preferredDate,
    preferredTime: record.preferredTime,
    symptoms: record.symptoms,
    status: record.status || 'Confirmed',
  };

  for (const tableName of tableNames) {
    // 1. Try primary insert with id and snake_case fields
    const res1 = await supabase.from(tableName).insert([primaryPayload]).select();
    if (!res1.error) {
      console.log(`[Supabase] Appointment successfully saved to '${tableName}':`, res1.data);
      return { success: true, data: res1.data, tableName };
    }

    console.warn(`[Supabase] Primary insert into '${tableName}' failed:`, res1.error);

    // If id type mismatch or column mismatch, try alternative payloads
    if (
      res1.error.message.includes('column') ||
      res1.error.code === 'PGRST204' ||
      res1.error.code === '22P02' ||
      res1.error.message.includes('integer') ||
      res1.error.message.includes('bigint')
    ) {
      // 2. Try without id (or with reference_id) in case id is an auto-incrementing serial
      const res2 = await supabase.from(tableName).insert([payloadWithoutId]).select();
      if (!res2.error) {
        console.log(`[Supabase] Saved without explicit id to '${tableName}':`, res2.data);
        return { success: true, data: res2.data, tableName };
      }

      // 3. Try camelCase insert
      const res3 = await supabase.from(tableName).insert([camelPayload]).select();
      if (!res3.error) {
        console.log(`[Supabase] Saved with camelCase to '${tableName}':`, res3.data);
        return { success: true, data: res3.data, tableName };
      }
    }

    // If table doesn't exist (42P01 or PGRST200 / not found), continue loop to try appointment_bookings
    if (
      res1.error.code === '42P01' ||
      res1.error.message.includes('does not exist') ||
      res1.error.message.includes('relation')
    ) {
      continue;
    }

    // If permission or RLS error
    if (res1.error.code === '42501' || res1.error.message.includes('policy')) {
      return {
        success: false,
        error: `Supabase RLS Policy: ${res1.error.message}. Please allow INSERT permissions on table '${tableName}'.`,
        tableName,
        schemaNotice: RECOMMENDED_SUPABASE_SQL,
      };
    }

    // Other error
    return {
      success: false,
      error: res1.error.message,
      tableName,
      schemaNotice: RECOMMENDED_SUPABASE_SQL,
    };
  }

  // If none of the tables existed yet
  return {
    success: false,
    error: `Supabase table 'appointments' not found in project ${SUPABASE_PROJECT_ID}.`,
    schemaNotice: RECOMMENDED_SUPABASE_SQL,
  };
}

/**
 * Fetches appointments saved in Supabase
 */
export async function fetchAppointmentsFromSupabase(): Promise<{
  success: boolean;
  records: AppointmentRecord[];
  error?: string;
}> {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return { success: false, records: [], error: error.message };
    }

    if (!data || !Array.isArray(data)) {
      return { success: true, records: [] };
    }

    const records: AppointmentRecord[] = data.map((item: any, idx: number) => ({
      id:
        item.reference_id ||
        item.id?.toString() ||
        `WECARE-${new Date().getFullYear()}-${1000 + idx}`,
      patientName: item.patient_name || item.patientName || item.name || 'Anonymous Patient',
      email: item.email || '',
      phone: item.phone || '',
      departmentId: item.department_id || item.departmentId || 'cardiology',
      departmentName: item.department_name || item.departmentName || item.department || 'General',
      doctorId: item.doctor_id || item.doctorId || 'doc-1',
      doctorName: item.doctor_name || item.doctorName || item.doctor || 'Attending Physician',
      preferredDate: item.preferred_date || item.preferredDate || item.date || '',
      preferredTime: item.preferred_time || item.preferredTime || item.time || '',
      symptoms: item.symptoms || item.message || 'Consultation',
      status: (item.status as any) || 'Confirmed',
      createdAt: item.created_at
        ? new Date(item.created_at).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],
    }));

    return { success: true, records };
  } catch (err: any) {
    return { success: false, records: [], error: err?.message || 'Failed to fetch from Supabase' };
  }
}

/**
 * Updates an appointment status or fields in Supabase
 */
export async function updateAppointmentInSupabase(
  id: string,
  updates: Partial<AppointmentRecord>
): Promise<{ success: boolean; error?: string }> {
  try {
    const payload: Record<string, any> = {};
    if (updates.status) payload.status = updates.status;
    if (updates.doctorName) payload.doctor_name = updates.doctorName;
    if (updates.preferredDate) payload.preferred_date = updates.preferredDate;
    if (updates.preferredTime) payload.preferred_time = updates.preferredTime;
    if (updates.symptoms) payload.symptoms = updates.symptoms;

    const { error } = await supabase.from('appointments').update(payload).eq('id', id);
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Update failed' };
  }
}

/**
 * Deletes an appointment from Supabase
 */
export async function deleteAppointmentFromSupabase(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.from('appointments').delete().eq('id', id);
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Deletion failed' };
  }
}
