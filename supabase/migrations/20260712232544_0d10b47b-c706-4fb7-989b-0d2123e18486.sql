
-- =========================================================================
-- ENUMS
-- =========================================================================
CREATE TYPE public.complaint_category AS ENUM ('TIFFIN_THEFT','BRIBE','LARGE_SYLLABUS','OTHER');
CREATE TYPE public.complaint_status   AS ENUM ('PENDING','REVIEWED','RESOLVED');
CREATE TYPE public.sos_severity       AS ENUM ('LOW','MEDIUM','HIGH','CRITICAL');
CREATE TYPE public.sos_status         AS ENUM ('ACTIVE','CLAIMED','RESOLVED');
CREATE TYPE public.rating_status      AS ENUM ('PENDING','APPROVED','REJECTED');
CREATE TYPE public.election_status    AS ENUM ('DRAFT','ACTIVE','CLOSED');
CREATE TYPE public.tiffin_type        AS ENUM ('PURCHASE','REFUND','ADJUSTMENT');

-- =========================================================================
-- MISSION 1 — COMPLAINTS
-- =========================================================================
CREATE TABLE public.complaints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category public.complaint_category NOT NULL,
  description TEXT NOT NULL,
  anonymous BOOLEAN NOT NULL DEFAULT true,
  status public.complaint_status NOT NULL DEFAULT 'PENDING',
  warning_level INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.complaints TO authenticated;
GRANT ALL ON public.complaints TO service_role;
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own complaints - select" ON public.complaints FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(),'TEACHER') OR public.has_role(auth.uid(),'OFFICE') OR public.has_role(auth.uid(),'CAPTAIN'));
CREATE POLICY "Own complaints - insert" ON public.complaints FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Staff update complaints" ON public.complaints FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'TEACHER') OR public.has_role(auth.uid(),'OFFICE'));
CREATE POLICY "Owner or office delete" ON public.complaints FOR DELETE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(),'OFFICE'));
CREATE TRIGGER complaints_updated BEFORE UPDATE ON public.complaints FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.complaint_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  complaint_id UUID NOT NULL REFERENCES public.complaints(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  uploaded_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, DELETE ON public.complaint_images TO authenticated;
GRANT ALL ON public.complaint_images TO service_role;
ALTER TABLE public.complaint_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "View complaint images" ON public.complaint_images FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.complaints c WHERE c.id = complaint_id AND (c.user_id = auth.uid() OR public.has_role(auth.uid(),'TEACHER') OR public.has_role(auth.uid(),'OFFICE') OR public.has_role(auth.uid(),'CAPTAIN'))));
CREATE POLICY "Add complaint image" ON public.complaint_images FOR INSERT TO authenticated WITH CHECK (uploaded_by = auth.uid() AND EXISTS (SELECT 1 FROM public.complaints c WHERE c.id = complaint_id AND c.user_id = auth.uid()));
CREATE POLICY "Delete complaint image" ON public.complaint_images FOR DELETE TO authenticated USING (uploaded_by = auth.uid() OR public.has_role(auth.uid(),'OFFICE'));

CREATE TABLE public.complaint_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  complaint_id UUID NOT NULL REFERENCES public.complaints(id) ON DELETE CASCADE,
  actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.complaint_history TO authenticated;
GRANT ALL ON public.complaint_history TO service_role;
ALTER TABLE public.complaint_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "View complaint history" ON public.complaint_history FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.complaints c WHERE c.id = complaint_id AND (c.user_id = auth.uid() OR public.has_role(auth.uid(),'TEACHER') OR public.has_role(auth.uid(),'OFFICE') OR public.has_role(auth.uid(),'CAPTAIN'))));
CREATE POLICY "Staff add history" ON public.complaint_history FOR INSERT TO authenticated WITH CHECK (actor_id = auth.uid() AND (public.has_role(auth.uid(),'TEACHER') OR public.has_role(auth.uid(),'OFFICE')));

CREATE TABLE public.strikes (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  count INT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.strikes TO authenticated;
GRANT ALL ON public.strikes TO service_role;
ALTER TABLE public.strikes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "View strikes" ON public.strikes FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(),'TEACHER') OR public.has_role(auth.uid(),'OFFICE'));
CREATE POLICY "Staff manage strikes" ON public.strikes FOR ALL TO authenticated USING (public.has_role(auth.uid(),'TEACHER') OR public.has_role(auth.uid(),'OFFICE')) WITH CHECK (public.has_role(auth.uid(),'TEACHER') OR public.has_role(auth.uid(),'OFFICE'));

