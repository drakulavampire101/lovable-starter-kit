import { useMemo, useState } from 'react';
import PageContainer from '../../components/layout/PageContainer.jsx';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Mission2SubNav from '../../components/mission2/Mission2SubNav.jsx';
import Card from '../../components/common/Card.jsx';
import Select from '../../components/forms/Select.jsx';
import ClassroomGrid from '../../components/mission2/ClassroomGrid.jsx';
import ClassroomLegend from '../../components/mission2/ClassroomLegend.jsx';
import Button from '../../components/common/Button.jsx';
import { LayoutGrid, Save, Sparkles } from 'lucide-react';
import { useToast } from '../../components/feedback/Toast.jsx';
import { CLASSROOM_SIZES, buildSeatingPlan, STUDENTS } from '../../mocks/data/mission2.js';

export default function ClassroomLayout() {
  const toast = useToast();
  const [sizeId, setSizeId] = useState('7x8');
  const size = CLASSROOM_SIZES.find((s) => s.id === sizeId);
  const seats = useMemo(() => buildSeatingPlan(size.rows, size.cols, STUDENTS), [size]);
  const [selected, setSelected] = useState(null);

  return (
    <PageContainer>
      <PageHeader
        title="Classroom Layout"
        subtitle="Pick a room size and preview desks, podium, aisle, and entrance."
        icon={<LayoutGrid size={18} />}
        actions={
          <div className="flex gap-2">
            <Button variant="secondary" leftIcon={<Save size={14} />} onClick={() => toast.push({ tone: 'success', title: 'Layout saved (mock)' })}>Save Layout</Button>
            <Button leftIcon={<Sparkles size={14} />} onClick={() => toast.push({ tone: 'info', title: 'Generation queued (mock)' })}>Generate Plan</Button>
          </div>
        }
      />
      <Mission2SubNav />

      <Card className="p-4 mb-4">
        <div className="flex flex-col sm:flex-row sm:items-end gap-3">
          <div className="sm:max-w-xs w-full">
            <Select label="Classroom Size" value={sizeId} onChange={(e) => setSizeId(e.target.value)}>
              {CLASSROOM_SIZES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
            </Select>
          </div>
          <div className="text-xs text-muted sm:ml-auto">
            {size.rows} rows · {size.cols} columns · {size.rows * size.cols} seats · center aisle{size.cols >= 6 ? ' enabled' : ' hidden'}
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-4">
        <ClassroomGrid
          seats={seats}
          rows={size.rows}
          cols={size.cols}
          selectedId={selected?.id}
          onSeatClick={(s) => setSelected(s)}
        />
        <div className="space-y-4">
          <Card className="p-4">
            <p className="text-xs font-semibold text-fg mb-2">Selected Seat</p>
            {selected ? (
              <div className="text-sm">
                <p className="font-mono text-muted">{selected.label}</p>
                {selected.student ? (
                  <>
                    <p className="mt-2 text-fg font-medium">{selected.student.name}</p>
                    <p className="text-xs text-muted">{selected.student.roll} · {selected.student.height}cm</p>
                  </>
                ) : (
                  <p className="mt-2 text-xs text-muted">Empty seat — drag a student in from the interactive view.</p>
                )}
              </div>
            ) : (
              <p className="text-xs text-muted">Tap any desk to inspect it.</p>
            )}
          </Card>
          <ClassroomLegend />
        </div>
      </div>
    </PageContainer>
  );
}
