import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="text-center">
        <h1 className="font-display text-8xl md:text-9xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-4">
          404
        </h1>
        <p className="font-body text-xl text-muted-foreground mb-8">Page not found</p>
        <Link to="/">
          <Button variant="outline" size="lg" className="neon-border-cyan group">
            <Home className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
            Return to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
