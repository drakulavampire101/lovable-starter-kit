// Auth service — Lovable Cloud (Supabase)
// Frontend uses roll numbers; we convert to a synthetic email so Supabase Auth is happy.
import { supabase } from '@/integrations/supabase/client';

const EMAIL_DOMAIN = 'baiust.local';

export function rollToEmail(rollNumber) {
  const slug = String(rollNumber || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  return `${slug}@${EMAIL_DOMAIN}`;
}

export async function register({ rollNumber, name, password, role, className, section, height, dob, vision, hearing }) {
  const email = rollToEmail(rollNumber);
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/`,
      data: {
        roll_number: rollNumber,
        name: name || rollNumber,
        role: role ? String(role).toUpperCase() : 'STUDENT',
        class_name: className || null,
        section: section || null,
        height: height ?? null,
        dob: dob || null,
        vision: vision || null,
        hearing: hearing || null,
      },
    },
  });
  if (error) throw error;
  return { user: data.user, session: data.session };
}

export async function login({ rollNumber, password }) {
  const email = rollToEmail(rollNumber);
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return { user: data.user, session: data.session };
}

export async function logout() {
  await supabase.auth.signOut();
}

export async function me() {
  const { data: sessionData } = await supabase.auth.getSession();
  if (!sessionData?.session) return null;
  return sessionData.session.user;
}

export async function getProfile(id) {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return data;
}

export async function updateProfile(id, patch) {
  const clean = { ...patch };
  delete clean.id;
  const { data, error } = await supabase.from('profiles').update(clean).eq('id', id).select().maybeSingle();
  if (error) throw error;
  return data;
}

export async function getRoles(userId) {
  const { data, error } = await supabase.from('user_roles').select('role').eq('user_id', userId);
  if (error) return [];
  return (data || []).map((r) => r.role);
}
