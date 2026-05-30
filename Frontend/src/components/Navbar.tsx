import { Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth-context";
import { ChefHat, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate({ to: "/login" });
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-glow transition-transform group-hover:scale-105">
            <ChefHat className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight">
            <span className="text-primary">muya</span>
          </span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          {user ? (
            <>
              <Link
                to="/generate"
                className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground data-[status=active]:bg-primary/10 data-[status=active]:text-primary"
              >
                Generate
              </Link>
              <Link
                to="/my-recipes"
                className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground data-[status=active]:bg-primary/10 data-[status=active]:text-primary"
              >
                My Recipes
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="gap-1.5"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-glow"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
