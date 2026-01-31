import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Sparkles, Image as ImageIcon, Play } from "lucide-react";
import { apiClient } from "@/services/api";
import { resolveLocalImage } from "@/data/services";

const serviceTypeToLabel = {
  neon_tattoo: "Neon Tattoos",
  glitter_hair_spray: "Glitter Hair Spray",
  glitter_face_art: "Glitter Face Art",
  glitter_eye_art: "Glitter Eye Art",
  bold_stone_designs: "Bold Stone Designs",
  uv_body_paint: "UV Body Paint",
  body_jewels: "Body Jewels",
  temporary_tattoos_premium: "Temporary Tattoos",
  festival_face_gems: "Festival Face Gems",
};

const Gallery = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const data = await apiClient.getGallery();
        const resolved = (data || []).map(item => ({
          ...item,
          media_url: resolveLocalImage(item.media_urls?.[0] || item.media_url)
        }));
        setItems(resolved);
      } catch (err) {
        console.error("Failed to load gallery:", err);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />

      {/* Background Decorative Blurs */}
      <div className="fixed top-0 right-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px] pointer-events-none opacity-40 z-0" />
      <div className="fixed bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[130px] pointer-events-none opacity-30 z-0" />

      <main className="relative z-10 pt-32 pb-24">
        <div className="container mx-auto px-4">

          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-md mb-6">
              <Sparkles className="w-4 h-4 text-primary animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Masterpiece Collection</span>
            </div>
            <h1 className="font-display text-5xl md:text-7xl font-bold mb-6 tracking-tight">
              Artistic <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">Expressions</span>
            </h1>
            <p className="font-body text-muted-foreground text-lg max-w-xl mx-auto opacity-80 leading-relaxed">
              Explore the fusion of neon, crystals, and body art curated by IYA's finest artists.
            </p>
          </motion.div>

          {loading ? (
            <div className="py-40 text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="inline-block"
              >
                <ImageIcon className="w-12 h-12 text-primary/40" />
              </motion.div>
              <p className="mt-4 font-display text-xs uppercase tracking-[0.4em] text-muted-foreground animate-pulse">
                Developing visions...
              </p>
            </div>
          ) : items.length === 0 ? (
            <div className="py-32 text-center max-w-md mx-auto">
              <div className="p-12 rounded-3xl bg-card/40 backdrop-blur-xl border border-white/5 border-dashed">
                <p className="text-muted-foreground italic font-body">The gallery is currently being curated. Come back soon for fresh inspiration.</p>
              </div>
            </div>
          ) : (
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
              <AnimatePresence mode="popLayout">
                {items.map((item, index) => (
                  <GalleryItem
                    key={item._id || item.id || index}
                    item={item}
                    index={index}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

const GalleryItem = ({ item, index }) => {
  const [imageError, setImageError] = useState(false);
  const videoRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      if (isHovered) {
        videoRef.current.play().catch(e => console.log("Video play failed", e));
      } else {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
  }, [isHovered]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: (index % 10) * 0.05, duration: 0.6 }}
      className="break-inside-avoid group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative rounded-3xl overflow-hidden border border-white/5 bg-card/40 transition-all duration-700 hover:border-primary/40 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]">

        {/* Media Container */}
        <div className="relative w-full">
          {item.media_type === "video" ? (
            <video
              ref={videoRef}
              src={item.media_url}
              className="w-full object-cover transition-transform duration-1000 group-hover:scale-110"
              muted
              playsInline
              loop
              onLoadedMetadata={(e) => {
                e.target.currentTime = 0.1;
              }}
              onError={() => setImageError(true)}
            />
          ) : (
            <img
              src={item.media_url}
              alt={item.title}
              className={`w-full object-cover transition-transform duration-1000 group-hover:scale-110 ${imageError ? 'opacity-20' : ''}`}
              onError={() => setImageError(true)}
            />
          )}

          {/* Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Badge for Type */}
          <div className="absolute top-4 left-4 flex gap-2">
            <div className="px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-xl border border-white/10 text-[9px] font-black uppercase tracking-widest text-white flex items-center gap-2">
              {item.media_type === "video" ? <Play className="w-2 h-2 text-primary" /> : <ImageIcon className="w-2 h-2 text-primary" />}
              {item.media_type || "Photo"}
            </div>
          </div>
        </div>

        {/* Info (Visible on Hover) */}
        <div className="absolute bottom-6 left-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
          <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1 italic">
            {serviceTypeToLabel[item.service_type] || "Artistic Flow"}
          </p>
          <h4 className="font-display font-bold text-lg text-white truncate">
            {item.title}
          </h4>
        </div>
      </div>
    </motion.div>
  );
};

export default Gallery;
