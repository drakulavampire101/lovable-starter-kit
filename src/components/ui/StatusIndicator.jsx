import { cx } from '../../utils/index.js';

const tones = {
  online: 'bg-success',
  idle: 'bg-warning',
  offline: 'bg-subtle',
  danger: 'bg-danger',
};

export default function StatusIndicator({ status = 'online', label, className = '' }) {
  return (
    <span className={cx('inline-flex items-center gap-2 text-xs text-muted', className)}>
      <span className={cx('h-2 w-2 rounded-full', tones[status])} />
      {label}
    </span>
  );
}
