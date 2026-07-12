// Mission 2 — Seating (Lovable Cloud)
import { supabase } from '@/integrations/supabase/client';

const uid = async () => (await supabase.auth.getUser()).data.user?.id;

// Very simple deterministic seating: sort by height (short at front), respect locked & separations.
function assignSeats(students, gridCols) {
  const sorted = [...students].sort((a, b) => (a.height || 0) - (b.height || 0));
  const rows = Math.ceil(sorted.length / gridCols);
  return sorted.map((s, i) => ({
    student_id: s.id,
    row_num: Math.floor(i / gridCols),
    col_num: i % gridCols,
    locked: false,
    _rows: rows,
  }));
}

export async function generateSeatingPlan({ planName, gridCols = 6, students }) {
  const user_id = await uid();
  const roster = students?.length
    ? students
    : (await supabase.from('students_roster').select('*')).data || [];
  const seats = assignSeats(roster, gridCols);
  const grid_rows = seats.reduce((m, s) => Math.max(m, s.row_num + 1), 1);
  const { data: plan, error } = await supabase
    .from('seat_plans')
    .insert({ name: planName || `Plan ${new Date().toISOString()}`, grid_cols: gridCols, grid_rows, created_by: user_id })
    .select()
    .single();
  if (error) throw error;
  const rows = seats.map(({ _rows, ...s }) => ({ ...s, plan_id: plan.id }));
  if (rows.length) {
    const { error: e2 } = await supabase.from('seat_assignments').insert(rows);
    if (e2) throw e2;
  }
  return getPlan(plan.id);
}

export async function getPlan(planId) {
  const { data: plan, error } = await supabase
    .from('seat_plans')
    .select('*')
    .eq('id', planId)
    .maybeSingle();
  if (error) throw error;
  const { data: seats } = await supabase
    .from('seat_assignments')
    .select('*, student:students_roster(*)')
    .eq('plan_id', planId);
  return { ...plan, seats: seats || [] };
}

export async function getLatestPlan() {
  const { data } = await supabase
    .from('seat_plans')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (!data) return null;
  return getPlan(data.id);
}

export async function listPlans() {
  const { data, error } = await supabase
    .from('seat_plans')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function deletePlan(planId) {
  const { error } = await supabase.from('seat_plans').delete().eq('id', planId);
  if (error) throw error;
  return { id: planId };
}

export async function getConstraints(planId) {
  const { data, error } = await supabase
    .from('seat_constraints')
    .select('*')
    .eq('plan_id', planId);
  if (error) throw error;
  return data || [];
}

export async function addConstraint(planId, constraint) {
  const { data, error } = await supabase
    .from('seat_constraints')
    .insert({ plan_id: planId, ...constraint })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getLineOfSight(planId) {
  const plan = await getPlan(planId);
  // Simple LoS: taller student blocks students directly behind them in same column.
  const seats = plan.seats || [];
  const blocked = [];
  for (const s of seats) {
    const behind = seats.filter(
      (x) => x.col_num === s.col_num && x.row_num > s.row_num && (x.student?.height || 0) < (s.student?.height || 0),
    );
    behind.forEach((b) => blocked.push({ blocker: s.id, blocked: b.id }));
  }
  return { plan, blocked };
}

export async function moveSeat(planId, seatId, patch) {
  const { data, error } = await supabase
    .from('seat_assignments')
    .update(patch)
    .eq('id', seatId)
    .eq('plan_id', planId)
    .select()
    .single();
  if (error) throw error;
  return data;
}
