import { Link } from "@tanstack/react-router";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link to="/" className="text-lg font-semibold tracking-tight text-foreground">
          Starter
        </Link>
        <nav className="flex items-center gap-4 text-sm font-medium">
          <Link
            to="/"
            activeProps={{ className: "text-foreground" }}
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Home
          </Link>
          <Link
            to="/about"
            activeProps={{ className: "text-foreground" }}
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            About
          </Link>
        </nav>
      </div>
    </header>
  );
}
