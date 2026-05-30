import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { api, type Recipe } from "@/lib/api";
import { toast } from "sonner";
import { Clock, Flame, Loader2, Trash2, BookHeart, Sparkles, ChevronDown } from "lucide-react";

export const Route = createFileRoute("/my-recipes")({
  component: MyRecipesPage,
});

function MyRecipesPage() {
  const { user, loading: authLoading } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    setLoading(true);
    api
      .listRecipes()
      .then((r) => {
        if (!cancelled) setRecipes(Array.isArray(r) ? r : []);
      })
      .catch((err) => {
        if (!cancelled) {
          toast.error(err instanceof Error ? err.message : "Failed to load recipes");
          setRecipes([]);
        }
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [user]);

  if (authLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  if (!user) return <Navigate to="/login" />;

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await api.deleteRecipe(id);
      setRecipes((prev) => (prev ? prev.filter((r) => r._id !== id) : prev));
      toast.success("Recipe removed");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">My Cookbook</h1>
          <p className="mt-1 text-muted-foreground">All the recipes you've saved with muya.</p>
        </div>
        <Link
          to="/generate"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow transition hover:bg-primary/90"
        >
          <Sparkles className="h-4 w-4" /> Generate New
        </Link>
      </div>

      {loading ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : !recipes || recipes.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border bg-card p-12 text-center">
          <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <BookHeart className="h-7 w-7" />
          </div>
          <h2 className="text-xl font-semibold">No recipes yet</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Generate your first recipe and save it to start your cookbook.
          </p>
          <Link
            to="/generate"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow"
          >
            <Sparkles className="h-4 w-4" /> Generate Recipe
          </Link>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {recipes.map((r) => {
            const id = r._id || r.title;
            const isOpen = expanded === id;
            return (
              <article
                key={id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card transition hover:-translate-y-0.5 hover:shadow-glow"
              >
                <div className="bg-gradient-to-br from-primary/15 via-primary/5 to-transparent p-5">
                  <h3 className="line-clamp-2 text-lg font-bold leading-tight">{r.title}</h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-background px-2.5 py-1 text-xs font-medium">
                      <Clock className="h-3 w-3 text-primary" /> {r.cookingTime}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-background px-2.5 py-1 text-xs font-medium">
                      <Flame className="h-3 w-3 text-primary" /> {r.difficulty}
                    </span>
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <button
                    onClick={() => setExpanded(isOpen ? null : id)}
                    className="flex items-center justify-between text-sm font-medium text-muted-foreground transition hover:text-foreground"
                  >
                    {isOpen ? "Hide details" : "View recipe"}
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {isOpen && (
                    <div className="mt-4 space-y-4 text-sm">
                      <div>
                        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Ingredients
                        </h4>
                        <ul className="space-y-1">
                          {r.ingredients.map((ing, i) => (
                            <li key={i} className="flex gap-2">
                              <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-primary" />
                              <span>{ing}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Steps
                        </h4>
                        <ol className="space-y-2">
                          {r.instructions.map((step, i) => (
                            <li key={i} className="flex gap-2">
                              <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                                {i + 1}
                              </span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    </div>
                  )}

                  <div className="mt-auto pt-5">
                    <button
                      onClick={() => r._id && handleDelete(r._id)}
                      disabled={!r._id || deletingId === r._id}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm font-medium text-destructive transition hover:bg-destructive hover:text-destructive-foreground disabled:opacity-60"
                    >
                      {deletingId === r._id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                      Delete 🗑️
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
