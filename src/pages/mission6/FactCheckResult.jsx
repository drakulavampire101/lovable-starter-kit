import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { SearchCheck, ArrowLeft, Share2, Bookmark, Sparkles } from 'lucide-react';
import PageContainer from '../../components/layout/PageContainer.jsx';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Card from '../../components/common/Card.jsx';
import SectionHeader from '../../components/ui/SectionHeader.jsx';
import Button from '../../components/common/Button.jsx';
import Mission6SubNav from '../../components/mission6/Mission6SubNav.jsx';
import SearchBar from '../../components/mission6/SearchBar.jsx';
import VerdictBadge from '../../components/mission6/VerdictBadge.jsx';
import ConfidenceRing from '../../components/mission6/ConfidenceRing.jsx';
import EvidenceTimeline from '../../components/mission6/EvidenceTimeline.jsx';
import RuleCard from '../../components/mission6/RuleCard.jsx';
import { Accordion } from '../../components/ui/Disclosure.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import { buildResult, findVerdict, findCategory } from '../../mocks/data/mission6.js';

export default function FactCheckResult() {
  const [params] = useSearchParams();
  const nav = useNavigate();
  const query = params.get('q') ?? '';
  const [loading, setLoading] = useState(true);
  const result = useMemo(() => buildResult(query), [query]);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(t);
  }, [query]);

  if (loading) {
    return (
      <PageContainer>
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-brand/20 blur-2xl animate-pulse" />
            <div className="relative h-16 w-16 rounded-full bg-brand-soft flex items-center justify-center">
              <Sparkles className="text-brand animate-pulse" size={28} />
            </div>
          </div>
          <p className="mt-6 text-sm font-medium text-fg">Cross-referencing the rulebook…</p>
          <p className="text-xs text-muted mt-1">Embedding query · retrieving sources · scoring confidence</p>
          <div className="mt-4"><Spinner /></div>
        </div>
      </PageContainer>
    );
  }

  const v = findVerdict(result.verdict);
  const cat = findCategory(result.category);

  return (
    <PageContainer>
      <PageHeader
        title="Fact Check Result"
        subtitle="AI-assisted verification against the official rulebook"
        icon={<SearchCheck size={18} />}
        actions={
          <Button variant="secondary" size="sm" leftIcon={<ArrowLeft size={14} />} onClick={() => nav('/mission-6')}>Back</Button>
        }
      />
      <Mission6SubNav />

      {/* SEARCH BAR */}
      <div className="mb-6">
        <SearchBar size="sm" value={query} onSubmit={(q) => nav(`/mission-6/result?q=${encodeURIComponent(q)}`)} />
      </div>

      {/* VERDICT + CLAIM */}
      <Card className="p-6 mb-4 bg-gradient-to-br from-surface to-brand-soft/30">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="md:col-span-2">
            <div className="text-[11px] uppercase tracking-wider text-muted">Claim</div>
            <h2 className="mt-1 text-lg sm:text-xl font-semibold text-fg leading-snug">"{result.query}"</h2>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <VerdictBadge verdict={result.verdict} size="lg" />
              <span
                className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium"
                style={{ background: `${cat.color}18`, color: cat.color }}
              >
                {cat.icon} {cat.label}
              </span>
              <span className="text-[11px] text-muted font-mono">{result.id}</span>
            </div>
            <p className="mt-3 text-sm text-muted">{v.desc}</p>
            <div className="mt-4 flex items-center gap-2">
              <Button size="sm" variant="secondary" leftIcon={<Bookmark size={14} />}>Save</Button>
              <Button size="sm" variant="ghost" leftIcon={<Share2 size={14} />}>Share</Button>
            </div>
          </div>
          <div className="flex justify-center md:justify-end">
            <ConfidenceRing value={result.confidence} verdict={result.verdict} size={140} />
          </div>
        </div>
      </Card>

      {/* SUMMARY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-5">
            <SectionHeader title="Summary" description="What the AI concluded" />
            <p className="text-sm text-fg leading-relaxed">{result.summary}</p>
          </Card>

          <Card className="p-5">
            <SectionHeader title="Detailed analysis & reasoning" />
            <Accordion
              items={[
                { title: 'Detailed analysis', content: result.detailed },
                { title: 'Reasoning steps', content: (
                  <ol className="list-decimal pl-5 space-y-1">
                    {result.reasoning.map((r, i) => <li key={i}>{r}</li>)}
                  </ol>
                ) },
                { title: 'Recommendations', content: (
                  <ul className="list-disc pl-5 space-y-1">
                    {result.recommendations.map((r, i) => <li key={i}>{r}</li>)}
                  </ul>
                ) },
              ]}
            />
          </Card>

          <Card className="p-5">
            <SectionHeader title="Evidence" description="Sources cross-referenced" />
            <EvidenceTimeline items={result.evidence} />
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="p-5">
            <SectionHeader title="Related rules" description={`From ${cat.label}`} />
            <div className="space-y-3">
              {result.related.map((r) => <RuleCard key={r.id} rule={r} />)}
            </div>
          </Card>

          <Card className="p-5">
            <SectionHeader title="You may also want to verify" />
            <div className="space-y-2">
              {result.suggested.map((s) => (
                <Link
                  key={s}
                  to={`/mission-6/result?q=${encodeURIComponent(s)}`}
                  className="block rounded-lg border border-border bg-surface p-3 text-sm text-fg hover:bg-elevated hover:border-brand/50 transition"
                >
                  → {s}
                </Link>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
