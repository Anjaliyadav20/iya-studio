import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Sparkles, Star, LayoutGrid, ShieldCheck, Heart, Compass } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import body from "../assets/slider2_neongirl.jpg";
import slider from "../assets/slider3.jpg";
import blue from "../assets/blue.jpg";
import glam from "../assets/glitter_hair.jpg";

const SLIDER_IMAGES = [
  { src: blue, alt: "Tattoo art" },
  { src: body, alt: "Body art" },
  { src: slider, alt: "Creative design" },
  { src: glam, alt: "Glam look" },
];

const HeroSection = () => {
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setSlideIndex((i) => (i + 1) % SLIDER_IMAGES.length);
    }, 6000);
    return () => clearInterval(t);
  }, []);

  const goPrev = () =>
    setSlideIndex((i) => (i - 1 + SLIDER_IMAGES.length) % SLIDER_IMAGES.length);
  const goNext = () =>
    setSlideIndex((i) => (i + 1) % SLIDER_IMAGES.length);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-24 bg-[#0a0a0a] text-foreground">

      {/* Background Decorative Blurs - Premium Glows */}
      <div className="fixed top-[-10%] right-[-5%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[80px] pointer-events-none opacity-40 z-0 overflow-hidden" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[70px] pointer-events-none opacity-30 z-0 overflow-hidden" />

      {/* Subtle Mesh Grid Backdrop */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none z-0" />

      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-[calc(100vh-12rem)]">

          {/* LEFT CONTENT */}
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-md mb-8"
            >
              <Sparkles className="w-4 h-4 text-primary animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Luxury Body Art Studio</span>
            </motion.div>

            <h1 className="font-display text-8xl md:text-[10rem] font-bold tracking-tighter leading-[0.8] mb-4">
              <span className="block italic opacity-90 text-white">IYA</span>
            </h1>

            <p className="font-display text-4xl md:text-6xl font-bold tracking-tight mb-8">
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">Imprint Your Aura</span>
            </p>

            <p className="font-body text-muted-foreground text-lg md:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0 mb-12 opacity-80">
              Where fluorescence meets fine art. Elevate your event with signature neon tattoos, radiant jewels, and high-fashion glitter curated for the bold.
            </p>

            {/* SYMMETRIC BUTTON LAYOUT - Fixed Alignment & Width */}
            <div className="flex flex-col gap-4 items-center lg:items-start">
              <div className="inline-flex flex-col gap-4 w-full sm:w-auto">
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* BOOKING BUTTON - NOW IN WHITE PREMIUM STYLE */}
                  <Link to="/contact" className="w-full sm:w-auto">
                    <Button
                      size="lg"
                      className="group relative h-16 w-full px-16 bg-white text-black font-black uppercase tracking-widest text-[10px] rounded-2xl overflow-hidden transition-all hover:scale-[1.02] shadow-[0_10px_30px_rgba(255,255,255,0.2)]"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        Initiate Booking <Star className="w-3 h-3 fill-black" />
                      </span>
                      <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-10 transition-opacity" />
                    </Button>
                  </Link>

                  {/* EXPLORE STUDIO - NOW IN OUTLINE GOLD STYLE */}
                  <Link to="/gallery" className="w-full sm:w-auto">
                    <Button
                      size="lg"
                      className="group relative h-16 w-full px-16 border-primary bg-black/40 text-primary font-black uppercase tracking-widest text-[10px] rounded-2xl overflow-hidden transition-all hover:scale-[1.02] shadow-[0_0_20px_rgba(var(--primary-rgb),0.1)] flex items-center gap-2 hover:bg-primary/5"
                    >
                      <Compass className="w-4 h-4 group-hover:rotate-45 transition-transform duration-500" />
                      Explore Studio
                    </Button>
                  </Link>
                </div>

                {/* OUR WORKS BUTTON - SYNCED WITH GOLD STYLE */}
                <Link to="/previous-work" className="w-full">
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-16 w-full px-16 border-primary rounded-2xl bg-black/40 backdrop-blur-xl font-black uppercase tracking-widest text-[10px] hover:bg-primary/5 transition-all hover:border-primary group flex items-center justify-center gap-3 text-primary shadow-[0_0_20px_rgba(var(--primary-rgb),0.1)] active:scale-95"
                  >
                    <LayoutGrid className="w-4 h-4" />
                    Our Works
                  </Button>
                </Link>
              </div>
            </div>

            {/* Micro-Trust Signals - LARGER & POLISHED */}
            <div className="mt-16 pt-8 border-t border-white/5 flex flex-wrap justify-center lg:justify-start gap-10">
              <div className="flex items-center gap-3 group/trust">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 group-hover/trust:bg-primary/20 transition-all">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                </div>
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white/60 group-hover/trust:text-primary transition-colors">Premium Materials</span>
              </div>
              <div className="flex items-center gap-3 group/trust">
                <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center border border-secondary/20 group-hover/trust:bg-secondary/20 transition-all">
                  <Star className="w-5 h-5 text-secondary" />
                </div>
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white/60 group-hover/trust:text-secondary transition-colors">Event Specialists</span>
              </div>
              <div className="flex items-center gap-3 group/trust">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center border border-accent/20 group-hover/trust:bg-accent/20 transition-all">
                  <Heart className="w-5 h-5 text-accent" />
                </div>
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white/60 group-hover/trust:text-accent transition-colors">Skin Safe Art</span>
              </div>
            </div>
          </div>

          {/* RIGHT SLIDER - High End Frame */}
          <div className="relative">
            <div className="relative aspect-[4/5] md:aspect-[5/6] max-h-[700px] w-full mx-auto">
              {/* Decorative border elements */}
              <div className="absolute -inset-1 bg-gradient-to-tr from-primary/20 via-transparent to-secondary/20 rounded-[3rem] blur-xl opacity-50" />

              <div className="relative h-full w-full rounded-[2.5rem] overflow-hidden border border-white/10 bg-[#111] shadow-2xl group">
                <AnimatePresence>
                  <motion.img
                    key={slideIndex}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    src={SLIDER_IMAGES[slideIndex].src}
                    alt={SLIDER_IMAGES[slideIndex].alt}
                    style={{ willChange: "transform, opacity" }}
                    className="absolute inset-0 w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700"
                  />
                </AnimatePresence>

                {/* SLIDER OVERLAY GRADIENT */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60" />

                {/* CONTROLS - Redesigned & Minimalist */}
                <div className="absolute inset-x-0 bottom-8 flex items-center justify-center z-20 pointer-events-none">
                  <div className="flex items-center gap-1 p-1 rounded-2xl bg-black/40 backdrop-blur-3xl border border-white/5 shadow-2xl pointer-events-auto">
                    <button
                      onClick={goPrev}
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white/50 hover:text-primary hover:bg-white/5 transition-all active:scale-90"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    <div className="flex gap-2 px-4">
                      {SLIDER_IMAGES.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setSlideIndex(i)}
                          className={`h-1 rounded-full transition-all duration-500 ${i === slideIndex
                            ? "bg-primary w-6"
                            : "bg-white/10 w-1 hover:bg-white/30"
                            }`}
                        />
                      ))}
                    </div>

                    <button
                      onClick={goNext}
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white/50 hover:text-primary hover:bg-white/5 transition-all active:scale-90"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Floating Label */}
                <div className="absolute top-10 right-10 flex flex-col items-end">
                  <div className="px-4 py-2 rounded-xl bg-black/60 backdrop-blur-xl border border-white/10 text-[9px] font-black uppercase tracking-widest text-primary">
                    Featured Look
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
