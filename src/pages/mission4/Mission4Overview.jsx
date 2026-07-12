import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer, LineChart, Line, AreaChart, Area, BarChart, Bar,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import { Coins, Plus, Wallet, ArrowUpRight, ArrowDownRight, Receipt, PieChart as PieIcon, Download, BarChart3, FileText, Utensils } from 'lucide-react';
import PageContainer from '../../components/layout/PageContainer.jsx';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Card from '../../components/common/Card.jsx';
import Button from '../../components/common/Button.jsx';
import SectionHeader from '../../components/ui/SectionHeader.jsx';
import { StatCard } from '../../components/common/Cards.jsx';
import Mission4SubNav from '../../components/mission4/Mission4SubNav.jsx';
import BudgetProgress from '../../components/mission4/BudgetProgress.jsx';
import TransactionRow from '../../components/mission4/TransactionRow.jsx';
import TransactionDrawer from '../../components/mission4/TransactionDrawer.jsx';
import TransactionModal from '../../components/mission4/TransactionModal.jsx';
import ChartContainer from '../../components/mission4/ChartContainer.jsx';
import {
  SUMMARY, TRANSACTIONS, MONTHLY_TREND, CATEGORY_BREAKDOWN, WEEKLY_SPEND, BALANCE_TREND, CASHFLOW, formatBDT,
} from '../../mocks/data/mission4.js';

const COLORS = ['#FF8F00', '#FBC02D', '#C62828', '#4C8C2B', '#8B5CF6', '#0891B2', '#EC4899', '#F97316', '#84CC16', '#EF4444'];

const axisStyle = { fontSize: 11, fill: 'rgb(var(--muted))' };
const gridStyle = { stroke: 'rgb(var(--border))', strokeDasharray: '3 3' };

