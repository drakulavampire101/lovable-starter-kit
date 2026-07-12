
ALTER VIEW public.rating_leaderboard SET (security_invoker = true);
ALTER VIEW public.election_tally     SET (security_invoker = true);
ALTER VIEW public.trust_scores       SET (security_invoker = true);