-- =========================================================================
-- MISSION 2 — SEATING
-- =========================================================================
CREATE TABLE public.students_roster (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  roll_number TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  height NUMERIC,
  vision TEXT,
  hearing TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.students_roster TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.students_roster TO authenticated;
GRANT ALL ON public.students_roster TO service_role;
ALTER TABLE public.students_roster ENABLE ROW LEVEL SECURITY;
CREATE POLICY "View roster" ON public.students_roster FOR SELECT TO authenticated USING (true);
CREATE POLICY "Staff manage roster" ON public.students_roster FOR ALL TO authenticated USING (public.has_role(auth.uid(),'TEACHER') OR public.has_role(auth.uid(),'OFFICE')) WITH CHECK (public.has_role(auth.uid(),'TEACHER') OR public.has_role(auth.uid(),'OFFICE'));
CREATE TRIGGER roster_updated BEFORE UPDATE ON public.students_roster FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.seat_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  grid_cols INT NOT NULL DEFAULT 6,
  grid_rows INT NOT NULL DEFAULT 6,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.seat_plans TO authenticated;
GRANT ALL ON public.seat_plans TO service_role;
ALTER TABLE public.seat_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "View seat plans" ON public.seat_plans FOR SELECT TO authenticated USING (true);
CREATE POLICY "Staff manage plans" ON public.seat_plans FOR ALL TO authenticated USING (public.has_role(auth.uid(),'TEACHER') OR public.has_role(auth.uid(),'OFFICE')) WITH CHECK (public.has_role(auth.uid(),'TEACHER') OR public.has_role(auth.uid(),'OFFICE'));
CREATE TRIGGER seat_plans_updated BEFORE UPDATE ON public.seat_plans FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.seat_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID NOT NULL REFERENCES public.seat_plans(id) ON DELETE CASCADE,
  student_id UUID REFERENCES public.students_roster(id) ON DELETE SET NULL,
  row_num INT NOT NULL,
  col_num INT NOT NULL,
  locked BOOLEAN NOT NULL DEFAULT false,
  UNIQUE(plan_id, row_num, col_num)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.seat_assignments TO authenticated;
GRANT ALL ON public.seat_assignments TO service_role;
ALTER TABLE public.seat_assignments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "View seats" ON public.seat_assignments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Staff manage seats" ON public.seat_assignments FOR ALL TO authenticated USING (public.has_role(auth.uid(),'TEACHER') OR public.has_role(auth.uid(),'OFFICE')) WITH CHECK (public.has_role(auth.uid(),'TEACHER') OR public.has_role(auth.uid(),'OFFICE'));

CREATE TABLE public.seat_constraints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID NOT NULL REFERENCES public.seat_plans(id) ON DELETE CASCADE,
  kind TEXT NOT NULL,
  student_a UUID REFERENCES public.students_roster(id) ON DELETE CASCADE,
  student_b UUID REFERENCES public.students_roster(id) ON DELETE CASCADE,
  meta JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.seat_constraints TO authenticated;
GRANT ALL ON public.seat_constraints TO service_role;
ALTER TABLE public.seat_constraints ENABLE ROW LEVEL SECURITY;
CREATE POLICY "View constraints" ON public.seat_constraints FOR SELECT TO authenticated USING (true);
CREATE POLICY "Staff manage constraints" ON public.seat_constraints FOR ALL TO authenticated USING (public.has_role(auth.uid(),'TEACHER') OR public.has_role(auth.uid(),'OFFICE')) WITH CHECK (public.has_role(auth.uid(),'TEACHER') OR public.has_role(auth.uid(),'OFFICE'));

-- =========================================================================
-- MISSION 4 — TIFFIN LEDGER
-- =========================================================================
CREATE TABLE public.tiffin_menu (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT,
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  available BOOLEAN NOT NULL DEFAULT true,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.tiffin_menu TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.tiffin_menu TO authenticated;
GRANT ALL ON public.tiffin_menu TO service_role;
ALTER TABLE public.tiffin_menu ENABLE ROW LEVEL SECURITY;
CREATE POLICY "View menu" ON public.tiffin_menu FOR SELECT TO authenticated USING (true);
CREATE POLICY "Office manage menu" ON public.tiffin_menu FOR ALL TO authenticated USING (public.has_role(auth.uid(),'OFFICE')) WITH CHECK (public.has_role(auth.uid(),'OFFICE'));
CREATE TRIGGER menu_updated BEFORE UPDATE ON public.tiffin_menu FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.tiffin_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  menu_id UUID REFERENCES public.tiffin_menu(id) ON DELETE SET NULL,
  type public.tiffin_type NOT NULL DEFAULT 'PURCHASE',
  amount NUMERIC(10,2) NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tiffin_transactions TO authenticated;
GRANT ALL ON public.tiffin_transactions TO service_role;
ALTER TABLE public.tiffin_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "View own txns" ON public.tiffin_transactions FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(),'OFFICE'));
CREATE POLICY "Own txn insert" ON public.tiffin_transactions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Office update txn" ON public.tiffin_transactions FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'OFFICE'));
CREATE POLICY "Owner or office delete txn" ON public.tiffin_transactions FOR DELETE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(),'OFFICE'));

