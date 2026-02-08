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
import { RefreshCw, Image, Plus, Trash2, Sparkles, Star, Upload, X } from "lucide-react";

const serviceOptions = [
  { value: "neon_tattoo", label: "Neon Tattoos" },
  { value: "glitter_hair_spray", label: "Glitter Hair Spray" },
  { value: "glitter_face_art", label: "Glitter Face Art" },
  { value: "glitter_eye_art", label: "Glitter Eye Art" },
  { value: "bold_stone_designs", label: "Bold Stone Designs" },
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

const GalleryTab = () => {
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
    is_featured: false,
    event_type: "other",
    location: "",
    media_url: "",
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const data = await apiClient.getGallery();
      setItems(data || []);
    } catch (error) {
      console.error("Error fetching gallery:", error);
      toast.error(`Load Failed: ${error.message || "Server Error"}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
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

  const clearFileSelection = () => {
    setSelectedFiles([]);
    setPreviewUrls([]);
    setFormData({ ...formData, media_urls: [] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const title = (formData.title || "").trim();
    if (!title) {
      toast.error("Please enter a title");
      return;
    }
    const media_urls = [...formData.media_urls];
    if (formData.media_url && formData.media_url.trim()) {
      media_urls.push(formData.media_url.trim());
    }

    if (media_urls.length === 0) {
      toast.error("Please select at least one image/video or paste a URL");
      return;
    }
    try {
      setIsSubmitting(true);
      await apiClient.addGalleryItem({
        title,
        description: formData.description || "",
        media_urls,
        media_type: formData.media_type,
        service_type: formData.service_type || undefined,
        is_featured: formData.is_featured,
        event_type: formData.event_type || "other",
        location: formData.location || "",
      });
      toast.success("Gallery item added successfully");
      setDialogOpen(false);
      setFormData({
        title: "",
        description: "",
        media_urls: [],
        media_type: "image",
        service_type: "",
        is_featured: false,
        event_type: "other",
        location: "",
        media_url: "",
      });
      setSelectedFiles([]);
      setPreviewUrls([]);
      fetchGallery();
    } catch (error) {
      console.error("Error adding gallery item:", error);
      toast.error(error.message || "Failed to add gallery item");
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteItem = async (id) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      await apiClient.deleteGalleryItem(id);
      toast.success("Item deleted successfully");
      fetchGallery();
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("Failed to delete item");
    }
  };

  return (
    <Card variant="neon">
      <CardHeader className="border-b border-pink-500/30 bg-gradient-to-r from-pink-500/10 to-transparent">
        <div className="flex flex-col gap-2">
          <div className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-xl">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
                <Image className="w-5 h-5 text-white" />
              </div>
              <span>
                Gallery — <span className="text-pink-500 font-bold">Previous Work (Home Page)</span>
              </span>
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={fetchGallery}
                disabled={loading}
                className="hover:border-pink-500/50 transition-colors"
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
                    className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 transition-all"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Previous Work Item
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-card border-pink-500/30 max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-pink-500" />
                      Add Previous Work Item (Event name, Location, Description)
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title Input */}
                    <div className="space-y-2">
                      <Label htmlFor="title" className="text-base font-semibold">Title *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="e.g., Neon Floral Design"
                        className="bg-background/50 border-pink-500/30 focus:border-pink-500"
                        required
                      />
                    </div>

                    {/* Image or Video Selection */}
                    <div className="space-y-3">
                      <Label className="text-base font-semibold">Select Images or Videos * (Multiple allowed)</Label>

                      {/* Preview Grid */}
                      {previewUrls.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-3">
                          {previewUrls.map((preview, idx) => (
                            <div key={idx} className="relative rounded-lg overflow-hidden border-2 border-pink-500/50 bg-black/20">
                              <div className="aspect-video w-full bg-black/50 flex items-center justify-center">
                                {preview.isVideo ? (
                                  <video src={preview.url} className="w-full h-full object-cover" muted playsInline />
                                ) : (
                                  <img src={preview.url} alt={preview.name} className="w-full h-full object-cover" />
                                )}
                              </div>
                              <button
                                type="button"
                                onClick={() => removeFile(idx)}
                                className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full transition-all hover:scale-110"
                              >
                                <X className="w-4 h-4" />
                              </button>
                              <div className="absolute bottom-1 left-1 bg-black/70 text-white text-xs px-2 py-0.5 rounded font-semibold">
                                {preview.name.substring(0, 15)}{preview.name.length > 15 ? '...' : ''}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Upload Button */}
                      <label className="flex flex-col items-center justify-center w-full p-8 border-2 border-dashed border-pink-500/40 rounded-lg hover:border-pink-500/70 hover:bg-pink-500/8 cursor-pointer transition-all duration-200 group">
                        <div className="flex flex-col items-center justify-center text-center">
                          <div className="w-12 h-12 rounded-lg bg-pink-500/20 flex items-center justify-center mb-3 group-hover:bg-pink-500/30 transition-colors">
                            <Upload className="w-6 h-6 text-pink-500" />
                          </div>
                          <p className="text-sm font-semibold text-foreground mb-1">
                            Click to upload images or videos
                          </p>
                          <p className="text-xs text-muted-foreground">
                            PNG, JPG, GIF, MP4, WebM (Max 10MB)
                          </p>
                        </div>
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
                            <div className="w-full border-t border-pink-500/20" />
                          </div>
                          <div className="relative flex justify-center">
                            <span className="px-3 bg-card text-xs font-semibold text-pink-500 uppercase tracking-wider">Or Paste URL</span>
                          </div>
                        </div>
                        <Input
                          id="media_url"
                          value={formData.media_url}
                          onChange={(e) => setFormData({ ...formData, media_url: e.target.value })}
                          placeholder="https://... (image or video URL, e.g. Instagram link)"
                          className="bg-background/50 border-pink-500/30 focus:border-pink-500"
                        />
                      </div>
                    )}

                    {/* Dropdowns */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold">Media Type</Label>
                        <Select
                          value={formData.media_type}
                          onValueChange={(value) => setFormData({ ...formData, media_type: value })}
                        >
                          <SelectTrigger className="bg-background/50 border-pink-500/30">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="image">Image</SelectItem>
                            <SelectItem value="video">Video</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="service_type" className="text-sm font-semibold">Service Type</Label>
                        <Input
                          id="service_type"
                          value={formData.service_type}
                          onChange={(e) => setFormData({ ...formData, service_type: e.target.value })}
                          placeholder="e.g. Neon Tattoos"
                          className="bg-background/50 border-pink-500/30 focus:border-pink-500"
                        />
                      </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <Label htmlFor="description" className="text-sm font-semibold">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Add details about this gallery item..."
                        className="bg-background/50 border-pink-500/30 focus:border-pink-500 min-h-[80px] resize-none"
                      />
                    </div>

                    {/* Event Type & Location */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="event_type" className="text-sm font-semibold">Event Type</Label>
                        <Input
                          id="event_type"
                          value={formData.event_type}
                          onChange={(e) => setFormData({ ...formData, event_type: e.target.value })}
                          placeholder="e.g. Wedding, Party"
                          className="bg-background/50 border-pink-500/30 focus:border-pink-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location" className="text-sm font-semibold">Location</Label>
                        <Input
                          id="location"
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          placeholder="e.g., Mumbai, Delhi"
                          className="bg-background/50 border-pink-500/30 focus:border-pink-500"
                        />
                      </div>
                    </div>

                    {/* Show on Home (Featured) */}
                    <div className="flex items-center justify-between rounded-lg border border-pink-500/30 p-4">
                      <div className="space-y-0.5">
                        <Label htmlFor="is_featured" className="text-sm font-semibold flex items-center gap-2">
                          <Star className="w-4 h-4 text-pink-500" />
                          Show on Home (Previous Work)
                        </Label>
                        <p className="text-xs text-muted-foreground">Mark as featured to display on main page</p>
                      </div>
                      <Switch
                        id="is_featured"
                        checked={formData.is_featured}
                        onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
                      />
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold py-2.5 transition-all hover:shadow-lg hover:shadow-pink-500/25"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          Adding to Gallery...
                        </span>
                      ) : (
                        "Add to Special Gallery"
                      )}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Add images/videos with <strong className="text-foreground">event name, location & description</strong>. Turn ON &quot;Show on Home&quot; to display them in the <strong className="text-pink-500">Previous Work</strong> section on the main page.
          </p>
        </div>
      </CardHeader >
      <CardContent className="pt-6">
        {loading ? (
          <motion.div
            className="flex items-center justify-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <RefreshCw className="w-8 h-8 text-pink-500" />
            </motion.div>
          </motion.div>
        ) : items.length === 0 ? (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Image className="w-16 h-16 mx-auto mb-4 text-pink-500/30" />
            <p className="text-muted-foreground mb-2">No gallery items yet</p>
            <p className="text-sm text-muted-foreground">Add your first gallery item to showcase your work</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((item, index) => (
              <motion.div
                key={item._id || item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -5 }}
                className="relative group rounded-lg overflow-hidden border border-pink-500/30 shadow-lg hover:shadow-pink-500/20 hover:shadow-2xl transition-all"
              >
                {item.media_type === "video" ? (
                  <video
                    src={item.media_urls?.[0]}
                    className="w-full aspect-square object-cover"
                    controls
                    muted
                  />
                ) : (
                  <img
                    src={item.media_urls?.[0]}
                    alt={item.title}
                    className="w-full aspect-square object-cover"
                  />
                )}
                {item.media_urls && item.media_urls.length > 1 && (
                  <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full font-semibold">
                    +{item.media_urls.length - 1}
                  </div>
                )}
                {item.is_featured && (
                  <div className="absolute top-2 left-2 bg-gradient-to-r from-pink-500 to-rose-500 p-1.5 rounded-full">
                    <Star className="w-3 h-3 text-white fill-white" />
                  </div>
                )}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                >
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p className="font-display text-sm truncate text-white">{item.title}</p>
                  </div>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 bg-red-500/90 hover:bg-red-600"
                    onClick={() => deleteItem(item._id || item.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </motion.div>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card >
  );
};

export default GalleryTab;