export default function Mission4Overview() {
  const [drawerTx, setDrawerTx] = useState(null);
  const [modal, setModal] = useState(false);
  const [modalType, setModalType] = useState('expense');

  const recent = TRANSACTIONS.slice(0, 6);

  const openAdd = (t) => { setModalType(t); setModal(true); };

  return (
    <PageContainer>
      <PageHeader
        title="Corrupt Economy Ledger"
        subtitle="Transparent class finances — track income, expenses, and tiffin costs in real time."
        icon={<Coins size={18} />}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" leftIcon={<Download size={14} />}>Export</Button>
            <Button leftIcon={<Plus size={14} />} onClick={() => openAdd('expense')}>Add Transaction</Button>
          </div>
        }
      />
      <Mission4SubNav />

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        <StatCard icon={<Wallet size={16} />} label="Current Balance" value={formatBDT(SUMMARY.balance)} hint="Live class balance" trend={4.2} />
        <StatCard icon={<ArrowUpRight size={16} />} label="Total Income" value={formatBDT(SUMMARY.income)} hint="All time" trend={8.1} />
        <StatCard icon={<ArrowDownRight size={16} />} label="Total Expenses" value={formatBDT(SUMMARY.expense)} hint="All time" trend={-2.4} />
        <StatCard icon={<Receipt size={16} />} label="Transactions" value={SUMMARY.total} hint="Logged" />
        <StatCard icon={<Utensils size={16} />} label="Tiffin Budget" value={formatBDT(SUMMARY.tiffinBudget)} hint="Monthly cap" />
        <StatCard icon={<PieIcon size={16} />} label="Remaining" value={formatBDT(SUMMARY.tiffinBudget - SUMMARY.tiffinSpent)} hint="After tiffin" trend={-1.3} />
      </div>

      {/* Budget progress + Quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
        <Card className="p-5 lg:col-span-2">
          <SectionHeader title="Budget Overview" description="Where the class fund is going right now." />
          <div className="grid sm:grid-cols-2 gap-5">
            <BudgetProgress label="Tiffin Budget" spent={SUMMARY.tiffinSpent} budget={SUMMARY.tiffinBudget} />
            <BudgetProgress label="Event Fund" spent={4200} budget={8000} tone="success" />
            <BudgetProgress label="Stationery" spent={1800} budget={2500} />
            <BudgetProgress label="Emergency" spent={900} budget={3000} tone="success" />
          </div>
        </Card>
        <Card className="p-5">
          <SectionHeader title="Quick Actions" description="Common tasks" />
          <div className="grid grid-cols-2 gap-2">
            <QuickBtn icon={<ArrowUpRight size={14} />} label="Add Income" onClick={() => openAdd('income')} />
            <QuickBtn icon={<ArrowDownRight size={14} />} label="Add Expense" onClick={() => openAdd('expense')} />
            <QuickBtn icon={<Utensils size={14} />} label="Add Tiffin" onClick={() => openAdd('expense')} />
            <Link to="/mission-4/analytics"><QuickBtn icon={<BarChart3 size={14} />} label="Analytics" /></Link>
            <Link to="/mission-4/exports"><QuickBtn icon={<FileText size={14} />} label="Report" /></Link>
            <Link to="/mission-4/exports"><QuickBtn icon={<Download size={14} />} label="Export" /></Link>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        <ChartContainer title="Monthly Income vs Expense" description="Last 6 months">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={MONTHLY_TREND}>
              <CartesianGrid {...gridStyle} />
              <XAxis dataKey="month" tick={axisStyle} />
              <YAxis tick={axisStyle} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="income" fill="#4C8C2B" radius={[4,4,0,0]} />
              <Bar dataKey="expense" fill="#C62828" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        <ChartContainer title="Balance Trend" description="Rolling balance">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={BALANCE_TREND}>
              <defs>
                <linearGradient id="bal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FF8F00" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="#FF8F00" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid {...gridStyle} />
              <XAxis dataKey="month" tick={axisStyle} />
              <YAxis tick={axisStyle} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="balance" stroke="#FF8F00" strokeWidth={2} fill="url(#bal)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>

        <ChartContainer title="Expense Categories" description="Where money went">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={CATEGORY_BREAKDOWN} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={2}>
                {CATEGORY_BREAKDOWN.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>

        <ChartContainer title="Weekly Spending" description="This week">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={WEEKLY_SPEND}>
              <CartesianGrid {...gridStyle} />
              <XAxis dataKey="day" tick={axisStyle} />
              <YAxis tick={axisStyle} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="amount" fill="#FBC02D" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      <div className="mt-4">
        <ChartContainer title="Cash Flow" description="Net monthly (income − expense)">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={CASHFLOW}>
              <CartesianGrid {...gridStyle} />
              <XAxis dataKey="month" tick={axisStyle} />
              <YAxis tick={axisStyle} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="net" stroke="#FF8F00" strokeWidth={2.5} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      {/* Recent transactions */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="p-5 mt-4">
          <SectionHeader
            title="Recent Transactions"
            description="Latest ledger activity"
            action={<Link to="/mission-4/history" className="text-xs text-brand hover:underline">View all</Link>}
          />
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface text-muted text-xs uppercase tracking-wider">
                <tr>
                  {['Date','Description','Category','Type','Amount','Added By','Status',''].map((h) => (
                    <th key={h} className="px-4 py-2.5 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recent.map((tx) => <TransactionRow key={tx.id} tx={tx} onClick={setDrawerTx} />)}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>

      <TransactionDrawer tx={drawerTx} onClose={() => setDrawerTx(null)} />
      <TransactionModal open={modal} onClose={() => setModal(false)} onSave={() => {}} initialType={modalType} />
    </PageContainer>
  );
}

function QuickBtn({ icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full h-16 rounded-lg border border-border bg-surface hover:border-brand hover:bg-brand-soft/50 transition-colors flex flex-col items-center justify-center gap-1 text-xs font-medium text-fg"
    >
      <span className="text-brand">{icon}</span>
      {label}
    </button>
  );
}

const tooltipStyle = {
  background: 'rgb(var(--elevated))',
  border: '1px solid rgb(var(--border))',
  borderRadius: 8,
  fontSize: 12,
  color: 'rgb(var(--fg))',
};
