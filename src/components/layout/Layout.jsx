// Kept for backwards compatibility — canonical shell is DashboardLayout.
export default function Layout({ children }) {
  return <div className="min-h-dvh bg-bg text-fg">{children}</div>;
}
