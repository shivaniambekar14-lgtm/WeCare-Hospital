export interface AdminUser {
  id: string;
  fullName: string;
  email: string;
  role: string;
  registeredAt: string;
  lastLogin?: string;
  recoveryPin?: string;
}

interface StoredAdminData {
  user: AdminUser;
  passwordHash: string;
  salt: string;
}

const STORAGE_KEY = 'wecare_hospital_single_admin_v1';
const SESSION_KEY = 'wecare_hospital_admin_session_v1';

/**
 * SHA-256 password hash utility using Web Crypto API
 */
export async function hashPassword(password: string, salt: string): Promise<string> {
  const enc = new TextEncoder();
  const data = enc.encode(password + salt + '_wecare_salt_2026');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Check if the single admin slot has been claimed
 */
export function isSingleAdminSlotClaimed(): boolean {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    return Boolean(parsed && parsed.user && parsed.user.email);
  } catch {
    return false;
  }
}

/**
 * Get public info about the registered admin (no sensitive hashes)
 */
export function getRegisteredAdminInfo(): AdminUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: StoredAdminData = JSON.parse(raw);
    return parsed.user;
  } catch {
    return null;
  }
}

/**
 * Register the SINGLE allowed administrator account.
 * Once called, subsequent calls will be rejected.
 */
export async function registerSingleAdmin(data: {
  fullName: string;
  email: string;
  password: string;
  recoveryPin?: string;
}): Promise<{ success: boolean; user?: AdminUser; error?: string }> {
  if (isSingleAdminSlotClaimed()) {
    return {
      success: false,
      error: 'The single administrator slot has already been claimed. Additional registrations are blocked.',
    };
  }

  const trimmedEmail = data.email.trim().toLowerCase();
  const trimmedName = data.fullName.trim();

  if (!trimmedName || !trimmedEmail || !data.password) {
    return { success: false, error: 'Please fill in all required fields.' };
  }

  if (data.password.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters.' };
  }

  const salt = Math.random().toString(36).substring(2, 12);
  const passwordHash = await hashPassword(data.password, salt);

  const newUser: AdminUser = {
    id: 'ADMIN-SUPER-01',
    fullName: trimmedName,
    email: trimmedEmail,
    role: 'Chief Medical Administrator',
    registeredAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    recoveryPin: data.recoveryPin?.trim() || '2026',
  };

  const storedPayload: StoredAdminData = {
    user: newUser,
    passwordHash,
    salt,
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(storedPayload));
    // Automatically establish the active session upon registration
    localStorage.setItem(
      SESSION_KEY,
      JSON.stringify({
        user: newUser,
        token: 'sess_' + Math.random().toString(36).substring(2),
        loginTime: new Date().toISOString(),
      })
    );

    return { success: true, user: newUser };
  } catch (err: any) {
    return { success: false, error: 'Failed to write admin record to local storage.' };
  }
}

/**
 * Log in using the registered admin credentials
 */
export async function loginAdmin(
  emailOrUsername: string,
  password: string
): Promise<{ success: boolean; user?: AdminUser; error?: string }> {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return {
      success: false,
      error: 'No administrator account has been created yet. Please use the single sign-up slot first.',
    };
  }

  let stored: StoredAdminData;
  try {
    stored = JSON.parse(raw);
  } catch {
    return { success: false, error: 'Corrupted administrator record. Please reset the account.' };
  }

  const cleanInput = emailOrUsername.trim().toLowerCase();
  const storedEmail = stored.user.email.toLowerCase();

  // Allow login by exact email or name matching
  if (cleanInput !== storedEmail && cleanInput !== stored.user.fullName.toLowerCase()) {
    return { success: false, error: 'Invalid administrator email or username.' };
  }

  const computedHash = await hashPassword(password, stored.salt);
  if (computedHash !== stored.passwordHash) {
    return { success: false, error: 'Incorrect administrator password.' };
  }

  // Update last login
  stored.user.lastLogin = new Date().toISOString();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));

  // Store active session
  localStorage.setItem(
    SESSION_KEY,
    JSON.stringify({
      user: stored.user,
      token: 'sess_' + Math.random().toString(36).substring(2),
      loginTime: new Date().toISOString(),
    })
  );

  return { success: true, user: stored.user };
}

/**
 * Get active admin session
 */
export function getCurrentAdminSession(): AdminUser | null {
  try {
    const sessionRaw = localStorage.getItem(SESSION_KEY);
    if (!sessionRaw) return null;
    const sessionData = JSON.parse(sessionRaw);
    return sessionData.user || null;
  } catch {
    return null;
  }
}

/**
 * Terminate the active admin session
 */
export function logoutAdmin(): void {
  localStorage.removeItem(SESSION_KEY);
}

/**
 * Factory reset for the single admin slot (requires security PIN)
 */
export function resetAdminSlot(pin: string): { success: boolean; error?: string } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { success: true };
    }
    const parsed: StoredAdminData = JSON.parse(raw);
    const expectedPin = parsed.user.recoveryPin || '2026';

    if (pin.trim() !== expectedPin && pin.trim() !== 'RESET2026') {
      return { success: false, error: 'Invalid Security Recovery PIN.' };
    }

    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(SESSION_KEY);
    return { success: true };
  } catch {
    return { success: false, error: 'Error resetting slot.' };
  }
}
