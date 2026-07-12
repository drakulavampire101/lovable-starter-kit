
# Backend port to Lovable Cloud

Excludes Mission 3 (AI syllabus) and Mission 6 (Fact checker) — those keep the current mock/service shape.

## Auth model

- Supabase Auth (email/password) is the source of truth.
- Frontend takes `rollNumber` + `password`, converts to `${rollNumber.toLowerCase()}@baiust.local` for `signUp`/`signInWithPassword`. UI still shows roll number everywhere.
- `profiles` table keyed by `auth.users.id`, stores `roll_number`, `name`, `class_name`, `section`, `height`, `dob`, `vision`, `hearing`.
- `user_roles` table + `app_role` enum (`STUDENT`, `CAPTAIN`, `TEACHER`, `OFFICE`) + `has_role()` security-definer. Roles read via `has_role(auth.uid(), 'X')` in every RLS policy — no recursion.
- Trigger `on_auth_user_created` inserts into `profiles` and default role `STUDENT`.
- `authService.js` rewritten to call `supabase.auth.*`; token/refresh helpers removed.

## Schema (all `public`, all RLS + GRANTs)

Turn 1 — foundation:
- `app_role` enum, `profiles`, `user_roles`, `has_role()`, `notifications`, storage buckets (`avatars`, `evidence`).

Turn 2 — Mission 1 (complaints):
- `complaint_category`, `complaint_status` enums.
- `complaints`, `complaint_images`, `complaint_history`, `strikes` (per-user warning counter).
- Edge function `submit-complaint` (creates row + evidence upload URL, applies auto strike rules).

Turn 3 — Mission 2 (seating):
- `students_roster`, `seat_plans`, `seat_assignments`, `seat_constraints`.
- Edge function `generate-seat-plan` (deterministic assignment respecting constraints/height/vision).

Turn 4 — Mission 4 (tiffin ledger):
- `tiffin_menu`, `tiffin_transactions`, `tiffin_budgets`.

Turn 5 — Mission 5 (SOS):
- `sos_severity`, `sos_status` enums. `sos_alerts`, `sos_claims`.
- Realtime channel `sos:*` (replaces Socket.IO). Edge function `broadcast-sos` for notification fanout.

Turn 6 — Mission 7 (peer ratings):
- `ratings` table (categories JSONB, overall generated, unique `(rater, target)` upsert).
- View `rating_aggregates` (avg per category + count) + `leaderboard` view.
- Edge function `moderate-rating` (approve/reject, recompute aggregates).

Turn 7 — Mission 8 (captain engine):
- `recommendation_rounds`, `candidate_profiles`, `recommendation_history`.
- Edge function `recompute-round` (pulls metrics from missions 1/5/7, applies weights, ranks).

Turn 8 — Mission 9 (elections):
- `elections`, `election_candidates`, `votes` (unique `(election, voter)`), `election_timeline`.
- Edge function `cast-vote` (validates active window, records vote, broadcasts tally).
- Realtime channel `election:{id}:tally`.

Turn 9 — Mission 10 (trust graph) + dashboard:
- `trust_flags`, `trust_scores` view. `notifications` already exists.
- Views/functions for `/dashboard/stats|activity|charts` equivalents.

## Frontend rewiring

Each service file becomes a thin wrapper around `supabase.from(...)` / `supabase.functions.invoke(...)`:

- `services/api.js` — deleted (no more Express).
- `services/socket.js` — replaced with `supabase.channel(...)` helpers (`onSosNew`, `onNotification`, etc. keep the same signatures so pages don't change).
- `services/authService.js` — Supabase Auth calls; `AuthContext` reads `session` + profile + roles.
- Everything else keeps the same exported function names, so pages stay untouched.

Env: `VITE_API_URL` unused; Supabase client uses auto-injected `VITE_SUPABASE_URL` / `VITE_SUPABASE_PUBLISHABLE_KEY`.

## Seed data

Small fresh seed at the end of turn 1:
- Users: `2201001` (STUDENT), `2201002` (CAPTAIN), `t001` (TEACHER), `o001` (OFFICE). Password `Password123!` for all.
- Later turns seed only the minimum each mission needs to render a non-empty UI (a round, an active election, a few flags/complaints).

## Technical notes

- Every `CREATE TABLE public.X` is followed by `GRANT` + `ENABLE RLS` + policies in the same migration.
- Anon `SELECT` only on truly public views (leaderboards, active election candidates list). All writes require `authenticated`.
- Edge functions validate JWT in code, use Zod on bodies, return `{ success, message, data }` envelope so the frontend service layer stays consistent.
- Realtime uses Postgres CDC on `sos_alerts`, `notifications`, `votes`; broadcast channels for tally updates.
- Roll-number-as-email means email confirmation must be disabled in auth config; I'll do that with `configure_auth`.

## What ships this turn if approved

Turn 1 only: enable Cloud, create foundation migration (profiles/roles/notifications/storage), rewrite `authService` + `AuthContext` + login/register pages to use Supabase Auth, add seed users. Everything else stays on current mock/service until its dedicated turn — the UI keeps working throughout.

Confirm and I'll start with turn 1.
