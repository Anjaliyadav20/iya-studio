import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { apiClient } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { RefreshCw, LayoutGrid, Plus, Trash2, Sparkles, Star, Upload, X, MapPin } from "lucide-react";

const serviceOptions = [
    { value: "neon_tattoo", label: "Neon Tattoos" },
    { value: "glitter_hair_spray", label: "Glitter Hair Spray" },
    { value: "glitter_face_art", label: "Glitter Face Art" },
    { value: "glitter_eye_art", label: "Glitter Eye Art" },
    { value: "bold_stone_designs", label: "Bold Stone Designs" },
    { value: "uv_body_paint", label: "UV Body Paint" },
    { value: "body_jewels", label: "Body Jewels" },
    { value: "temporary_tattoos_premium", label: "Temporary Tattoos" },
    { value: "festival_face_gems", label: "Festival Face Gems" },
];

const eventTypeOptions = [
    { value: "wedding", label: "Wedding" },
    { value: "festival", label: "Festival" },
    { value: "party", label: "Party" },
    { value: "photoshoot", label: "Photoshoot" },
    { value: "bridal", label: "Bridal" },
    { value: "raves", label: "Raves" },
    { value: "corporate", label: "Corporate" },
    { value: "birthday", label: "Birthday" },
    { value: "other", label: "Other" },
];

