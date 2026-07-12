import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Hash, ArrowRight, Loader2, Lock, GraduationCap, Users, Shield } from 'lucide-react';
import AuthShell from '../../components/auth/AuthShell.jsx';
import LoginCard from '../../components/auth/LoginCard.jsx';
import FormField from '../../components/forms/FormField.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

const CLASSES = ['6', '7', '8', '9', '10'];
const SECTIONS = ['A', 'B', 'C', 'D'];
const ROLES = [
  { value: 'student', label: 'Student' },
  { value: 'captain', label: 'Class Captain' },
  { value: 'office', label: 'Office / Teacher' },
];

export default function RollLogin() {
  const nav = useNavigate();
  const { signIn } = useAuth();
  const [className, setClassName] = useState('9');
  const [section, setSection] = useState('C');
  const [role, setRole] = useState('student');
  const [rollNumber, setRoll] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { setError(''); }, [rollNumber, password, className, section, role]);

  const canSubmit = rollNumber.trim().length >= 1 && password.length >= 1 && !loading;

  const submit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    const composedRoll = role === 'office' ? rollNumber.trim() : `${className}${section}-${rollNumber.trim()}`;
    const res = await signIn({ rollNumber: composedRoll, password, role });
    setLoading(false);
    if (!res.success) { setError(res.error || 'Login failed'); return; }
    nav('/auth/loading');
  };

  return (
    <AuthShell centered>
      <LoginCard
        title="Sign in"
        description="Enter your class, section, roll and password to access the console."
        footer={
          <span>
            Don't have an account?{' '}
            <Link to="/auth/register" className="text-brand hover:underline">Register</Link>
          </span>
        }
      >
        <form onSubmit={submit} className="space-y-4" noValidate>
          <SelectField
            label="Sign in as"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            icon={<Shield size={14} />}
            options={ROLES}
          />
          <div className="grid grid-cols-2 gap-3">
            <SelectField
              label="Class"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              icon={<GraduationCap size={14} />}
              options={CLASSES.map((c) => ({ value: c, label: `Class ${c}` }))}
            />
            <SelectField
              label="Section"
              value={section}
              onChange={(e) => setSection(e.target.value)}
              icon={<Users size={14} />}
              options={SECTIONS.map((s) => ({ value: s, label: s }))}
            />
          </div>
          <FormField
            label="Roll Number"
            name="rollNumber"
            placeholder="e.g. 005"
            autoComplete="username"
            value={rollNumber}
            onChange={(e) => setRoll(e.target.value)}
            leadingIcon={<Hash size={14} />}
            maxLength={32}
          />
          <FormField
            label="Password"
            name="password"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            leadingIcon={<Lock size={14} />}
            state={error ? 'error' : 'default'}
            message={error || ''}
          />
          <motion.button
            whileTap={{ scale: canSubmit ? 0.98 : 1 }}
            type="submit"
            disabled={!canSubmit}
            className="w-full inline-flex items-center justify-center gap-2 h-11 rounded-lg bg-brand text-brand-fg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition"
          >
            {loading ? <><Loader2 size={16} className="animate-spin" /> Signing in…</> : <>Continue <ArrowRight size={16} /></>}
          </motion.button>
          <div className="flex items-center justify-between text-xs text-muted">
            <Link to="/auth/welcome" className="hover:text-fg transition">← Back</Link>
            <Link to="/auth/expired" className="hover:text-fg transition">Session expired?</Link>
          </div>
        </form>
      </LoginCard>
    </AuthShell>
  );
}

function SelectField({ label, value, onChange, icon, options }) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-fg mb-1.5">{label}</span>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">{icon}</span>
        <select
          value={value}
          onChange={onChange}
          className="w-full h-11 pl-9 pr-3 rounded-lg border border-ink/15 bg-paper text-fg text-sm focus:outline-none focus:ring-2 focus:ring-brand/40"
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>
    </label>
  );
}

