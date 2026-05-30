import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth-context";
import { ChefHat, Sparkles, BookHeart } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
      </div>
    );
  }

  if (user) return <Navigate to="/generate" />;

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <div className="text-center">
        <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
          <Sparkles className="h-3.5 w-3.5" />
          AI-Powered Culinary Magic
        </div>
        <h1 className="mx-auto max-w-3xl text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">
          What's in your{" "}
          <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            kitchen
          </span>{" "}
          today?
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
          Tell muya your ingredients and get a chef-crafted recipe in seconds. Save your favorites and build a cookbook that's truly yours.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/register"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-base font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-[1.02]"
          >
            <Sparkles className="h-4 w-4" /> Start cooking
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center rounded-xl border border-border bg-card px-6 py-3 text-base font-semibold transition-colors hover:bg-accent"
          >
            I already have an account
          </Link>
        </div>
      </div>

      <div className="mt-24 grid gap-6 sm:grid-cols-3">
        {[
          { icon: ChefHat, title: "Smart Recipes", desc: "AI creates dishes tailored to what you have on hand." },
          { icon: Sparkles, title: "Instant Magic", desc: "From ingredients to instructions in a single click." },
          { icon: BookHeart, title: "Your Cookbook", desc: "Save every favorite and revisit it whenever you want." },
        ].map((f) => (
          <div key={f.title} className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <f.icon className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold">{f.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
