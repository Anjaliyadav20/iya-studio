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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { RefreshCw, Settings, Edit, CheckCircle2, Circle, Plus, Upload, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const serviceTypeOptions = [
  { value: "neon_tattoo", label: "Neon Tattoos" },
  { value: "glitter_hair_spray", label: "Glitter Hair Spray" },
  { value: "glitter_face_art", label: "Glitter Face Art" },
  { value: "glitter_eye_art", label: "Glitter Eye Art" },
  { value: "bold_stone_designs", label: "Bold Stone Designs" },
  { value: "uv_body_paint", label: "UV Body Paint" },
  { value: "body_jewels", label: "Body Jewels" },
  { value: "temporary_tattoos_premium", label: "Temporary Tattoos Premium" },
  { value: "festival_face_gems", label: "Festival Face Gems" },
];

const serviceLabels = Object.fromEntries(serviceTypeOptions.map((o) => [o.value, o.label]));

const parseFeatures = (s) => {
  if (!s || typeof s !== "string") return [];
  return s
    .split(/[\n,]+/)
    .map((f) => f.trim())
    .filter(Boolean);
};
const formatFeatures = (arr) => (Array.isArray(arr) && arr.length ? arr.join("\n") : "");

const ServicesTab = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newService, setNewService] = useState({
    name: "",
    description: "",
    service_type: "neon_tattoo",
    price_range: "",
    image_url: "",
    features: "",
    is_active: true,
  });

  const fetchServices = async () => {
    setLoading(true);
    try {
      const data = await apiClient.getServices();
      setServices(data || []);
    } catch (error) {
      console.error("Error fetching services:", error);
      toast.error(`Load Failed: ${error.message || "Server Error"}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleEdit = (service) => {
    setEditingService(service);
    setDialogOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!editingService) return;
    try {
      await apiClient.updateService(editingService._id || editingService.id, {
        name: editingService.name,
        description: editingService.description,
        service_type: editingService.service_type,
        price_range: editingService.price_range,
        image_url: editingService.image_url ?? "",
        features: Array.isArray(editingService.features) ? editingService.features : parseFeatures(editingService.features),
        is_active: editingService.is_active,
      });
      toast.success("Service updated successfully");
      setDialogOpen(false);
      setEditingService(null);
      fetchServices();
    } catch (error) {
      console.error("Error updating service:", error);
      toast.error("Failed to update service");
    }
  };

  const handleAddService = async (e) => {
    e.preventDefault();
    const name = (newService.name || "").trim();
    if (!name) {
      toast.error("Please enter service name");
      return;
    }
    try {
      await apiClient.createService({
        name,
        description: newService.description || "",
        service_type: newService.service_type,
        price_range: newService.price_range || "",
        image_url: newService.image_url || "",
        features: parseFeatures(newService.features),
        is_active: newService.is_active,
      });
      toast.success("Service added successfully");
      setAddDialogOpen(false);
      setNewService({ name: "", description: "", service_type: "neon_tattoo", price_range: "", image_url: "", features: "", is_active: true });
      fetchServices();
    } catch (error) {
      console.error("Error adding service:", error);
      const msg = error.message || "";
      if (msg.includes("Not Found") || msg.includes("404")) {
        toast.error("Backend nahi mila. Backend folder mein 'npm start' chala kar server start karein (port 3001).");
      } else {
        toast.error(msg || "Failed to add service");
      }
    }
  };

  const toggleActive = async (id, currentStatus) => {
    try {
      await apiClient.toggleServiceActive(id);
      toast.success("Service status updated");
      fetchServices();
    } catch (error) {
      console.error("Error toggling service:", error);
      toast.error("Failed to update service");
    }
  };

  return (
    <Card variant="neon">
      <CardHeader className="border-b border-purple-500/30 bg-gradient-to-r from-purple-500/10 to-transparent">
        <div className="flex flex-col gap-2">
          <div className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-xl">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center">
                <Settings className="w-5 h-5 text-white" />
              </div>
              Services Management
            </CardTitle>
            <div className="flex gap-2">
              <Button
                size="sm"
                className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
                onClick={() => setAddDialogOpen(true)}
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Service
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchServices}
                disabled={loading}
                className="hover:border-purple-500/50 transition-colors"
              >
                <motion.div
                  animate={loading ? { rotate: 360 } : {}}
                  transition={{ duration: 2, repeat: loading ? Infinity : 0 }}
                >
                  <RefreshCw className="w-4 h-4" />
                </motion.div>
              </Button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">Add and edit services — they appear on the public Services page.</p>
        </div>
      </CardHeader>
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
              <RefreshCw className="w-8 h-8 text-purple-500" />
            </motion.div>
          </motion.div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-purple-500/30 hover:bg-purple-500/5">
                  <TableHead className="font-display">Service</TableHead>
                  <TableHead className="font-display">Description</TableHead>
                  <TableHead className="font-display">Price Range</TableHead>
                  <TableHead className="font-display">Status</TableHead>
                  <TableHead className="font-display">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.map((service, index) => (
                  <motion.tr
                    key={service._id || service.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-purple-500/20 hover:bg-purple-500/5 transition-colors"
                  >
                    <TableCell className="font-medium">
                      {service.name}
                      <div className="text-xs text-muted-foreground mt-1">
                        {serviceLabels[service.service_type] || service.service_type}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs truncate text-sm">
                      {service.description}
                    </TableCell>
                    <TableCell className="text-purple-500 font-display font-semibold">
                      {service.price_range}
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center gap-1 text-xs font-display ${service.is_active
                        ? 'text-green-500'
                        : 'text-amber-500'
                        }`}>
                        {service.is_active ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" />
                            Active
                          </>
                        ) : (
                          <>
                            <Circle className="w-3 h-3" />
                            Inactive
                          </>
                        )}
                      </span>
                    </TableCell>
                    <TableCell>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEdit(service)}
                          className="hover:border-purple-500/50 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </motion.div>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Edit Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="bg-card border-purple-500/30 max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-purple-500" />
                Edit Service
              </DialogTitle>
            </DialogHeader>
            {editingService && (
              <form onSubmit={handleSave} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={editingService.name}
                    onChange={(e) =>
                      setEditingService({ ...editingService, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit_type">Service Type</Label>
                  <Input
                    id="edit_type"
                    value={editingService.service_type || ""}
                    onChange={(e) =>
                      setEditingService({ ...editingService, service_type: e.target.value })
                    }
                    placeholder="e.g. Neon Tattoos"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price_range">Price Range</Label>
                  <Input
                    id="price_range"
                    value={editingService.price_range || ""}
                    onChange={(e) =>
                      setEditingService({ ...editingService, price_range: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Image (for Services page)</Label>
                  <div className="flex flex-col gap-2">
                    <label className="flex flex-col items-center justify-center gap-1 p-4 border-2 border-dashed border-purple-500/40 rounded-lg hover:border-purple-500/70 cursor-pointer transition-colors bg-purple-500/5">
                      <Upload className="w-5 h-5 text-purple-500" />
                      <span className="text-sm font-medium">PC se photo select karein</span>
                      <span className="text-xs text-muted-foreground">2MB se chhoti image behtar</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () =>
                              setEditingService({ ...editingService, image_url: reader.result });
                            reader.readAsDataURL(file);
                          }
                          e.target.value = "";
                        }}
                      />
                    </label>
                    <div className="relative flex items-center gap-2">
                      <span className="text-xs text-muted-foreground shrink-0">ya URL paste karein:</span>
                      <Input
                        id="edit_image_url"
                        value={editingService.image_url?.startsWith("http") ? editingService.image_url : ""}
                        onChange={(e) =>
                          setEditingService({ ...editingService, image_url: e.target.value })
                        }
                        placeholder="https://..."
                        className="flex-1"
                      />
                    </div>
                    {editingService.image_url && (
                      <div className="relative inline-block w-24 h-24 rounded-lg overflow-hidden border border-purple-500/30">
                        <img src={editingService.image_url} alt="" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setEditingService({ ...editingService, image_url: "" })}
                          className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit_features">Features (one per line or comma-separated)</Label>
                  <Textarea
                    id="edit_features"
                    value={formatFeatures(editingService.features)}
                    onChange={(e) =>
                      setEditingService({ ...editingService, features: e.target.value })
                    }
                    placeholder="UV Reactive, Waterproof, Lasts 3-5 days"
                    className="min-h-[80px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={editingService.description || ""}
                    onChange={(e) =>
                      setEditingService({ ...editingService, description: e.target.value })
                    }
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={editingService.is_active ?? false}
                    onCheckedChange={(checked) =>
                      setEditingService({ ...editingService, is_active: checked })
                    }
                  />
                  <Label htmlFor="is_active">Active</Label>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
                >
                  Save Changes
                </Button>
              </form>
            )}
          </DialogContent>
        </Dialog>

        {/* Add Service Dialog */}
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogContent className="bg-card border-purple-500/30 max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-purple-500" />
                Add Service
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddService} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new_name">Name *</Label>
                <Input
                  id="new_name"
                  value={newService.name}
                  onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                  placeholder="e.g. Neon Tattoos"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new_type">Service Type *</Label>
                <Input
                  id="new_type"
                  value={newService.service_type}
                  onChange={(e) => setNewService({ ...newService, service_type: e.target.value })}
                  placeholder="e.g. Neon Tattoos, Glitter Hair..."
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new_price">Price Range</Label>
                <Input
                  id="new_price"
                  value={newService.price_range}
                  onChange={(e) => setNewService({ ...newService, price_range: e.target.value })}
                  placeholder="e.g. ₹500 – ₹2000"
                />
              </div>
              <div className="space-y-2">
                <Label>Image (for Services page)</Label>
                <div className="flex flex-col gap-2">
                  <label className="flex flex-col items-center justify-center gap-1 p-4 border-2 border-dashed border-purple-500/40 rounded-lg hover:border-purple-500/70 cursor-pointer transition-colors bg-purple-500/5">
                    <Upload className="w-5 h-5 text-purple-500" />
                    <span className="text-sm font-medium">PC se photo select karein</span>
                    <span className="text-xs text-muted-foreground">2MB se chhoti image behtar (large image fail ho sakti hai)</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () =>
                            setNewService({ ...newService, image_url: reader.result });
                          reader.readAsDataURL(file);
                        }
                        e.target.value = "";
                      }}
                    />
                  </label>
                  <div className="relative flex items-center gap-2">
                    <span className="text-xs text-muted-foreground shrink-0">ya URL paste karein:</span>
                    <Input
                      id="new_image_url"
                      value={newService.image_url?.startsWith("http") ? newService.image_url : ""}
                      onChange={(e) => setNewService({ ...newService, image_url: e.target.value })}
                      placeholder="https://..."
                      className="flex-1"
                    />
                  </div>
                  {newService.image_url && (
                    <div className="relative inline-block w-24 h-24 rounded-lg overflow-hidden border border-purple-500/30">
                      <img src={newService.image_url} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setNewService({ ...newService, image_url: "" })}
                        className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="new_features">Features (one per line or comma-separated)</Label>
                <Textarea
                  id="new_features"
                  value={newService.features}
                  onChange={(e) => setNewService({ ...newService, features: e.target.value })}
                  placeholder="UV Reactive, Waterproof, Lasts 3-5 days"
                  className="min-h-[80px]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new_description">Description</Label>
                <Textarea
                  id="new_description"
                  value={newService.description}
                  onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                  placeholder="Short description for the Services page"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="new_is_active"
                  checked={newService.is_active}
                  onCheckedChange={(c) => setNewService({ ...newService, is_active: c })}
                />
                <Label htmlFor="new_is_active">Active (show on Services page)</Label>
              </div>
              <Button type="submit" className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600">
                Add Service
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default ServicesTab;
