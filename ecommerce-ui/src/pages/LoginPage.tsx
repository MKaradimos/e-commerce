import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "@/api/endpoints";
import { useAuthStore } from "@/store/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap } from "lucide-react";

export function LoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [email, setEmail] = useState("customer@shop.com");
  const [password, setPassword] = useState("Password123!");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { user, token } = await authApi.login({ email, password });
      setAuth(user, token);
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.error?.message ?? "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex h-14 w-14 gradient-primary rounded-2xl items-center justify-center shadow-lg mx-auto">
            <Zap className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold">Welcome back</h1>
          <p className="text-muted-foreground">Sign in to your account</p>
        </div>

        <Card className="border-border/60 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium text-muted-foreground text-center">
              Demo: <span className="font-mono text-sm bg-muted px-2 py-0.5 rounded">customer@shop.com</span> / <span className="font-mono text-sm bg-muted px-2 py-0.5 rounded">Password123!</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11"
                />
              </div>

              {error && (
                <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-lg">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                className="w-full gradient-primary border-0 shadow-md hover:shadow-lg hover:opacity-90 transition-all h-11 font-semibold"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign in"}
              </Button>

              <p className="text-sm text-center text-muted-foreground">
                Don't have an account?{" "}
                <Link to="/register" className="text-primary font-semibold hover:underline">
                  Sign up
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
