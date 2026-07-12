// Dashboard aggregate (Lovable Cloud)
import { supabase } from '@/integrations/supabase/client';

export async function getDashboardStats() {
  const [complaints, sos, ratings, elections] = await Promise.all([
    supabase.from('complaints').select('id', { count: 'exact', head: true }),
    supabase.from('sos_alerts').select('id', { count: 'exact', head: true }),
    supabase.from('ratings').select('id', { count: 'exact', head: true }),
    supabase.from('elections').select('id', { count: 'exact', head: true }).eq('status', 'ACTIVE'),
  ]);
  return {
    complaints: complaints.count || 0,
    sos: sos.count || 0,
    ratings: ratings.count || 0,
    active_elections: elections.count || 0,
  };
}

export async function getDashboardActivity(limit = 20) {
  const { data: complaints } = await supabase
    .from('complaints')
    .select('id,category,status,created_at')
    .order('created_at', { ascending: false })
    .limit(limit);
  const { data: sos } = await supabase
    .from('sos_alerts')
    .select('id,location,severity,status,created_at')
    .order('created_at', { ascending: false })
    .limit(limit);
  const feed = [
    ...(complaints || []).map((c) => ({ kind: 'complaint', ...c })),
    ...(sos || []).map((s) => ({ kind: 'sos', ...s })),
  ]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, limit);
  return feed;
}

export async function getDashboardCharts() {
  const { data: complaints } = await supabase.from('complaints').select('category,created_at');
  const { data: sos } = await supabase.from('sos_alerts').select('severity,created_at');
  return {
    complaintsByCategory: (complaints || []).reduce(
      (a, r) => ((a[r.category] = (a[r.category] || 0) + 1), a),
      {},
    ),
    sosBySeverity: (sos || []).reduce((a, r) => ((a[r.severity] = (a[r.severity] || 0) + 1), a), {}),
  };
}
