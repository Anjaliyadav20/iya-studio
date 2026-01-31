
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Mail, ArrowLeft, KeyRound } from "lucide-react";

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            setSubmitted(true);
            toast.info("If this email exists, a reset link has been sent. (Simulation)");
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4 relative">
            <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/auth")}
                className="absolute top-6 left-6 hover:bg-primary/10"
                title="Back to Login"
            >
                <ArrowLeft className="w-5 h-5" />
            </Button>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md"
            >
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ rotate: -10 }}
                        animate={{ rotate: 0 }}
                        className="inline-block p-4 rounded-full bg-primary/10 mb-4"
                    >
                        <KeyRound className="w-10 h-10 text-primary" />
                    </motion.div>
                    <h1 className="font-display text-3xl font-bold text-foreground mb-2">
                        Forgot Password?
                    </h1>
                    <p className="font-body text-muted-foreground text-sm">
                        Don't worry, we'll help you get back in.
                    </p>
                </div>

                <Card variant="neon" className="bg-card/80 backdrop-blur-sm">
                    <CardContent className="pt-6">
                        {!submitted ? (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Registered Email</Label>
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

                                <Button
                                    type="submit"
                                    variant="neon"
                                    className="w-full"
                                    disabled={loading}
                                >
                                    {loading ? "Sending Link..." : "Send Reset Link"}
                                </Button>
                            </form>
                        ) : (
                            <div className="text-center space-y-4">
                                <div className="bg-green-500/10 text-green-500 p-3 rounded-md border border-green-500/20 text-sm">
                                    If an account exists for <strong>{email}</strong>, you will receive password reset instructions shortly.
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    (Note: Since email service is not configured, please contact the developer to manually reset if you are locked out.)
                                </p>
                                <Button
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => navigate("/auth")}
                                >
                                    Return to Login
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};

export default ForgotPassword;
