// Mission 9 — Elections & Voting (Lovable Cloud + Realtime)
import { supabase } from '@/integrations/supabase/client';

const uid = async () => (await supabase.auth.getUser()).data.user?.id;

export async function getActiveElection() {
  const { data, error } = await supabase
    .from('elections')
    .select('*')
    .eq('status', 'ACTIVE')
    .order('starts_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function listElections() {
  const { data, error } = await supabase
    .from('elections')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function getElectionHistory() {
  const { data, error } = await supabase
    .from('elections')
    .select('*')
    .eq('status', 'CLOSED')
    .order('ends_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

async function attachProfiles(candidates) {
  const ids = candidates.map((c) => c.user_id);
  if (!ids.length) return candidates;
  const { data: profs } = await supabase.from('profiles').select('*').in('id', ids);
  const byId = Object.fromEntries((profs || []).map((p) => [p.id, p]));
  return candidates.map((c) => ({ ...c, profile: byId[c.user_id] }));
}

export async function getCandidates(electionId) {
  const { data, error } = await supabase
    .from('election_candidates')
    .select('*')
    .eq('election_id', electionId);
  if (error) throw error;
  const cands = await attachProfiles(data || []);
  const { data: tally } = await supabase.from('election_tally').select('*').eq('election_id', electionId);
  const byId = Object.fromEntries((tally || []).map((t) => [t.candidate_id, t.vote_count]));
  return cands.map((c) => ({ ...c, vote_count: byId[c.id] || 0 }));
}

export async function compareElectionCandidates(electionId) {
  return getCandidates(electionId);
}

export async function getCandidateProfile(electionId, candidateId) {
  const { data, error } = await supabase
    .from('election_candidates')
    .select('*')
    .eq('id', candidateId)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', data.user_id).maybeSingle();
  return { ...data, profile };
}

export async function getTimeline(electionId) {
  const { data, error } = await supabase
    .from('election_timeline')
    .select('*')
    .eq('election_id', electionId)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function getResults(electionId) {
  const { data, error } = await supabase.from('election_tally').select('*').eq('election_id', electionId);
  if (error) throw error;
  const rows = data || [];
  const total = rows.reduce((a, r) => a + Number(r.vote_count || 0), 0);
  const ids = rows.map((r) => r.user_id);
  const { data: profs } = ids.length ? await supabase.from('profiles').select('*').in('id', ids) : { data: [] };
  const byId = Object.fromEntries((profs || []).map((p) => [p.id, p]));
  return {
    total_votes: total,
    results: rows
      .map((r) => ({ ...r, profile: byId[r.user_id], pct: total ? (r.vote_count / total) * 100 : 0 }))
      .sort((a, b) => b.vote_count - a.vote_count),
  };
}

export async function castVote(electionId, payload) {
  const voter_id = await uid();
  const { data, error } = await supabase
    .from('votes')
    .insert({ election_id: electionId, voter_id, candidate_id: payload.candidate_id })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function hasVoted(electionId) {
  const voter_id = await uid();
  if (!voter_id) return { voted: false };
  const { data } = await supabase
    .from('votes')
    .select('id')
    .eq('election_id', electionId)
    .eq('voter_id', voter_id)
    .maybeSingle();
  return { voted: !!data };
}

export async function createElection(payload) {
  const created_by = await uid();
  const { data, error } = await supabase
    .from('elections')
    .insert({ ...payload, created_by })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function addCandidate(electionId, payload) {
  const { data, error } = await supabase
    .from('election_candidates')
    .insert({ election_id: electionId, ...payload })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getAdminView(electionId) {
  const [election, candidates, results, timeline] = await Promise.all([
    supabase.from('elections').select('*').eq('id', electionId).maybeSingle().then((r) => r.data),
    getCandidates(electionId),
    getResults(electionId),
    getTimeline(electionId),
  ]);
  return { election, candidates, results, timeline };
}

export async function updateElectionStatus(electionId, status) {
  const actor = await uid();
  const patch = { status };
  if (status === 'ACTIVE') patch.starts_at = new Date().toISOString();
  if (status === 'CLOSED') patch.ends_at = new Date().toISOString();
  const { data, error } = await supabase
    .from('elections')
    .update(patch)
    .eq('id', electionId)
    .select()
    .single();
  if (error) throw error;
  await supabase
    .from('election_timeline')
    .insert({ election_id: electionId, actor_id: actor, event: `STATUS:${status}` });
  return data;
}

export async function getActivityLog(electionId) {
  return getTimeline(electionId);
}
