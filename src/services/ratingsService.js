// Mission 7 — Peer ratings (Lovable Cloud)
import { supabase } from '@/integrations/supabase/client';

const uid = async () => (await supabase.auth.getUser()).data.user?.id;

function overallFromCats(categories) {
  const vals = Object.values(categories || {}).filter((v) => typeof v === 'number');
  if (!vals.length) return 0;
  return Number((vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2));
}

export async function getRatingRoster() {
  const me = await uid();
  const { data, error } = await supabase.from('profiles').select('id,name,roll_number,class_name,section,avatar_color');
  if (error) throw error;
  return (data || []).filter((p) => p.id !== me);
}

export async function getMyRated() {
  const me = await uid();
  const { data, error } = await supabase
    .from('ratings')
    .select('*, target:profiles!ratings_target_id_fkey(*)')
    .eq('rater_id', me)
    .order('created_at', { ascending: false });
  if (error) {
    // fallback if fk name differs
    const { data: d2 } = await supabase.from('ratings').select('*').eq('rater_id', me);
    return d2 || [];
  }
  return data || [];
}

export async function submitRating(targetId, payload) {
  const rater_id = await uid();
  const categories = payload.categories || {};
  const overall = payload.overall ?? overallFromCats(categories);
  const row = {
    rater_id,
    target_id: targetId,
    categories,
    overall,
    comment: payload.comment || null,
    anonymous: payload.anonymous ?? true,
    status: 'APPROVED',
  };
  const { data, error } = await supabase
    .from('ratings')
    .upsert(row, { onConflict: 'rater_id,target_id' })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getRatingLeaderboard() {
  const { data, error } = await supabase.from('rating_leaderboard').select('*').order('avg_score', { ascending: false }).limit(50);
  if (error) throw error;
  const ids = (data || []).map((r) => r.user_id);
  if (!ids.length) return [];
  const { data: profs } = await supabase.from('profiles').select('*').in('id', ids);
  const byId = Object.fromEntries((profs || []).map((p) => [p.id, p]));
  return (data || []).map((r) => ({ ...r, profile: byId[r.user_id] }));
}

export async function getStudentProfile(id) {
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', id).maybeSingle();
  const { data: agg } = await supabase.from('rating_leaderboard').select('*').eq('user_id', id).maybeSingle();
  return { profile, ...agg };
}

export async function getPublicComments(id) {
  const { data, error } = await supabase
    .from('ratings')
    .select('id,overall,comment,anonymous,created_at,rater_id')
    .eq('target_id', id)
    .eq('status', 'APPROVED')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []).map((r) => ({ ...r, rater_id: r.anonymous ? null : r.rater_id }));
}

export async function getModerationQueue() {
  const { data, error } = await supabase
    .from('ratings')
    .select('*')
    .eq('status', 'PENDING')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function moderateRating(id, decision) {
  const { data, error } = await supabase
    .from('ratings')
    .update({ status: decision.status || decision.decision || 'APPROVED' })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getRatingAnalytics() {
  const { data, error } = await supabase.from('ratings').select('status,overall');
  if (error) throw error;
  const total = data.length;
  const approved = data.filter((r) => r.status === 'APPROVED').length;
  const pending = data.filter((r) => r.status === 'PENDING').length;
  const avg = total ? data.reduce((a, r) => a + Number(r.overall || 0), 0) / total : 0;
  return { total, approved, pending, avg: Number(avg.toFixed(2)) };
}