CREATE TABLE public.tiffin_budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  period TEXT NOT NULL DEFAULT 'MONTHLY',
  amount NUMERIC(10,2) NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, period)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tiffin_budgets TO authenticated;
GRANT ALL ON public.tiffin_budgets TO service_role;
ALTER TABLE public.tiffin_budgets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own budget" ON public.tiffin_budgets FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER budgets_updated BEFORE UPDATE ON public.tiffin_budgets FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =========================================================================
-- MISSION 5 — SOS ALERTS
-- =========================================================================
CREATE TABLE public.sos_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  location TEXT NOT NULL,
  severity public.sos_severity NOT NULL DEFAULT 'MEDIUM',
  status public.sos_status NOT NULL DEFAULT 'ACTIVE',
  message TEXT,
  claimed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  resolved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  claimed_at TIMESTAMPTZ,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.sos_alerts TO authenticated;
GRANT ALL ON public.sos_alerts TO service_role;
ALTER TABLE public.sos_alerts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "View sos" ON public.sos_alerts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Anyone trigger sos" ON public.sos_alerts FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Responders update sos" ON public.sos_alerts FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'CAPTAIN') OR public.has_role(auth.uid(),'TEACHER') OR public.has_role(auth.uid(),'OFFICE'));
CREATE POLICY "Office delete sos" ON public.sos_alerts FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'OFFICE'));
CREATE TRIGGER sos_updated BEFORE UPDATE ON public.sos_alerts FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
ALTER PUBLICATION supabase_realtime ADD TABLE public.sos_alerts;
ALTER TABLE public.sos_alerts REPLICA IDENTITY FULL;

CREATE TABLE public.sos_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_id UUID NOT NULL REFERENCES public.sos_alerts(id) ON DELETE CASCADE,
  responder_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.sos_claims TO authenticated;
GRANT ALL ON public.sos_claims TO service_role;
ALTER TABLE public.sos_claims ENABLE ROW LEVEL SECURITY;
CREATE POLICY "View claims" ON public.sos_claims FOR SELECT TO authenticated USING (true);
CREATE POLICY "Responders log claims" ON public.sos_claims FOR INSERT TO authenticated WITH CHECK (responder_id = auth.uid() AND (public.has_role(auth.uid(),'CAPTAIN') OR public.has_role(auth.uid(),'TEACHER') OR public.has_role(auth.uid(),'OFFICE')));

