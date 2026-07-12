// Mission 5 — SOS (Lovable Cloud + Realtime)
import { supabase } from '@/integrations/supabase/client';

export const SOS_LOCATIONS = ['LIBRARY', 'PLAYGROUND', 'CORRIDOR', 'CLASSROOM', 'CANTEEN'];

const uid = async () => (await supabase.auth.getUser()).data.user?.id;

export async function triggerSos({ location, message, severity = 'MEDIUM' }) {
  const user_id = await uid();
  if (!user_id) throw new Error('Not authenticated');
  const { data, error } = await supabase
    .from('sos_alerts')
    .insert({ user_id, location, message, severity })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function listActiveSos() {
  const { data, error } = await supabase
    .from('sos_alerts')
    .select('*')
    .in('status', ['ACTIVE', 'CLAIMED'])
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function listAllSos() {
  const { data, error } = await supabase
    .from('sos_alerts')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function claimSos(id) {
  const responder_id = await uid();
  const { data, error } = await supabase
    .from('sos_alerts')
    .update({ status: 'CLAIMED', claimed_by: responder_id, claimed_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  await supabase.from('sos_claims').insert({ alert_id: id, responder_id, action: 'CLAIM' });
  return data;
}

export async function resolveSos(id) {
  const responder_id = await uid();
  const { data, error } = await supabase
    .from('sos_alerts')
    .update({ status: 'RESOLVED', resolved_by: responder_id, resolved_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  await supabase.from('sos_claims').insert({ alert_id: id, responder_id, action: 'RESOLVE' });
  return data;
}

export async function getSosLocations() {
  return SOS_LOCATIONS;
}

export async function getSosAnalytics() {
  const { data, error } = await supabase.from('sos_alerts').select('status,location,severity,created_at');
  if (error) throw error;
  const total = data.length;
  const byLocation = data.reduce((a, r) => ((a[r.location] = (a[r.location] || 0) + 1), a), {});
  const byStatus = data.reduce((a, r) => ((a[r.status] = (a[r.status] || 0) + 1), a), {});
  const bySeverity = data.reduce((a, r) => ((a[r.severity] = (a[r.severity] || 0) + 1), a), {});
  return { total, byLocation, byStatus, bySeverity };
}
