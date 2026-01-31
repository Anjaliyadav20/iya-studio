import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Zap, ShieldCheck, Clock } from "lucide-react";
import { apiClient } from "@/services/api";
import { resolveLocalImage } from "@/data/services";

const placeholderImage = "https://images.unsplash.com/photo-1590439471364-192aa70c0b53?q=80&w=800&auto=format&fit=crop";

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await apiClient.getServices();
        const active = (data || []).filter((s) => s.is_active !== false);

        // Resolve images
        const resolved = active.map(s => ({
          ...s,
          image_url: resolveLocalImage(s.image_url)
        }));

        setServices(resolved);
      } catch (err) {
        console.error("Failed to load services:", err);
        setServices([]);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />

      {/* Background Decorative Blur */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[120px] pointer-events-none opacity-40 z-0" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-secondary/10 rounded-full blur-[100px] pointer-events-none opacity-30 z-0" />

      <main className="relative z-10 pt-24 pb-16 overflow-x-hidden">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-md mb-6">
              <Sparkles className="w-4 h-4 text-primary animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">IYA Masterpieces</span>
            </div>

            <h1 className="font-display text-5xl md:text-7xl mb-6 font-bold tracking-tight">
              Our <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">Creative Universe</span>
            </h1>

            <p className="font-body text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed opacity-80">
              Discover premium body art transformations. From neon glows to crystal elegancy, we bring your vision to life.
            </p>
          </motion.div>

          {loading ? (
            <div className="py-32 text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="inline-block"
              >
                <Zap className="w-10 h-10 text-primary" />
              </motion.div>
              <p className="mt-4 text-muted-foreground font-display tracking-widest uppercase text-xs">Curating magic...</p>
            </div>
          ) : services.length === 0 ? (
            <div className="py-20 text-center max-w-md mx-auto">
              <div className="p-12 rounded-3xl bg-card/40 backdrop-blur-xl border border-white/5 border-dashed">
                <p className="text-muted-foreground">No services found. Check back soon!</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <motion.div
                  key={service._id || service.id || index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className="group"
                >
                  <Card variant="neon" className="h-full flex flex-col overflow-hidden bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl border-white/5 hover:border-primary/40 hover:shadow-[0_20px_50px_rgba(var(--primary-rgb),0.15)] transition-all duration-500 rounded-[2rem]">

                    {/* Image Header */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-black/40">
                      <img
                        src={service.image_url || placeholderImage}
                        alt={service.name}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                        onError={(e) => { e.target.src = placeholderImage; }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-black/20" />

                      {/* Price Badge */}
                      <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-2xl">
                        <p className="font-display font-bold text-sm text-primary">{service.price_range || "Contact"}</p>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="font-display text-xl md:text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {service.name}
                      </h3>

                      <p className="font-body text-sm text-muted-foreground leading-relaxed mb-4 flex-grow opacity-70">
                        {service.description || "Premium studio service curated with artistic excellence."}
                      </p>

                      {/* Compact Features */}
                      {Array.isArray(service.features) && service.features.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {service.features.slice(0, 3).map((f) => (
                            <span
                              key={f}
                              className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-white/5 border border-white/10 text-muted-foreground"
                            >
                              {f}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Call to Action */}
                      <div className="pt-4 border-t border-white/5">
                        <Link to="/contact">
                          <Button className="w-full h-11 bg-primary hover:bg-primary/90 text-white font-black rounded-xl transition-all shadow-lg shadow-primary/20 uppercase tracking-widest text-[10px] group-hover:scale-[1.02]">
                            Book Session
                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          {/* Bottom Trust Icons */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 py-12 border-t border-white/5"
          >
            <div className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:bg-primary transition-colors">
                <ShieldCheck className="w-6 h-6 text-primary group-hover:text-white" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-foreground italic">Skin Safe Products</h4>
                <p className="text-xs text-muted-foreground">Certified & Dermatologically Tested</p>
              </div>
            </div>
            <div className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center border border-secondary/20 group-hover:bg-secondary transition-colors">
                <Clock className="w-6 h-6 text-secondary group-hover:text-white" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-foreground italic">Fast Application</h4>
                <p className="text-xs text-muted-foreground">Perfect for Fast-Paced Events</p>
              </div>
            </div>
            <div className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center border border-accent/20 group-hover:bg-accent transition-colors">
                <Zap className="w-6 h-6 text-accent group-hover:text-white" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-foreground italic">Glow Experts</h4>
                <p className="text-xs text-muted-foreground">Masters of Neon & Crystal Art</p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Services;
