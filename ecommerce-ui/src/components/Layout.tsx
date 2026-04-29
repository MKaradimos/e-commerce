import { Link, Outlet, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ShoppingCart, LogOut, Zap } from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { cartApi } from "@/api/endpoints";
import { Button } from "@/components/ui/button";

export function Layout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const { data: cart } = useQuery({
    queryKey: ["cart"],
    queryFn: cartApi.get,
    enabled: !!user,
  });

  const cartCount = cart?.items.reduce((sum, i) => sum + i.quantity, 0) ?? 0;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-50 border-b border-border/60 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="container flex h-16 items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2.5 font-bold text-xl group"
          >
            <div className="gradient-primary p-1.5 rounded-lg text-white shadow-md group-hover:shadow-lg transition-shadow">
              <Zap className="h-4 w-4" />
            </div>
            <span className="text-gradient">Electro Shop</span>
          </Link>

          <nav className="flex items-center gap-1.5">
            {user ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="relative hover:bg-primary/10 hover:text-primary"
                >
                  <Link to="/cart">
                    <ShoppingCart className="h-5 w-5" />
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 h-5 w-5 gradient-primary text-white rounded-full flex items-center justify-center text-[10px] font-bold shadow">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                </Button>

                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm font-medium">
                  <div className="h-6 w-6 gradient-primary rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {user.firstName[0]}
                  </div>
                  {user.firstName}
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="hover:bg-destructive/10 hover:text-destructive"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="hover:bg-primary/10 hover:text-primary"
                >
                  <Link to="/login">Login</Link>
                </Button>
                <Button
                  size="sm"
                  asChild
                  className="gradient-primary border-0 shadow-md hover:shadow-lg hover:opacity-90 transition-all"
                >
                  <Link to="/register">Sign up</Link>
                </Button>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1 container py-8">
        <Outlet />
      </main>

      <footer className="border-t border-border/60 py-8 bg-white/50">
        <div className="container flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="gradient-primary p-1 rounded text-white">
              <Zap className="h-3 w-3" />
            </div>
            <span className="font-medium text-foreground">Electro Shop</span>
          </div>
          <span>Demo project · All rights reserved</span>
        </div>
      </footer>
    </div>
  );
}
