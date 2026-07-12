import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, XCircle, X } from 'lucide-react';
import { cx } from '../../utils/index.js';

const ToastCtx = createContext(null);

const icons = {
  success: <CheckCircle2 size={16} className="text-success" />,
  error: <XCircle size={16} className="text-danger" />,
  warning: <AlertCircle size={16} className="text-warning" />,
  info: <Info size={16} className="text-brand" />,
};

export function ToastProvider({ children }) {
  const [items, setItems] = useState([]);
  const dismiss = useCallback((id) => setItems((xs) => xs.filter((t) => t.id !== id)), []);
  const push = useCallback((toast) => {
    const id = Date.now() + Math.random();
    setItems((xs) => [...xs, { id, tone: 'info', ...toast }]);
    setTimeout(() => dismiss(id), toast.duration ?? 3200);
  }, [dismiss]);
  const value = useMemo(() => ({ push, dismiss }), [push, dismiss]);
  return (
    <ToastCtx.Provider value={value}>
      {children}
      <div className="fixed bottom-4 right-4 z-[60] flex flex-col gap-2 w-80">
        <AnimatePresence>
          {items.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              className={cx(
                'flex items-start gap-3 rounded-lg border border-border bg-elevated shadow-md px-3.5 py-3'
              )}
            >
              <span className="mt-0.5">{icons[t.tone] || icons.info}</span>
              <div className="flex-1 min-w-0">
                {t.title && <p className="text-sm font-medium text-fg">{t.title}</p>}
                {t.message && <p className="text-xs text-muted mt-0.5">{t.message}</p>}
              </div>
              <button
                onClick={() => dismiss(t.id)}
                aria-label="Dismiss notification"
                className="text-muted hover:text-fg"
              >
                <X size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastCtx.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

export default function Toast() { return null; }
