// Mission 8 — Captain recommendation engine (Lovable Cloud)
import { supabase } from '@/integrations/supabase/client';

const uid = async () => (await supabase.auth.getUser()).data.user?.id;

export async function getCandidateRoster() {
  const { data, error } = await supabase.from('profiles').select('*');
  if (error) throw error;
  return data || [];
}

export async function getStudentCaptainStatus(id) {
  const { data } = await supabase.from('user_roles').select('role').eq('user_id', id);
  return { is_captain: (data || []).some((r) => r.role === 'CAPTAIN') };
}

export async function getCaptainRoster() {
  const { data } = await supabase.from('user_roles').select('user_id').eq('role', 'CAPTAIN');
  const ids = (data || []).map((r) => r.user_id);
  if (!ids.length) return [];
  const { data: profs } = await supabase.from('profiles').select('*').in('id', ids);
  return profs || [];
}

export async function listRounds() {
  const { data, error } = await supabase
    .from('recommendation_rounds')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function createRound(payload) {
  const created_by = await uid();
  const { data, error } = await supabase
    .from('recommendation_rounds')
    .insert({ ...payload, created_by })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getRound(id) {
  const { data, error } = await supabase.from('recommendation_rounds').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return data;
}

export async function updateWeights(id, weights) {
  const { data, error } = await supabase
    .from('recommendation_rounds')
    .update({ weights })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getRankedCandidates(roundId) {
  const { data, error } = await supabase
    .from('candidate_profiles')
    .select('*')
    .eq('round_id', roundId)
    .order('overall_score', { ascending: false });
  if (error) throw error;
  const ids = (data || []).map((c) => c.user_id);
  if (!ids.length) return [];
  const { data: profs } = await supabase.from('profiles').select('*').in('id', ids);
  const byId = Object.fromEntries((profs || []).map((p) => [p.id, p]));
  return (data || []).map((c, i) => ({ ...c, rank: i + 1, profile: byId[c.user_id] }));
}

export async function compareCandidates(roundId /* , ids */) {
  return getRankedCandidates(roundId);
}

export async function getRoundAnalytics(roundId) {
  const rows = await getRankedCandidates(roundId);
  const total = rows.length;
  const avg = total ? rows.reduce((a, r) => a + Number(r.overall_score || 0), 0) / total : 0;
  return { total, avg: Number(avg.toFixed(2)), top: rows.slice(0, 5) };
}

export async function getCandidateProfile(roundId, userId) {
  const { data, error } = await supabase
    .from('candidate_profiles')
    .select('*')
    .eq('round_id', roundId)
    .eq('user_id', userId)
    .maybeSingle();
  if (error) throw error;
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
  return { ...data, profile };
}

export async function upsertCandidateProfile(roundId, userId, payload) {
  const { data, error } = await supabase
    .from('candidate_profiles')
    .upsert(
      { round_id: roundId, user_id: userId, ...payload },
      { onConflict: 'round_id,user_id' },
    )
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function submitOverride(roundId, userId, payload) {
  const actor_id = await uid();
  const { data, error } = await supabase
    .from('candidate_profiles')
    .update({
      override_reason: payload.reason,
      overridden_by: actor_id,
      overall_score: payload.overall_score ?? undefined,
    })
    .eq('round_id', roundId)
    .eq('user_id', userId)
    .select()
    .single();
  if (error) throw error;
  await supabase
    .from('recommendation_history')
    .insert({ round_id: roundId, user_id: userId, actor_id, action: 'OVERRIDE', notes: payload.reason });
  return data;
}

export async function getCandidateHistory() {
  const { data, error } = await supabase
    .from('recommendation_history')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100);
  if (error) throw error;
  return data || [];
}
