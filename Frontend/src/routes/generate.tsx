import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useState, type KeyboardEvent } from "react";
import { useAuth } from "@/lib/auth-context";
import { api, type Recipe } from "@/lib/api";
import { toast } from "sonner";
import { Loader2, Plus, Sparkles, X, Clock, Flame, Heart, Check } from "lucide-react";

export const Route = createFileRoute("/generate")({
  component: GeneratePage,
});

function GeneratePage() {
  const { user, loading } = useAuth();
  const [input, setInput] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  if (!user) return <Navigate to="/login" />;

  const addIngredient = () => {
    const v = input.trim();
    if (!v) return;
    if (ingredients.map((i) => i.toLowerCase()).includes(v.toLowerCase())) {
      setInput("");
      return;
    }
    setIngredients([...ingredients, v]);
    setInput("");
  };

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addIngredient();
    }
  };

  const removeIngredient = (i: number) =>
    setIngredients(ingredients.filter((_, idx) => idx !== i));

  const generate = async () => {
    if (ingredients.length === 0) {
      toast.error("Add at least one ingredient.");
      return;
    }
    setGenerating(true);
    setRecipe(null);
    setSaved(false);
    try {
      const r = await api.generateRecipe(ingredients);
      setRecipe(r);
      toast.success("Your recipe is ready!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not generate recipe");
    } finally {
      setGenerating(false);
    }
  };

  const save = async () => {
    if (!recipe) return;
    setSaving(true);
    try {
      await api.saveRecipe(recipe);
      setSaved(true);
      toast.success("Saved to your favorites!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save recipe");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Hi {user.name.split(" ")[0]}, what shall we cook?
        </h1>
        <p className="mt-2 text-muted-foreground">Add your ingredients and let muya do the rest.</p>
      </div>

      <div className="rounded-3xl border border-border bg-card p-6 shadow-card sm:p-8">
        <label className="mb-2 block text-sm font-medium">Ingredients</label>
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKey}
            placeholder="e.g. chicken, tomato, basil..."
            className="flex-1 rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          <button
            type="button"
            onClick={addIngredient}
            className="inline-flex items-center gap-1 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium transition hover:bg-accent"
          >
            <Plus className="h-4 w-4" /> Add
          </button>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">Press Enter or comma to add an ingredient.</p>

        {ingredients.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {ingredients.map((ing, i) => (
              <span
                key={`${ing}-${i}`}
                className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary"
              >
                {ing}
                <button
                  onClick={() => removeIngredient(i)}
                  className="rounded-full p-0.5 transition hover:bg-primary/20"
                  aria-label={`Remove ${ing}`}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </span>
            ))}
          </div>
        )}

        <button
          onClick={generate}
          disabled={generating || ingredients.length === 0}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3.5 text-base font-semibold text-primary-foreground shadow-glow transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {generating ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Cooking up something special...
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5" />
              Generate Recipe 🪄
            </>
          )}
        </button>
      </div>

      {generating && (
        <div className="mt-8 rounded-3xl border border-border bg-card p-10 text-center shadow-card">
          <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <Loader2 className="h-7 w-7 animate-spin text-primary" />
          </div>
          <p className="text-sm text-muted-foreground">muya is dreaming up your dish...</p>
        </div>
      )}

      {recipe && !generating && <RecipeView recipe={recipe} onSave={save} saving={saving} saved={saved} />}
    </div>
  );
}

function RecipeView({
  recipe,
  onSave,
  saving,
  saved,
}: {
  recipe: Recipe;
  onSave: () => void;
  saving: boolean;
  saved: boolean;
}) {
  return (
    <div className="mt-8 overflow-hidden rounded-3xl border border-border bg-card shadow-card">
      <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6 sm:p-8">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{recipe.title}</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-background px-3 py-1.5 text-sm font-medium shadow-sm">
            <Clock className="h-4 w-4 text-primary" /> {recipe.cookingTime}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-background px-3 py-1.5 text-sm font-medium shadow-sm">
            <Flame className="h-4 w-4 text-primary" /> {recipe.difficulty}
          </span>
        </div>
      </div>

      <div className="grid gap-8 p-6 sm:p-8 md:grid-cols-2">
        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Ingredients
          </h3>
          <ul className="space-y-2">
            {recipe.ingredients.map((ing, i) => (
              <li key={i} className="flex gap-2 text-sm">
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                <span>{ing}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Instructions
          </h3>
          <ol className="space-y-3">
            {recipe.instructions.map((step, i) => (
              <li key={i} className="flex gap-3 text-sm">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {i + 1}
                </span>
                <span className="pt-0.5">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="border-t border-border bg-muted/30 p-6 sm:p-8">
        <button
          onClick={onSave}
          disabled={saving || saved}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition hover:bg-primary/90 disabled:opacity-70 sm:w-auto"
        >
          {saved ? (
            <>
              <Check className="h-4 w-4" /> Saved
            </>
          ) : saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Saving...
            </>
          ) : (
            <>
              <Heart className="h-4 w-4" /> Save to Favorites
            </>
          )}
        </button>
      </div>
    </div>
  );
}
