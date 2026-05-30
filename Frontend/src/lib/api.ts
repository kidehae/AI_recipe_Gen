const BASE_URL = "https://ai-recipe-gen-6hdr.onrender.com/api";

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Recipe {
  _id?: string;
  title: string;
  ingredients: string[];
  instructions: string[];
  cookingTime: string;
  difficulty: string;
}

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("muya_token");
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> | undefined),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const msg = (data && (data.message || data.error)) || `Request failed (${res.status})`;
    throw new Error(msg);
  }
  return data as T;
}

export const api = {
  register: (body: { name: string; email: string; password: string }) =>
    request<{ token: string; user: User }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  login: (body: { email: string; password: string }) =>
    request<{ token: string; user: User }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  me: () => request<{ user: User }>("/auth/me"),
  generateRecipe: (ingredients: string[]) =>
    request<Recipe>("/recipes/generate", {
      method: "POST",
      body: JSON.stringify({ ingredients }),
    }),
  saveRecipe: (recipe: Recipe) =>
    request<Recipe>("/recipes/save", {
      method: "POST",
      body: JSON.stringify(recipe),
    }),
  listRecipes: () => request<Recipe[]>("/recipes"),
  deleteRecipe: (id: string) =>
    request<{ message: string }>(`/recipes/${id}`, { method: "DELETE" }),
};
