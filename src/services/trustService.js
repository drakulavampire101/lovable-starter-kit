// Mission 10 — Trust graph (Lovable Cloud)
import { supabase } from '@/integrations/supabase/client';

const uid = async () => (await supabase.auth.getUser()).data.user?.id;

export async function listTrustFlags() {
  const { data, error } = await supabase
    .from('trust_flags')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function getUserTrustFlags(userId) {
  const { data, error } = await supabase
    .from('trust_flags')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function createTrustFlag(payload) {
  const flagged_by = await uid();
  const { data, error } = await supabase
    .from('trust_flags')
    .insert({ ...payload, flagged_by })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateTrustFlag(id, patch) {
  const { data, error } = await supabase
    .from('trust_flags')
    .update(patch)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteTrustFlag(id) {
  const { error } = await supabase.from('trust_flags').delete().eq('id', id);
  if (error) throw error;
  return { id };
}

export async function getTrustScores() {
  const { data, error } = await supabase
    .from('trust_scores')
    .select('*')
    .order('score', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function getUserTrustScore(userId) {
  const { data, error } = await supabase
    .from('trust_scores')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();
  if (error) throw error;
  return data || { user_id: userId, score: 0, flag_count: 0 };
}

export async function getTrustDashboard() {
  const [flags, scores] = await Promise.all([listTrustFlags(), getTrustScores()]);
  return {
    total_flags: flags.length,
    active_flags: flags.filter((f) => f.active).length,
    top_scored: scores.slice(0, 10),
  };
}
