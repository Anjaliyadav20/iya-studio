import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="gradient-border rounded-2xl p-8 md:p-12 text-center max-w-4xl mx-auto"
        >
          <h2 className="font-display text-3xl md:text-5xl mb-4 text-foreground">
            Ready to <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">Glow</span>?
          </h2>
          <p className="font-body text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Book your session today. Perfect for weddings, parties, festivals and special events.
          </p>
          <Link to="/contact">
            <Button
              size="xl"
              className="h-16 px-16 rounded-2xl bg-primary text-black font-black uppercase tracking-widest text-[11px] hover:scale-[1.03] transition-all shadow-[0_15px_40px_rgba(var(--primary-rgb),0.3)] group"
            >
              Book Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
