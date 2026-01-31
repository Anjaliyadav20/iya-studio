import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Star } from "lucide-react";
import { apiClient } from "@/services/api";
import { resolveLocalImage } from "@/data/services";

const ServicesSection = () => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await apiClient.getServices();
        const active = (data || []).filter((s) => s.is_active !== false);
        const topServices = active.slice(0, 3).map(s => ({
          ...s,
          image: resolveLocalImage(s.image_url)
        }));
        setServices(topServices);
      } catch (err) {
        console.error("Failed to load services for home section:", err);
      }
    };
    fetchServices();
  }, []);

  return (
    <section className="py-32 relative overflow-hidden bg-[#0c0c0c]">
      {/* Background Decorative Element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-md mb-6">
            <Star className="w-3 h-3 text-primary" />
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-primary">Core Services</span>
          </div>

          <h2 className="font-display text-5xl md:text-7xl font-bold mb-8 tracking-tight">
            Master <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">Techniques</span>
          </h2>
          <p className="font-body text-muted-foreground text-lg max-w-2xl mx-auto opacity-70 leading-relaxed">
            Discover our curated list of signature avant-garde body art services.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
          {services.map((service, index) => (
            <motion.div
              key={service._id || index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <Card className="h-full bg-card/40 backdrop-blur-3xl border-white/5 p-4 rounded-[2.5rem] overflow-hidden transition-all duration-700 hover:border-primary/40 hover:shadow-[0_40px_80px_rgba(0,0,0,0.6)] group">
                <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden mb-8">
                  {service.image ? (
                    <img
                      src={service.image}
                      alt={service.name}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-white/5 text-primary/40 italic text-xs">
                      Visual Pending
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black via-black/20 to-transparent pointer-events-none" />

                  <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                    <p className="font-display font-black text-xl text-white tracking-tight">{service.price_range}</p>
                    <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all group-hover:bg-primary group-hover:text-black">
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                <div className="px-4 pb-4">
                  <h3 className="font-display text-2xl font-bold text-white mb-3 group-hover:text-primary transition-colors">
                    {service.name}
                  </h3>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed opacity-60 line-clamp-2">
                    {service.description}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-20"
        >
          <Link to="/services">
            <Button
              size="lg"
              className="h-16 px-16 rounded-2xl border-primary bg-black/40 text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary/5 transition-all shadow-[0_0_20px_rgba(var(--primary-rgb),0.15)]"
            >
              See Full Menu <ArrowRight className="w-4 h-4 ml-3" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesSection;
