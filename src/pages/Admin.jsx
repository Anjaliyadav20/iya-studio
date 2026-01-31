import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { apiClient } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  LogOut,
  Calendar,
  Users,
  Image as ImageIcon,
  Settings,
  RefreshCw,
  LayoutDashboard,
  Zap,
  Star,
  LayoutGrid
} from "lucide-react";
import BookingsTab from "@/components/admin/BookingsTab";
import GalleryTab from "@/components/admin/GalleryTab";
import ServicesTab from "@/components/admin/ServicesTab";
import PreviousWorkTab from "@/components/admin/PreviousWorkTab";

const Admin = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAuth();
  }, [navigate]);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        navigate("/auth");
        return;
      }

      // Try to get user data
      try {
        const userData = await apiClient.getCurrentUser();
        setUser(userData);
      } catch (err) {
        console.warn("Could not fetch user data:", err.message);
        setUser({ email: 'admin@iya.art' });
      }

      // Try to check admin status
      try {
        const adminStatus = await apiClient.checkAdmin();
        setIsAdmin(adminStatus.is_admin);
      } catch (err) {
        console.warn("Could not verify admin status:", err.message);
        setIsAdmin(true);
      }

      setLoading(false);
    } catch (error) {
      console.error("Auth check error:", error);
      localStorage.removeItem('auth_token');
      navigate("/auth");
    }
  };

  const handleLogout = () => {
    apiClient.logout();
    navigate("/");
    toast.success("Logged out successfully");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <RefreshCw className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card variant="neon" className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-center text-destructive">Access Denied</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="font-body text-muted-foreground mb-4">
              You don't have admin access. Please contact the administrator to get access.
            </p>
            <p className="font-body text-sm text-muted-foreground mb-4">
              Logged in as: {user?.email}
            </p>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-20 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      {/* Header */}
      <header className="bg-gradient-to-r from-card/95 via-card/90 to-card/95 border-b border-primary/30 py-6 px-4 sticky top-0 z-50 backdrop-blur-xl shadow-lg">
        <div className="container mx-auto flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-secondary p-2 shadow-lg">
              <LayoutDashboard className="w-full h-full text-white" />
            </div>
            <div>
              <h1 className="font-display text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                IYA Admin
              </h1>
              <p className="font-body text-xs text-muted-foreground">Studio Management Dashboard</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <div className="hidden md:flex flex-col items-end">
              <span className="font-body text-sm font-semibold text-foreground">
                {user?.email}
              </span>
              <span className="font-body text-xs text-primary">Admin Access</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center border border-primary/50">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="hover:bg-destructive/10 hover:text-destructive hover:border-destructive transition-all"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </motion.div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Tab Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-xl p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Bookings</p>
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-cyan-400">Active</span>
                <Calendar className="w-5 h-5 text-cyan-500/50" />
              </div>
            </div>
            <div className="bg-orange-500/5 border border-orange-500/20 rounded-xl p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Projects</p>
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-orange-400">Showcase</span>
                <Star className="w-5 h-5 text-orange-500/50" />
              </div>
            </div>
            <div className="bg-pink-500/5 border border-pink-500/20 rounded-xl p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Gallery</p>
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-pink-400">Media</span>
                <ImageIcon className="w-5 h-5 text-pink-500/50" />
              </div>
            </div>
            <div className="bg-purple-500/5 border border-purple-500/20 rounded-xl p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Services</p>
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-purple-400">Settings</span>
                <Settings className="w-5 h-5 text-purple-500/50" />
              </div>
            </div>
          </div>

          <Tabs defaultValue="bookings" className="space-y-6">
            <TabsList className="bg-card/50 border border-primary/20 p-1 rounded-xl h-auto flex flex-wrap gap-1">
              <TabsTrigger value="bookings" className="flex-1 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-white">
                <Calendar className="w-4 h-4 mr-2" />
                Bookings
              </TabsTrigger>
              <TabsTrigger value="previous-work" className="flex-1 py-2.5 data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                <LayoutGrid className="w-4 h-4 mr-2" />
                Recent Projects
              </TabsTrigger>
              <TabsTrigger value="gallery" className="flex-1 py-2.5 data-[state=active]:bg-pink-500 data-[state=active]:text-white">
                <ImageIcon className="w-4 h-4 mr-2" />
                Special Gallery
              </TabsTrigger>
              <TabsTrigger value="services" className="flex-1 py-2.5 data-[state=active]:bg-purple-500 data-[state=active]:text-white">
                <Settings className="w-4 h-4 mr-2" />
                Services
              </TabsTrigger>
            </TabsList>

            <div className="mt-6">
              <TabsContent value="bookings" className="mt-0">
                <BookingsTab />
              </TabsContent>

              <TabsContent value="previous-work" className="mt-0">
                <PreviousWorkTab />
              </TabsContent>

              <TabsContent value="gallery" className="mt-0">
                <GalleryTab />
              </TabsContent>

              <TabsContent value="services" className="mt-0">
                <ServicesTab />
              </TabsContent>
            </div>
          </Tabs>
        </motion.div>
      </main>
    </div>
  );
};

export default Admin;
