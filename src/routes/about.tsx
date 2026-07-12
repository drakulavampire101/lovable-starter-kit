import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About | React Vite Starter" },
      { name: "description", content: "Learn more about this React + Vite starter." },
      { property: "og:title", content: "About | React Vite Starter" },
      { property: "og:description", content: "Learn more about this React + Vite starter." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-4xl font-bold tracking-tight text-foreground">About</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        This is a minimal React + Vite foundation designed for rapid iteration. Add
        routes, components, and backend features as you build out your idea.
      </p>
    </main>
  );
}