const PreviousWorkTab = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        media_urls: [],
        media_type: "image",
        service_type: "",
        is_featured: true,
        event_type: "other",
        location: "",
        event_date: "",
        media_url: "",
    });
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);

    const fetchWork = async () => {
        setLoading(true);
        try {
            const data = await apiClient.getPreviousWork();
            setItems(data || []);
        } catch (error) {
            console.error("Error fetching previous work:", error);
            toast.error(`Load Failed: ${error.message || "Server Error"}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWork();
    }, []);

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        const newFiles = [];
        const newPreviews = [];
        const newUrls = [];
        let fileType = formData.media_type;

        let processed = 0;
        files.forEach((file) => {
            const isVideo = file.type.startsWith("video/");
            if (selectedFiles.length === 0) {
                fileType = isVideo ? "video" : "image";
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                newFiles.push(file);
                newPreviews.push({ url: reader.result, isVideo, name: file.name });
                newUrls.push(reader.result);
                processed++;

                if (processed === files.length) {
                    setSelectedFiles([...selectedFiles, ...newFiles]);
                    setPreviewUrls([...previewUrls, ...newPreviews]);
                    setFormData((prev) => ({
                        ...prev,
                        media_urls: [...prev.media_urls, ...newUrls],
                        media_type: fileType,
                    }));
                }
            };
            reader.readAsDataURL(file);
        });
    };

    const removeFile = (index) => {
        const newFiles = selectedFiles.filter((_, i) => i !== index);
        const newPreviews = previewUrls.filter((_, i) => i !== index);
        const newUrls = formData.media_urls.filter((_, i) => i !== index);

        setSelectedFiles(newFiles);
        setPreviewUrls(newPreviews);
        setFormData({ ...formData, media_urls: newUrls });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const title = (formData.title || "").trim();
        if (!title) {
            toast.error("Please enter a title");
            return;
        }
        const media_urls = [...(formData.media_urls || [])];
        if (formData.media_url && formData.media_url.trim()) {
            media_urls.push(formData.media_url.trim());
        }

        if (media_urls.length === 0) {
            toast.error("Please select files or paste an image URL");
            return;
        }
        try {
            setIsSubmitting(true);
            await apiClient.createPreviousWork({
                title,
                description: formData.description || "",
                media_urls: media_urls,
                media_type: formData.media_type,
                service_type: formData.service_type || undefined,
                is_featured: formData.is_featured,
                event_type: formData.event_type || "other",
                location: formData.location || "",
                event_date: formData.event_date || "",
            });
            toast.success("Work item added successfully");
            setDialogOpen(false);
            setFormData({
                title: "",
                description: "",
                media_urls: [],
                media_type: "image",
                service_type: "",
                is_featured: true,
                event_type: "other",
                location: "",
                event_date: "",
                media_url: "",
            });
            setSelectedFiles([]);
            setPreviewUrls([]);
            fetchWork();
        } catch (error) {
            console.error("Error adding work item:", error);
            toast.error(error.message || "Failed to add work item");
        } finally {
            setIsSubmitting(false);
        }
    };

    const deleteItem = async (id) => {
        if (!confirm("Are you sure you want to delete this work item?")) return;
        try {
            await apiClient.deletePreviousWork(id);
            toast.success("Item deleted successfully");
            fetchWork();
        } catch (error) {
            console.error("Error deleting item:", error);
            toast.error("Failed to delete item");
        }
    };

    return (
        <Card variant="neon">
            <CardHeader className="border-b border-orange-500/30 bg-gradient-to-r from-orange-500/10 to-transparent">
                <div className="flex flex-col gap-2">
                    <div className="flex flex-row items-center justify-between">
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
                                <LayoutGrid className="w-5 h-5 text-white" />
                            </div>
                            <span>
                                Previous Work — <span className="text-orange-500 font-bold">Main Gallery</span>
                            </span>
                        </CardTitle>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={fetchWork}
                                disabled={loading}
                                className="hover:border-orange-500/50 transition-colors"
                            >
                                <motion.div
                                    animate={loading ? { rotate: 360 } : {}}
                                    transition={{ duration: 2, repeat: loading ? Infinity : 0 }}
                                >
                                    <RefreshCw className="w-4 h-4" />
                                </motion.div>
                            </Button>
                            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button
                                        size="sm"
                                        className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 transition-all text-white font-semibold"
                                    >
                                        <Plus className="w-4 h-4 mr-1" />
                                        Add Work Item
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="bg-card border-orange-500/30 max-w-2xl max-h-[90vh] overflow-y-auto">
                                    <DialogHeader>
                                        <DialogTitle className="flex items-center gap-2">
                                            <Sparkles className="w-5 h-5 text-orange-500" />
                                            Add New Previous Work Showcase
                                        </DialogTitle>
                                    </DialogHeader>
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="title" className="text-base font-semibold">Title *</Label>
                                            <Input
                                                id="title"
                                                value={formData.title}
                                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                placeholder="e.g., Grand Wedding Neon Art"
                                                className="bg-background/50 border-orange-500/30 focus:border-orange-500"
                                                required
                                            />
                                        </div>

                                        <div className="space-y-3">
                                            <Label className="text-base font-semibold">Media Files * (Multiple images/videos allowed)</Label>
                                            {previewUrls.length > 0 && (
                                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-3">
                                                    {previewUrls.map((preview, idx) => (
                                                        <div key={idx} className="relative rounded-lg overflow-hidden border-2 border-orange-500/50 bg-black/20">
                                                            <div className="aspect-video w-full flex items-center justify-center">
                                                                {preview.isVideo ? (
                                                                    <video src={preview.url} className="w-full h-full object-cover" muted playsInline />
                                                                ) : (
                                                                    <img src={preview.url} alt={preview.name} className="w-full h-full object-cover" />
                                                                )}
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() => removeFile(idx)}
                                                                className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full transition-all"
                                                            >
                                                                <X className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            <label className="flex flex-col items-center justify-center w-full p-8 border-2 border-dashed border-orange-500/40 rounded-lg hover:border-orange-500/70 hover:bg-orange-500/8 cursor-pointer transition-all group">
                                                <Upload className="w-8 h-8 text-orange-500 mb-2 group-hover:scale-110 transition-transform" />
                                                <p className="text-sm font-semibold text-foreground">Click to upload images/videos</p>
                                                <p className="text-xs text-muted-foreground mt-1">PNG, JPG, MP4, etc. (Max 10MB)</p>
                                                <input
                                                    type="file"
                                                    accept="image/*,video/*"
                                                    onChange={handleFileSelect}
                                                    multiple
                                                    className="hidden"
                                                />
                                            </label>
                                        </div>

                                        {/* URL Alternative */}
                                        {previewUrls.length === 0 && (
                                            <div className="space-y-3">
                                                <div className="relative">
                                                    <div className="absolute inset-0 flex items-center">
                                                        <div className="w-full border-t border-orange-500/20" />
                                                    </div>
                                                    <div className="relative flex justify-center">
                                                        <span className="px-3 bg-card text-xs font-semibold text-orange-500 uppercase tracking-wider">Or Paste Image/Video URL</span>
                                                    </div>
                                                </div>
                                                <Input
                                                    id="media_url"
                                                    value={formData.media_url}
                                                    onChange={(e) => setFormData({ ...formData, media_url: e.target.value })}
                                                    placeholder="https://... (e.g. Instagram or Google Image link)"
                                                    className="bg-background/50 border-orange-500/30 focus:border-orange-500"
                                                />
                                            </div>
                                        )}

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label className="text-sm font-semibold">Media Type</Label>
                                                <Select
                                                    value={formData.media_type}
                                                    onValueChange={(value) => setFormData({ ...formData, media_type: value })}
                                                >
                                                    <SelectTrigger className="bg-background/50 border-orange-500/30">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="image">Image Cluster</SelectItem>
                                                        <SelectItem value="video">Video Showcase</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="service_type" className="text-sm font-semibold">Primary Service</Label>
                                                <Input
                                                    id="service_type"
                                                    value={formData.service_type}
                                                    onChange={(e) => setFormData({ ...formData, service_type: e.target.value })}
                                                    placeholder="e.g. Neon Tattoos"
                                                    className="bg-background/50 border-orange-500/30 focus:border-orange-500"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-sm font-semibold">Description</Label>
                                            <Textarea
                                                value={formData.description}
                                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                placeholder="Share the story behind this work..."
                                                className="bg-background/50 border-orange-500/30 min-h-[80px]"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="event_type" className="text-sm font-semibold">Event Type</Label>
                                                <Input
                                                    id="event_type"
                                                    value={formData.event_type}
                                                    onChange={(e) => setFormData({ ...formData, event_type: e.target.value })}
                                                    placeholder="e.g. Wedding, Party"
                                                    className="bg-background/50 border-orange-500/30 focus:border-orange-500"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-sm font-semibold">Location</Label>
                                                <div className="relative">
                                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-500" />
                                                    <Input
                                                        value={formData.location}
                                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                                        placeholder="e.g., Indore, MP"
                                                        className="bg-background/50 border-orange-500/30 pl-10"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="event_date" className="text-sm font-semibold">Event Date</Label>
                                                <Input
                                                    id="event_date"
                                                    type="date"
                                                    value={formData.event_date}
                                                    onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                                                    className="bg-background/50 border-orange-500/30 focus:border-orange-500"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between p-4 border border-orange-500/20 rounded-xl bg-orange-500/5">
                                            <div className="space-y-0.5">
                                                <Label className="text-sm font-semibold flex items-center gap-2">
                                                    <Star className="w-4 h-4 text-orange-500 fill-orange-500/20" />
                                                    Featured on Home
                                                </Label>
                                                <p className="text-xs text-muted-foreground">Display in the Previous Work section on main page</p>
                                            </div>
                                            <Switch
                                                checked={formData.is_featured}
                                                onCheckedChange={(v) => setFormData({ ...formData, is_featured: v })}
                                            />
                                        </div>

                                        <Button
                                            type="submit"
                                            className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold h-12 rounded-xl"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? (
                                                <span className="flex flex-col items-center gap-1">
                                                    <span className="flex items-center gap-2">
                                                        <RefreshCw className="w-5 h-5 animate-spin" />
                                                        🚀 Uploading Masterpiece...
                                                    </span>
                                                    <span className="text-[10px] opacity-70 font-normal">This may take a minute for large photos</span>
                                                </span>
                                            ) : (
                                                "🚀 Add to Recent Projects"
                                            )}
                                        </Button>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Manage your masterpiece gallery. These items appear in the <span className="font-bold text-orange-500">Previous Work</span> section and the full gallery page.
                    </p>
                </div>
            </CardHeader>
            <CardContent className="pt-6">
                {loading ? (
                    <div className="flex justify-center py-20">
                        <RefreshCw className="w-10 h-10 text-orange-500 animate-spin" />
                    </div>
                ) : items.length === 0 ? (
                    <div className="text-center py-20 bg-orange-500/5 rounded-3xl border border-dashed border-orange-500/20">
                        <LayoutGrid className="w-16 h-16 mx-auto mb-4 text-orange-500/20" />
                        <p className="text-muted-foreground">No work items found in this collection.</p>
                        <p className="text-sm text-muted-foreground mt-2">Start by adding your first project showcase.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {items.map((it, idx) => (
                            <motion.div
                                key={it._id || it.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.05 }}
                                className="group relative aspect-square rounded-2xl overflow-hidden border border-orange-500/30 shadow-lg hover:shadow-orange-500/30 transition-all cursor-default"
                            >
                                {it.media_type === "video" ? (
                                    <video src={it.media_urls?.[0]} className="w-full h-full object-cover" muted playsInline />
                                ) : (
                                    <img src={it.media_urls?.[0]} alt={it.title} className="w-full h-full object-cover" />
                                )}

                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                                    <h4 className="text-white font-display text-sm truncate font-bold">{it.title}</h4>
                                    <p className="text-white/60 text-[10px] uppercase tracking-tighter">{it.location || 'Showcase'}</p>
                                </div>

                                {it.is_featured && (
                                    <div className="absolute top-3 left-3 bg-gradient-to-r from-orange-500 to-amber-500 p-1.5 rounded-full shadow-lg">
                                        <Star className="w-3 h-3 text-white fill-white" />
                                    </div>
                                )}

                                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button
                                        variant="destructive"
                                        size="icon"
                                        className="h-8 w-8 rounded-full bg-red-500/90 shadow-xl"
                                        onClick={() => deleteItem(it._id || it.id)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>

                                {it.media_urls && it.media_urls.length > 1 && (
                                    <div className="absolute top-3 right-12 bg-black/50 backdrop-blur-md px-2 py-1 rounded text-white text-[10px] font-bold">
                                        +{it.media_urls.length - 1}
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default PreviousWorkTab;
