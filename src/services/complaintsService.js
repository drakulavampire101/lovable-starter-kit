// Mission 1 — Complaints (Lovable Cloud)
import { supabase } from '@/integrations/supabase/client';

export const COMPLAINT_CATEGORIES = ['TIFFIN_THEFT', 'BRIBE', 'LARGE_SYLLABUS', 'OTHER'];
export const COMPLAINT_STATUSES = ['PENDING', 'REVIEWED', 'RESOLVED'];

const uid = async () => (await supabase.auth.getUser()).data.user?.id;

export async function submitComplaint({ category, description, anonymous = true }) {
  const user_id = await uid();
  if (!user_id) throw new Error('Not authenticated');
  const { data, error } = await supabase
    .from('complaints')
    .insert({ user_id, category, description, anonymous })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function uploadComplaintImage(complaintId, file) {
  const user_id = await uid();
  if (!user_id) throw new Error('Not authenticated');
  const ext = file.name?.split('.').pop() || 'jpg';
  const path = `${user_id}/${complaintId}/${crypto.randomUUID()}.${ext}`;
  const { error: upErr } = await supabase.storage.from('evidence').upload(path, file);
  if (upErr) throw upErr;
  const { data, error } = await supabase
    .from('complaint_images')
    .insert({ complaint_id: complaintId, storage_path: path, uploaded_by: user_id })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function listComplaints() {
  const { data, error } = await supabase
    .from('complaints')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function listMyComplaints() {
  const user_id = await uid();
  const { data, error } = await supabase
    .from('complaints')
    .select('*')
    .eq('user_id', user_id)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function getComplaint(id) {
  const { data, error } = await supabase.from('complaints').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return data;
}

export async function getComplaintHistory(id) {
  const { data, error } = await supabase
    .from('complaint_history')
    .select('*')
    .eq('complaint_id', id)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function getComplaintDashboard() {
  const { data, error } = await supabase.from('complaints').select('status,category,warning_level');
  if (error) throw error;
  const total = data.length;
  const byStatus = data.reduce((a, r) => ((a[r.status] = (a[r.status] || 0) + 1), a), {});
  const byCategory = data.reduce((a, r) => ((a[r.category] = (a[r.category] || 0) + 1), a), {});
  return { total, byStatus, byCategory };
}

export async function updateComplaintStatus(id, status) {
  const { data, error } = await supabase
    .from('complaints')
    .update({ status })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  const actor = await uid();
  await supabase
    .from('complaint_history')
    .insert({ complaint_id: id, actor_id: actor, action: `STATUS:${status}` });
  return data;
}

export async function warnComplaint(id) {
  const c = await getComplaint(id);
  if (!c) throw new Error('Not found');
  const nextLevel = (c.warning_level || 0) + 1;
  const { data, error } = await supabase
    .from('complaints')
    .update({ warning_level: nextLevel })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;

  // increment strikes for target user
  const { data: strike } = await supabase
    .from('strikes')
    .select('*')
    .eq('user_id', c.user_id)
    .maybeSingle();
  if (strike) {
    await supabase.from('strikes').update({ count: strike.count + 1 }).eq('user_id', c.user_id);
  } else {
    await supabase.from('strikes').insert({ user_id: c.user_id, count: 1 });
  }
  const actor = await uid();
  await supabase
    .from('complaint_history')
    .insert({ complaint_id: id, actor_id: actor, action: 'WARN' });
  return { success: true, data };
}

export async function deleteComplaint(id) {
  const { error } = await supabase.from('complaints').delete().eq('id', id);
  if (error) throw error;
  return { id };
}
