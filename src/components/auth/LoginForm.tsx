
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { authApi } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Twitter } from "lucide-react";

export function LoginForm({ onLoginSuccess }: { onLoginSuccess: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await authApi.login({ email, password });
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));
      localStorage.setItem("user-id", response.user.id.toString());
      toast({
        title: "Login Successful",
        description: `Welcome back, ${response.user.fullName}!`,
      });
      onLoginSuccess();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "Please check your credentials and try again.",
      });
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 space-y-6">
      <div className="flex justify-center mb-8">
        <Twitter className="h-12 w-12 text-twitter-primary" />
      </div>
      <h1 className="text-2xl font-bold text-center">Sign in to Chirp</h1>
      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="w-full"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="w-full"
          />
        </div>
        <Button 
          type="submit" 
          className="w-full bg-twitter-primary hover:bg-twitter-secondary text-white"
          disabled={isLoading}
        >
          {isLoading ? "Signing in..." : "Sign in"}
        </Button>
      </form>
      <div className="text-center text-sm">
        <a href="#" className="text-twitter-primary hover:underline">
          Forgot password?
        </a>
      </div>
    </div>
  );
}

export default LoginForm;
