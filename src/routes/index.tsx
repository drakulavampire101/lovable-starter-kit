import { createFileRoute, Link } from "@tanstack/react-router";
import { type ComponentType } from "react";
import { Rocket, Zap, Shield } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="flex flex-col">
      <section className="mx-auto max-w-5xl px-4 py-24 text-center">
        <h1 className="text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
          React + Vite Starter
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          A minimal, type-safe foundation for your next web app. Add pages,
          components, and backend logic as you grow.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            to="/about"
            className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Get started
          </Link>
          <a
            href="https://docs.lovable.dev"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Read the docs
          </a>
        </div>
      </section>

      <section className="border-t border-border bg-muted/40">
        <div className="mx-auto max-w-5xl px-4 py-16">
          <div className="grid gap-8 sm:grid-cols-3">
            <Feature
              icon={Zap}
              title="Fast"
              description="Vite-powered dev server and optimized builds."
            />
            <Feature
              icon={Shield}
              title="Type-safe"
              description="TypeScript and TanStack Router out of the box."
            />
            <Feature
              icon={Rocket}
              title="Scalable"
              description="File-based routes and server functions ready when you are."
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function Feature({
  icon: Icon,
  title,
  description,
}: {
  icon: ComponentType<{ className?: string }>;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 text-card-foreground shadow-sm">
      <Icon className="h-8 w-8 text-primary" />
      <h3 className="mt-4 font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
