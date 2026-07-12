import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../../components/layout/PageContainer.jsx';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Mission3SubNav from '../../components/mission3/Mission3SubNav.jsx';
import Card from '../../components/common/Card.jsx';
import Button from '../../components/common/Button.jsx';
import Badge from '../../components/ui/Badge.jsx';
import SectionHeader from '../../components/ui/SectionHeader.jsx';
import { BookOpen, Sparkles, Upload, FileText, Timer, Lightbulb, Type, Hash } from 'lucide-react';
import { EXAMPLE_SYLLABUS } from '../../mocks/data/mission3.js';

const readingTime = (words) => Math.max(1, Math.round(words / 220));

export default function SyllabusInput() {
  const [text, setText] = useState('');
  const navigate = useNavigate();

  const { chars, words, minutes } = useMemo(() => {
    const w = text.trim() ? text.trim().split(/\s+/).length : 0;
    return { chars: text.length, words: w, minutes: readingTime(w) };
  }, [text]);

  return (
    <PageContainer>
      <PageHeader
        title="New Syllabus Analysis"
        subtitle="Paste the full syllabus. The AI will identify exam-worthy topics and remove noise."
        icon={<BookOpen size={18} />}
      />
      <Mission3SubNav />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-5">
            <SectionHeader
              title="Syllabus editor"
              description="Paste text below. Formatting is preserved."
              action={
                <button
                  type="button"
                  onClick={() => setText(EXAMPLE_SYLLABUS)}
                  className="text-xs text-brand hover:underline"
                >
                  Load example
                </button>
              }
            />
            <label htmlFor="syllabus" className="sr-only">Syllabus text</label>
            <textarea
              id="syllabus"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste the complete syllabus here..."
              rows={16}
              className="w-full resize-y rounded-lg border border-border bg-bg px-4 py-3 text-sm text-fg placeholder:text-subtle font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-brand/40"
            />
            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted">
              <span className="inline-flex items-center gap-1"><Hash size={12} /> {chars.toLocaleString()} chars</span>
              <span className="inline-flex items-center gap-1"><Type size={12} /> {words.toLocaleString()} words</span>
              <span className="inline-flex items-center gap-1"><Timer size={12} /> ~{minutes} min read</span>
            </div>

            <div className="mt-5 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <Button
                size="lg"
                className="flex-1"
                leftIcon={<Sparkles size={16} />}
                disabled={words < 10}
                onClick={() => navigate('/mission-3/processing')}
              >
                Generate Summary
              </Button>
              <Button variant="secondary" size="lg" leftIcon={<Upload size={16} />}>
                Upload file
              </Button>
            </div>
            {words < 10 && (
              <p className="mt-2 text-xs text-subtle">Paste at least a full week outline to enable analysis.</p>
            )}
          </Card>

          <Card className="p-5">
            <SectionHeader title="Supported formats" description="Upload UI only — no backend attached." />
            <div className="grid grid-cols-3 gap-3">
              {[
                { ext: 'PDF', hint: 'Course booklets, scans' },
                { ext: 'DOCX', hint: 'Word documents' },
                { ext: 'TXT', hint: 'Plain text outlines' },
              ].map((f) => (
                <div key={f.ext} className="rounded-lg border border-border bg-elevated/50 p-4 text-center">
                  <div className="mx-auto mb-2 h-9 w-9 rounded-lg bg-brand-soft text-brand flex items-center justify-center">
                    <FileText size={16} />
                  </div>
                  <p className="text-sm font-semibold text-fg">{f.ext}</p>
                  <p className="text-xs text-muted mt-0.5">{f.hint}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="p-5">
            <SectionHeader title="Example syllabus" description="Preview the shape the AI expects." />
            <div className="rounded-lg border border-border bg-bg p-3 max-h-56 overflow-y-auto">
              <pre className="text-xs font-mono text-muted whitespace-pre-wrap leading-relaxed">
                {EXAMPLE_SYLLABUS}
              </pre>
            </div>
            <Button
              size="sm"
              variant="secondary"
              className="w-full mt-3"
              onClick={() => setText(EXAMPLE_SYLLABUS)}
            >
              Use this example
            </Button>
          </Card>

          <Card className="p-5">
            <SectionHeader title="Tips for better results" description="Give the model clean context." />
            <ul className="space-y-3 text-sm text-fg">
              {[
                'Include week numbers or unit labels — this helps the plan.',
                'Keep chapter numbers next to topics if you have them.',
                'Non-examinable sections (indexes, biographies) will be filtered out automatically.',
                'Longer syllabi produce more accurate difficulty ratings.',
              ].map((t, i) => (
                <li key={i} className="flex gap-2">
                  <Lightbulb size={16} className="text-warning shrink-0 mt-0.5" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </Card>

          <div>
            <Badge tone="brand">AI</Badge>
            <p className="mt-2 text-xs text-muted">
              This build uses realistic mock responses. No syllabus content leaves your browser.
            </p>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
