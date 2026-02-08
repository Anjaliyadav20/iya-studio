import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { apiClient } from "@/services/api";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Play, ChevronLeft, ChevronRight, Sparkles, X, Info } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
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

const PreviousWork = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [hoveredId, setHoveredId] = useState(null);

    const fetchWork = async () => {
        setLoading(true);
        try {
            const data = await apiClient.getPreviousWork();
            const resolved = (data || []).map(item => ({
                ...item,
                media_urls: (item.media_urls || []).map(url => resolveLocalImage(url)),
                thumbnail: resolveLocalImage(item.media_urls?.[0] || item.media_url)
            }));
            console.log("Archive items loaded:", resolved.length, resolved);
            setItems(resolved);
        } catch (err) {
            console.error("Failed to load previous work:", err);
            setItems([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWork();
    }, []);

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="pt-32 pb-20">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-12 text-center"
                    >
                        <h1 className="font-display text-4xl md:text-6xl mb-4 text-foreground">
                            Masterpiece <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent underline decoration-primary/30 underline-offset-8">Archive</span>
                        </h1>
                        <p className="text-muted-foreground max-w-2xl mx-auto font-body text-base mt-2">
                            Explore our journey of transformations and events.
                        </p>
                    </motion.div>

                    {loading ? (
                        <div className="py-32 text-center">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                className="inline-block"
                            >
                                <Sparkles className="w-8 h-8 text-primary" />
                            </motion.div>
                            <p className="mt-4 text-muted-foreground font-display tracking-widest uppercase text-[10px]">Filtering Magic...</p>
                        </div>
                    ) : items.length === 0 ? (
                        <Card variant="neon" className="p-16 text-center bg-card/40 backdrop-blur-xl border-white/5 max-w-2xl mx-auto">
                            <p className="text-muted-foreground">No masterpieces found in the archive yet.</p>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {items.map((it, idx) => (
                                <motion.div
                                    key={it._id || it.id || idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="group"
                                >
                                    <div
                                        className="h-full bg-card/20 backdrop-blur-sm border border-white/5 rounded-2xl overflow-hidden hover:border-primary/40 hover:shadow-[0_0_30px_rgba(var(--primary-rgb),0.1)] transition-all duration-500 cursor-pointer flex flex-col"
                                        onMouseEnter={() => setHoveredId(it._id || it.id || idx)}
                                        onMouseLeave={() => setHoveredId(null)}
                                        onClick={() => {
                                            setSelected(it);
                                            setCurrentImageIndex(0);
                                        }}
                                    >
                                        <div className="relative aspect-[4/5] overflow-hidden bg-black/40">
                                            {it.media_type === "video" ? (
                                                <video
                                                    src={it.thumbnail}
                                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                                    muted
                                                    loop
                                                    playsInline
                                                    autoPlay={hoveredId === (it._id || it.id || idx)}
                                                    loading="lazy"
                                                />
                                            ) : (
                                                <img
                                                    src={it.thumbnail}
                                                    alt={it.title}
                                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                                    loading="lazy"
                                                    decoding="async"
                                                />
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                                            {it.media_type === "video" && (
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                        <Play className="w-5 h-5 text-white ml-1 fill-white" />
                                                    </div>
                                                </div>
                                            )}

                                            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                                                <div className="flex gap-1.5">
                                                    {it.event_type && it.event_type !== "other" && (
                                                        <span className="px-2 py-0.5 rounded-md bg-primary/90 text-white text-[8px] uppercase tracking-tighter font-black">
                                                            {eventTypeLabels[it.event_type]}
                                                        </span>
                                                    )}
                                                </div>
                                                {it.location && (
                                                    <span className="flex items-center gap-1 text-white/80 text-[9px] font-bold tracking-tighter shadow-sm">
                                                        <MapPin className="w-2.5 h-2.5 text-primary" />
                                                        {it.location}
                                                    </span>
                                                )}
                                                {it.event_date && (
                                                    <span className="flex items-center gap-1 text-white/80 text-[9px] font-bold tracking-tighter shadow-sm">
                                                        <Calendar className="w-2.5 h-2.5 text-primary" />
                                                        {format(new Date(it.event_date), "MMM yyyy")}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="p-5 flex flex-col flex-grow">
                                            <h3 className="font-display text-lg text-foreground mb-2 leading-tight group-hover:text-primary transition-colors line-clamp-1">
                                                {it.title}
                                            </h3>
                                            <p className="font-body text-xs text-muted-foreground leading-relaxed line-clamp-2 opacity-70">
                                                {it.description || "N/A"}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}

                    <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
                        <DialogContent className="max-w-6xl w-full h-[100dvh] md:w-[95vw] md:h-auto md:max-h-[85vh] p-0 overflow-y-auto bg-background md:bg-background/95 md:backdrop-blur-2xl border-none md:border-white/10 rounded-none md:rounded-3xl gap-0 shadow-2xl z-[60]">
                            <div className="flex flex-col lg:flex-row w-full h-full lg:h-[80vh]">

                                {/* Left Side: Media Hero (60%) */}
                                <div className="relative w-full lg:w-3/5 h-auto min-h-[40vh] lg:h-full bg-black flex items-center justify-center group/panel">
                                    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                                        <AnimatePresence mode="wait">
                                            <motion.div
                                                key={`${selected?.id}-${currentImageIndex}`}
                                                initial={{ opacity: 0, scale: 1.1 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                transition={{ duration: 0.5 }}
                                                className="w-full h-full"
                                            >
                                                {selected?.media_urls?.[currentImageIndex]?.toLowerCase().includes('.mp4') || selected?.media_type === 'video' ? (
                                                    <video
                                                        src={selected.media_urls?.[currentImageIndex] || selected.media_url}
                                                        controls
                                                        autoPlay
                                                        className="w-full h-full object-contain"
                                                    />
                                                ) : (
                                                    <img
                                                        src={selected?.media_urls?.[currentImageIndex] || selected?.media_url}
                                                        alt={selected?.title}
                                                        className="w-full h-full object-contain"
                                                    />
                                                )}
                                            </motion.div>
                                        </AnimatePresence>
                                    </div>

                                    {/* Carousel Nav */}
                                    {selected?.media_urls && selected.media_urls.length > 1 && (
                                        <>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(i => (i === 0 ? selected.media_urls.length - 1 : i - 1)); }}
                                                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/5 hover:bg-primary/80 backdrop-blur-md text-white p-2 rounded-full transition-all border border-white/10 opacity-0 group-hover/panel:opacity-100"
                                            >
                                                <ChevronLeft className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(i => (i === selected.media_urls.length - 1 ? 0 : i + 1)); }}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/5 hover:bg-primary/80 backdrop-blur-md text-white p-2 rounded-full transition-all border border-white/10 opacity-0 group-hover/panel:opacity-100"
                                            >
                                                <ChevronRight className="w-5 h-5" />
                                            </button>
                                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/60 backdrop-blur-xl border border-white/10 rounded-full text-[10px] font-bold text-white/70">
                                                {currentImageIndex + 1} / {selected.media_urls.length}
                                            </div>
                                        </>
                                    )}

                                    {/* Mobile Close Button - Repositioned to be visible */}
                                    <button
                                        onClick={() => setSelected(null)}
                                        className="lg:hidden absolute top-6 right-6 z-50 bg-black/60 backdrop-blur-md p-2 rounded-full text-white border border-white/10"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Right Side: Content Panel (40%) */}
                                <div className="w-full lg:w-2/5 p-6 md:p-12 flex flex-col bg-card/30 relative">
                                    {/* Desktop Close Button */}
                                    <button
                                        onClick={() => setSelected(null)}
                                        className="hidden lg:flex absolute top-6 right-6 hover:rotate-90 transition-transform duration-300 p-2 text-muted-foreground hover:text-primary"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>

                                    <div className="mb-8 space-y-3">
                                        <div className="flex flex-wrap gap-2">
                                            {selected?.event_type && (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest">
                                                    <Sparkles className="w-3 h-3" />
                                                    {eventTypeLabels[selected.event_type]}
                                                </span>
                                            )}
                                            {selected?.location && (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-muted-foreground text-[10px] font-bold uppercase tracking-widest">
                                                    <MapPin className="w-3 h-3 text-primary" />
                                                    {selected.location}
                                                </span>
                                            )}
                                        </div>
                                        <h2 className="font-display text-2xl md:text-4xl text-foreground leading-[1.1] tracking-tight">
                                            {selected?.title}
                                        </h2>
                                    </div>

                                    <div className="space-y-4 md:space-y-6 flex-grow">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-xs font-black text-primary uppercase tracking-[0.2em]">
                                                <Info className="w-3 h-3" />
                                                Project Details
                                            </div>
                                            <p className="font-body text-muted-foreground leading-relaxed text-sm md:text-base">
                                                {selected?.description || "No description provided for this masterpiece."}
                                            </p>
                                        </div>

                                        <div className="flex flex-col gap-4 pt-2 md:pt-4">
                                            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                                                <div className="flex items-center gap-3">
                                                    <Calendar className="w-5 h-5 text-primary" />
                                                    <div>
                                                        <p className="text-[10px] uppercase text-muted-foreground font-black tracking-widest">Event Date</p>
                                                        <p className="text-xs font-bold text-foreground">{selected?.event_date ? format(new Date(selected.event_date), "MMMM d, yyyy") : "N/A"}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-8 md:mt-12">
                                        <Button
                                            className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-12 rounded-2xl shadow-lg shadow-primary/20 transition-all uppercase tracking-widest text-[10px]"
                                            onClick={() => setSelected(null)}
                                        >
                                            Return to archive
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default PreviousWork;
