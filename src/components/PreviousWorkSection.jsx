import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { apiClient } from "@/services/api";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, FileText, Play, ArrowRight, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { resolveLocalImage } from "@/data/services";
import { format } from "date-fns";

const eventTypeLabels = {
  wedding: "Wedding",
  festival: "Festival",
  party: "Party",
  photoshoot: "Photoshoot",
  bridal: "Bridal",
  raves: "Raves",
  corporate: "Corporate",
  birthday: "Birthday",
  other: "Other",
};

const PreviousWorkSection = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const data = await apiClient.getPreviousWork();
      const resolved = (data || []).map(item => ({
        ...item,
        thumbnail: resolveLocalImage(item.media_urls?.[0] || item.media_url)
      }));
      // Prefer explicitly featured items; fallback to recent items
      const featured = resolved.filter((i) => i.is_featured);
      setItems(featured.length > 0 ? featured : resolved.slice(0, 6));
    } catch (err) {
      console.error("Failed to load previous work:", err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  return (
    <section className="py-24 relative overflow-hidden bg-background/50">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-secondary/5 rounded-full blur-[80px] -z-10" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl md:text-5xl mb-4 text-foreground">
            Previous <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">Work</span>
          </h2>
          <div className="section-heading-line mx-auto mb-4" />
          <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
            Take a look at the magic we've created for our clients. From festivals to private events, we bring the glow everywhere.
          </p>
        </motion.div>

        {loading ? (
          <div className="py-20 text-center">
            <div className="inline-block w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
            <p className="text-muted-foreground">Loading gallery...</p>
          </div>
        ) : items.length === 0 ? (
          <Card variant="neon" className="p-16 text-center bg-card/40 backdrop-blur-md">
            <Sparkles className="w-12 h-12 text-primary/40 mx-auto mb-4" />
            <p className="text-muted-foreground mb-4 text-lg">No gallery items to show yet.</p>
            <Link to="/admin">
              <Button variant="outline" className="neon-border-cyan">Go to Admin to add items</Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((it, idx) => (
              <motion.div
                key={it._id || it.id || idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group"
              >
                <div
                  className="relative aspect-square rounded-3xl overflow-hidden border border-white/10 shadow-2xl cursor-pointer bg-card/60 backdrop-blur-sm transition-all duration-500 hover:scale-[1.02] hover:shadow-primary/20"
                  onClick={() => {
                    setSelected(it);
                    setCurrentImageIndex(0);
                  }}
                >
                  {/* Media */}
                  {it.media_type === "video" ? (
                    <div className="w-full h-full relative">
                      <video
                        src={it.thumbnail}
                        className="w-full h-full object-cover"
                        muted
                        playsInline
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                        <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                          <Play className="w-8 h-8 text-white fill-white ml-1" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <img
                      src={it.thumbnail}
                      alt={it.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  )}

                  {/* Overlay Info */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 p-8 flex flex-col justify-end">
                    <span className="text-primary text-xs uppercase tracking-widest font-bold mb-2">
                      {it.event_type && it.event_type !== "other" ? (eventTypeLabels[it.event_type] || it.event_type) : "Showcase"}
                    </span>
                    <h4 className="font-display text-2xl text-white font-bold mb-2">{it.title}</h4>
                    <p className="text-white/70 text-sm line-clamp-2 mb-4">{it.description}</p>
                    <div className="flex items-center gap-4 text-white/50 text-xs">
                      {it.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {it.location}</span>}
                      {it.event_date && <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {format(new Date(it.event_date), "MMMM d, yyyy")}</span>}
                    </div>
                  </div>

                  {/* Static bottom bar for visibility */}
                  <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                  <div className="absolute bottom-6 left-6 group-hover:opacity-0 transition-opacity">
                    <h4 className="font-display text-xl text-white font-bold drop-shadow-md">{it.title}</h4>
                    <div className="flex flex-col gap-1 mt-1">
                      {it.location && <p className="text-white/80 text-[10px] flex items-center gap-1"><MapPin className="w-2.5 h-2.5" /> {it.location}</p>}
                      {it.event_date && <p className="text-white/80 text-[10px] flex items-center gap-1"><Calendar className="w-2.5 h-2.5" /> {format(new Date(it.event_date), "MMM d, yyyy")}</p>}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <Link to="/previous-work">
            <Button
              size="lg"
              className="group relative h-16 rounded-2xl px-16 bg-white text-black font-black uppercase tracking-widest text-[10px] sm:text-[11px] overflow-hidden transition-all hover:scale-[1.05] shadow-[0_15px_30px_rgba(255,255,255,0.2)]"
            >
              <span className="relative z-10 flex items-center gap-3">
                View Entire Gallery
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>
          </Link>
        </motion.div>

        {/* Modal for Details */}
        <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
          <DialogContent className="max-w-5xl bg-card/95 backdrop-blur-xl border-primary/20">
            <DialogHeader>
              <DialogTitle className="font-display text-3xl">{selected?.title}</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mt-4">
              {/* Media Carousel */}
              <div className="relative aspect-square lg:aspect-auto lg:h-[600px] rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                {selected?.media_type === 'video' ? (
                  <video
                    src={selected.media_urls?.[currentImageIndex] || selected.media_url}
                    controls
                    autoPlay
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={selected?.media_urls?.[currentImageIndex] || selected?.media_url}
                    alt={selected?.title}
                    className="w-full h-full object-cover"
                  />
                )}

                {/* Carousel Controls */}
                {selected?.media_urls && selected.media_urls.length > 1 && (
                  <div className="absolute inset-x-4 bottom-6 flex items-center justify-between z-20">
                    <button
                      onClick={() => setCurrentImageIndex(prev => prev === 0 ? selected.media_urls.length - 1 : prev - 1)}
                      className="p-3 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-white hover:bg-primary transition-colors"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <div className="px-4 py-2 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-white text-sm font-bold">
                      {currentImageIndex + 1} / {selected.media_urls.length}
                    </div>
                    <button
                      onClick={() => setCurrentImageIndex(prev => prev === selected.media_urls.length - 1 ? 0 : prev + 1)}
                      className="p-3 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-white hover:bg-primary transition-colors"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex flex-col h-full py-2">
                <div className="flex flex-wrap gap-3 mb-6">
                  <span className="px-4 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest">
                    {selected?.event_type && eventTypeLabels[selected.event_type]}
                  </span>
                  {selected?.location && (
                    <span className="px-4 py-1 rounded-full bg-white/5 border border-white/10 text-muted-foreground text-xs font-bold uppercase tracking-widest flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {selected.location}
                    </span>
                  )}
                </div>

                <div className="space-y-6 flex-grow">
                  <div>
                    <h4 className="text-white/60 font-body text-sm uppercase tracking-wider mb-2">About this project</h4>
                    <p className="text-lg text-muted-foreground leading-relaxed font-body">
                      {selected?.description || "A beautiful showcase of Aura Ink Studio's artistry. Each design is custom-crafted to match the client's energy and the event's vibe."}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <Calendar className="w-5 h-5 text-primary mb-2" />
                      <p className="text-xs text-white/50 mb-1 leading-none uppercase tracking-tighter">Event Date</p>
                      <p className="text-white font-bold">{selected?.event_date ? format(new Date(selected.event_date), "MMMM d, yyyy") : "N/A"}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <MapPin className="w-5 h-5 text-secondary mb-2" />
                      <p className="text-xs text-white/50 mb-1 leading-none uppercase tracking-tighter">Location</p>
                      <p className="text-white font-bold">{selected?.location || "India"}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-12 flex gap-4">
                  <Button variant="outline" size="lg" className="flex-1 rounded-xl" onClick={() => setSelected(null)}>Close View</Button>
                  <Link to="/contact" className="flex-1">
                    <Button size="lg" className="w-full rounded-xl bg-gradient-to-r from-primary to-accent text-black font-bold">Book Similar Work</Button>
                  </Link>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section >
  );
};

export default PreviousWorkSection;
