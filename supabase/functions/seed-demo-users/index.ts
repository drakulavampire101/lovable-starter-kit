import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const DEMO_USERS = [
  { rollNumber: '2201001', name: 'Demo Student', role: 'STUDENT', className: '9', section: 'C' },
  { rollNumber: '2201002', name: 'Demo Captain', role: 'CAPTAIN', className: '9', section: 'C' },
  { rollNumber: 't001',    name: 'Demo Teacher', role: 'TEACHER' },
  { rollNumber: 'o001',    name: 'Demo Office',  role: 'OFFICE' },
];

const PASSWORD = 'Password123!';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const admin = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    { auth: { persistSession: false } },
  );

  const results: any[] = [];
  for (const u of DEMO_USERS) {
    const slug = u.rollNumber.toLowerCase().replace(/[^a-z0-9]/g, '');
    const email = `${slug}@baiust.local`;

    const { data: created, error } = await admin.auth.admin.createUser({
      email,
      password: PASSWORD,
      email_confirm: true,
      user_metadata: {
        roll_number: u.rollNumber,
        name: u.name,
        role: u.role,
        class_name: u.className || null,
        section: u.section || null,
      },
    });

    if (error && !String(error.message).toLowerCase().includes('already')) {
      results.push({ rollNumber: u.rollNumber, ok: false, error: error.message });
      continue;
    }

    // If user existed, look up id + ensure role
    let userId = created?.user?.id;
    if (!userId) {
      const { data: list } = await admin.auth.admin.listUsers();
      userId = list?.users?.find((x) => x.email === email)?.id;
    }
    if (userId) {
      await admin.from('user_roles').upsert({ user_id: userId, role: u.role }, { onConflict: 'user_id,role' });
    }
    results.push({ rollNumber: u.rollNumber, email, ok: true, role: u.role });
  }

  return new Response(
    JSON.stringify({ success: true, message: 'Demo users seeded', data: { password: PASSWORD, users: results } }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
  );
});
