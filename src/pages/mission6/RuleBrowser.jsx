import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BookOpen, Search } from 'lucide-react';
import PageContainer from '../../components/layout/PageContainer.jsx';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Card from '../../components/common/Card.jsx';
import Mission6SubNav from '../../components/mission6/Mission6SubNav.jsx';
import RuleCard from '../../components/mission6/RuleCard.jsx';
import EmptyState from '../../components/feedback/EmptyState.jsx';
import Pagination from '../../components/ui/Pagination.jsx';
import { RULES, RULE_CATEGORIES } from '../../mocks/data/mission6.js';
import { cx } from '../../utils/index.js';

const PAGE_SIZE = 12;

export default function RuleBrowser() {
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const cat = params.get('cat') ?? 'all';

  const setCat = (k) => {
    if (k === 'all') params.delete('cat');
    else params.set('cat', k);
    setParams(params, { replace: true });
    setPage(1);
  };

  const filtered = useMemo(() => {
    return RULES.filter((r) => (cat === 'all' || r.category === cat)
      && (!query || r.title.toLowerCase().includes(query.toLowerCase()) || r.summary.toLowerCase().includes(query.toLowerCase())));
  }, [cat, query]);

  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  return (
    <PageContainer>
      <PageHeader
        title="University Rulebook"
        subtitle="Browse and search the official rules referenced by the fact checker."
        icon={<BookOpen size={18} />}
      />
      <Mission6SubNav />

      <Card className="p-4 mb-4">
        <div className="flex items-center gap-2 rounded-full border border-border bg-elevated px-4 h-11">
          <Search size={16} className="text-muted" />
          <input
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
            placeholder="Search rules by title or keyword..."
            className="flex-1 bg-transparent outline-none text-sm text-fg placeholder:text-muted"
          />
        </div>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {[{ key: 'all', label: 'All', icon: '🗂️', color: '#808080' }, ...RULE_CATEGORIES].map((c) => (
            <button
              key={c.key}
              onClick={() => setCat(c.key)}
              className={cx(
                'shrink-0 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs border transition',
                cat === c.key ? 'text-white border-transparent' : 'text-fg border-border bg-surface hover:bg-elevated'
              )}
              style={cat === c.key ? { background: c.color } : undefined}
            >
              <span>{c.icon}</span>{c.label}
            </button>
          ))}
        </div>
      </Card>

      <div className="mb-3 text-xs text-muted">
        Showing {paged.length} of {filtered.length} rules
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No rules found" message="Try a different keyword or category." />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {paged.map((r) => <RuleCard key={r.id} rule={r} />)}
          </div>
          <div className="mt-6 flex justify-center">
            <Pagination page={page} total={totalPages} onChange={setPage} />
          </div>
        </>
      )}
    </PageContainer>
  );
}
