import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { apiClient } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Lock, Mail, ArrowLeft } from "lucide-react";

const Auth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('auth_token');
    if (token) {
      navigate("/admin");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await apiClient.signin(email, password);
        toast.success("Logged in successfully!");
        // Small delay to ensure token is saved
        setTimeout(() => {
          navigate("/admin");
        }, 100);
      } else {
        await apiClient.signup(email, password);
        toast.success("Account created! You are now logged in.");
        setTimeout(() => {
          navigate("/admin");
        }, 100);
      }
    } catch (error) {
      const msg = error.message || "";
      if (msg === "Failed to fetch" || msg.includes("fetch")) {
        toast.error("Server nahi mil raha. Backend start karein: backend folder mein 'npm start' chalao (port 3001).");
      } else {
        toast.error(msg || "An error occurred");
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative">
      {/* Back Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 hover:bg-primary/10"
        title="Go back"
      >
        <ArrowLeft className="w-5 h-5" />
      </Button>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mb-6 flex justify-center"
          >
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center shadow-xl border border-primary/50">
              <div className="text-center">
                <div className="text-background font-display text-3xl font-bold">IYA</div>
              </div>
            </div>
          </motion.div>
          <h1 className="font-display text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-1">
            IYA
          </h1>
          <p className="font-body text-muted-foreground text-sm">Imprint Your Aura — Admin Portal</p>
        </div>

        <Card variant="neon" className="bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-center">
              {isLogin ? "Welcome Back" : "Create Account"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-background/50 border-primary/30"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 bg-background/50 border-primary/30"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <div className="text-right">
                <a
                  href="/forgot-password"
                  className="text-xs text-primary hover:text-primary/80 transition-colors"
                >
                  Forgot Password?
                </a>
              </div>

              <Button
                type="submit"
                variant="neon"
                className="w-full"
                disabled={loading}
              >
                {loading ? "Loading..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center mt-4 text-xs text-muted-foreground">
          Note: This portal is restricted to authorized administrators only.
        </p>
      </motion.div>
    </div>
  );
};

export default Auth;
