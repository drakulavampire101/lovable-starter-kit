// Mission 4 — Tiffin ledger tracker (Lovable Cloud)
import { supabase } from '@/integrations/supabase/client';

const uid = async () => (await supabase.auth.getUser()).data.user?.id;

export const TRACKER_TYPES = ['PURCHASE', 'REFUND', 'ADJUSTMENT'];

export async function addTrackerEntry({ type = 'PURCHASE', amount, description, menu_id, quantity = 1 }) {
  const user_id = await uid();
  const { data, error } = await supabase
    .from('tiffin_transactions')
    .insert({ user_id, type, amount, quantity, notes: description || null, menu_id: menu_id || null })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function listTrackerEntries() {
  const user_id = await uid();
  const { data, error } = await supabase
    .from('tiffin_transactions')
    .select('*, menu:tiffin_menu(*)')
    .eq('user_id', user_id)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function getTrackerEntry(id) {
  const { data, error } = await supabase
    .from('tiffin_transactions')
    .select('*, menu:tiffin_menu(*)')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function getTrackerSummary() {
  const user_id = await uid();
  const { data, error } = await supabase
    .from('tiffin_transactions')
    .select('type,amount')
    .eq('user_id', user_id);
  if (error) throw error;
  const total = (data || []).reduce((a, r) => a + Number(r.amount || 0), 0);
  const byType = (data || []).reduce(
    (a, r) => ((a[r.type] = (a[r.type] || 0) + Number(r.amount || 0)), a),
    {},
  );
  return { total, byType, count: (data || []).length };
}

export async function updateTrackerStatus(id, status) {
  // No status column on transactions; store into notes for compatibility.
  const { data, error } = await supabase
    .from('tiffin_transactions')
    .update({ notes: status })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteTrackerEntry(id) {
  const { error } = await supabase.from('tiffin_transactions').delete().eq('id', id);
  if (error) throw error;
  return { id };
}

export async function getBudgets() {
  const user_id = await uid();
  const { data, error } = await supabase.from('tiffin_budgets').select('*').eq('user_id', user_id);
  if (error) throw error;
  return data || [];
}

export async function getMenu() {
  const { data, error } = await supabase
    .from('tiffin_menu')
    .select('*')
    .eq('available', true)
    .order('name', { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function upsertMenu(payload) {
  const { data, error } = await supabase.from('tiffin_menu').upsert(payload).select().single();
  if (error) throw error;
  return data;
}