-- =========================================================================
-- MISSION 7 — PEER RATINGS
-- =========================================================================
CREATE TABLE public.ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rater_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  target_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  categories JSONB NOT NULL DEFAULT '{}'::jsonb,
  overall NUMERIC(3,2) NOT NULL DEFAULT 0,
  comment TEXT,
  anonymous BOOLEAN NOT NULL DEFAULT true,
  status public.rating_status NOT NULL DEFAULT 'APPROVED',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(rater_id, target_id),
  CHECK (rater_id <> target_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ratings TO authenticated;
GRANT ALL ON public.ratings TO service_role;
ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "View approved or own ratings" ON public.ratings FOR SELECT TO authenticated USING (status = 'APPROVED' OR rater_id = auth.uid() OR target_id = auth.uid() OR public.has_role(auth.uid(),'TEACHER') OR public.has_role(auth.uid(),'OFFICE'));
CREATE POLICY "Insert own rating" ON public.ratings FOR INSERT TO authenticated WITH CHECK (rater_id = auth.uid());
CREATE POLICY "Update own or moderate" ON public.ratings FOR UPDATE TO authenticated USING (rater_id = auth.uid() OR public.has_role(auth.uid(),'TEACHER') OR public.has_role(auth.uid(),'OFFICE'));
CREATE POLICY "Delete own or office" ON public.ratings FOR DELETE TO authenticated USING (rater_id = auth.uid() OR public.has_role(auth.uid(),'OFFICE'));
CREATE TRIGGER ratings_updated BEFORE UPDATE ON public.ratings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE VIEW public.rating_leaderboard AS
SELECT target_id AS user_id, AVG(overall)::NUMERIC(3,2) AS avg_score, COUNT(*)::INT AS ratings_count
FROM public.ratings WHERE status = 'APPROVED'
GROUP BY target_id;
GRANT SELECT ON public.rating_leaderboard TO authenticated, anon;

-- =========================================================================
-- MISSION 8 — CAPTAIN RECOMMENDATION ENGINE
-- =========================================================================
CREATE TABLE public.recommendation_rounds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  weights JSONB NOT NULL DEFAULT '{"ratings":0.4,"complaints":0.2,"sos":0.2,"trust":0.2}'::jsonb,
  status TEXT NOT NULL DEFAULT 'OPEN',
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.recommendation_rounds TO authenticated;
GRANT ALL ON public.recommendation_rounds TO service_role;
ALTER TABLE public.recommendation_rounds ENABLE ROW LEVEL SECURITY;
CREATE POLICY "View rounds" ON public.recommendation_rounds FOR SELECT TO authenticated USING (true);
CREATE POLICY "Staff manage rounds" ON public.recommendation_rounds FOR ALL TO authenticated USING (public.has_role(auth.uid(),'TEACHER') OR public.has_role(auth.uid(),'OFFICE')) WITH CHECK (public.has_role(auth.uid(),'TEACHER') OR public.has_role(auth.uid(),'OFFICE'));
CREATE TRIGGER rounds_updated BEFORE UPDATE ON public.recommendation_rounds FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.candidate_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  round_id UUID NOT NULL REFERENCES public.recommendation_rounds(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  scores JSONB NOT NULL DEFAULT '{}'::jsonb,
  overall_score NUMERIC(5,2) NOT NULL DEFAULT 0,
  rank INT,
  override_reason TEXT,
  overridden_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(round_id, user_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.candidate_profiles TO authenticated;
GRANT ALL ON public.candidate_profiles TO service_role;
ALTER TABLE public.candidate_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "View candidates" ON public.candidate_profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Staff manage candidates" ON public.candidate_profiles FOR ALL TO authenticated USING (public.has_role(auth.uid(),'TEACHER') OR public.has_role(auth.uid(),'OFFICE')) WITH CHECK (public.has_role(auth.uid(),'TEACHER') OR public.has_role(auth.uid(),'OFFICE'));
CREATE TRIGGER candidates_updated BEFORE UPDATE ON public.candidate_profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.recommendation_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  round_id UUID NOT NULL REFERENCES public.recommendation_rounds(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.recommendation_history TO authenticated;
GRANT ALL ON public.recommendation_history TO service_role;
ALTER TABLE public.recommendation_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "View rec history" ON public.recommendation_history FOR SELECT TO authenticated USING (true);
CREATE POLICY "Staff add rec history" ON public.recommendation_history FOR INSERT TO authenticated WITH CHECK (actor_id = auth.uid() AND (public.has_role(auth.uid(),'TEACHER') OR public.has_role(auth.uid(),'OFFICE')));

-- =========================================================================
-- MISSION 9 — ELECTIONS
-- =========================================================================
CREATE TABLE public.elections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  status public.election_status NOT NULL DEFAULT 'DRAFT',
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.elections TO authenticated;
GRANT SELECT ON public.elections TO anon;
GRANT ALL ON public.elections TO service_role;
ALTER TABLE public.elections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "View elections" ON public.elections FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY "Staff manage elections" ON public.elections FOR ALL TO authenticated USING (public.has_role(auth.uid(),'TEACHER') OR public.has_role(auth.uid(),'OFFICE')) WITH CHECK (public.has_role(auth.uid(),'TEACHER') OR public.has_role(auth.uid(),'OFFICE'));
CREATE TRIGGER elections_updated BEFORE UPDATE ON public.elections FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.election_candidates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  election_id UUID NOT NULL REFERENCES public.elections(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  manifesto TEXT,
  slogan TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(election_id, user_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.election_candidates TO authenticated;
GRANT SELECT ON public.election_candidates TO anon;
GRANT ALL ON public.election_candidates TO service_role;
ALTER TABLE public.election_candidates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "View candidates public" ON public.election_candidates FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY "Staff manage candidates" ON public.election_candidates FOR ALL TO authenticated USING (public.has_role(auth.uid(),'TEACHER') OR public.has_role(auth.uid(),'OFFICE')) WITH CHECK (public.has_role(auth.uid(),'TEACHER') OR public.has_role(auth.uid(),'OFFICE'));

CREATE TABLE public.votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  election_id UUID NOT NULL REFERENCES public.elections(id) ON DELETE CASCADE,
  voter_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  candidate_id UUID NOT NULL REFERENCES public.election_candidates(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(election_id, voter_id)
);
GRANT SELECT, INSERT ON public.votes TO authenticated;
GRANT ALL ON public.votes TO service_role;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "View own or staff votes" ON public.votes FOR SELECT TO authenticated USING (voter_id = auth.uid() OR public.has_role(auth.uid(),'TEACHER') OR public.has_role(auth.uid(),'OFFICE'));
CREATE POLICY "Cast own vote" ON public.votes FOR INSERT TO authenticated WITH CHECK (voter_id = auth.uid() AND EXISTS (SELECT 1 FROM public.elections e WHERE e.id = election_id AND e.status = 'ACTIVE'));
ALTER PUBLICATION supabase_realtime ADD TABLE public.votes;
ALTER TABLE public.votes REPLICA IDENTITY FULL;

CREATE OR REPLACE VIEW public.election_tally AS
SELECT ec.election_id, ec.id AS candidate_id, ec.user_id, COUNT(v.id)::INT AS vote_count
FROM public.election_candidates ec
LEFT JOIN public.votes v ON v.candidate_id = ec.id
GROUP BY ec.election_id, ec.id, ec.user_id;
GRANT SELECT ON public.election_tally TO authenticated, anon;

CREATE TABLE public.election_timeline (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  election_id UUID NOT NULL REFERENCES public.elections(id) ON DELETE CASCADE,
  actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  event TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.election_timeline TO authenticated;
GRANT SELECT ON public.election_timeline TO anon;
GRANT ALL ON public.election_timeline TO service_role;
ALTER TABLE public.election_timeline ENABLE ROW LEVEL SECURITY;
CREATE POLICY "View timeline" ON public.election_timeline FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY "Staff add timeline" ON public.election_timeline FOR INSERT TO authenticated WITH CHECK (actor_id = auth.uid() AND (public.has_role(auth.uid(),'TEACHER') OR public.has_role(auth.uid(),'OFFICE')));

-- =========================================================================
-- MISSION 10 — TRUST FLAGS
-- =========================================================================
CREATE TABLE public.trust_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  flagged_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  kind TEXT NOT NULL,
  weight NUMERIC(4,2) NOT NULL DEFAULT 1,
  reason TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.trust_flags TO authenticated;
GRANT ALL ON public.trust_flags TO service_role;
ALTER TABLE public.trust_flags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "View trust flags" ON public.trust_flags FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(),'TEACHER') OR public.has_role(auth.uid(),'OFFICE') OR public.has_role(auth.uid(),'CAPTAIN'));
CREATE POLICY "Staff manage trust flags" ON public.trust_flags FOR ALL TO authenticated USING (public.has_role(auth.uid(),'TEACHER') OR public.has_role(auth.uid(),'OFFICE')) WITH CHECK (public.has_role(auth.uid(),'TEACHER') OR public.has_role(auth.uid(),'OFFICE'));
CREATE TRIGGER trust_updated BEFORE UPDATE ON public.trust_flags FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE VIEW public.trust_scores AS
SELECT user_id, COALESCE(SUM(weight),0)::NUMERIC(6,2) AS score, COUNT(*)::INT AS flag_count
FROM public.trust_flags WHERE active = true
GROUP BY user_id;
GRANT SELECT ON public.trust_scores TO authenticated;
