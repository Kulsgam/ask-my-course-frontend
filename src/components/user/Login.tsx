import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";
import { useAtom } from "jotai";
import { userInfoAtom } from "@/state";
import { isLoggedIn, logIn } from "@/api/user";

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [, setUserInfo] = useAtom(userInfoAtom);
  const navigate = useNavigate();

  useEffect(() => {
    (async function () {
      if (await isLoggedIn()) {
        navigate("/");
      }
    })();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    if (!formData.email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await logIn(formData.email, formData.password);
      if (!result.success) {
        setError(result.error.message);
        return;
      }

      setUserInfo(result.data);
      navigate("/");
    } catch (err) {
      setError("Invalid email or password. Please try again.");
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-background flex w-full items-center justify-center p-8">
      <div className="w-full max-w-lg space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Enter your credentials to access your account
          </p>
        </div>
        <Card className="w-full py-10">
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isLoading}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="pt-5">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
