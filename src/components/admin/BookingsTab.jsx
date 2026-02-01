import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { apiClient } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { RefreshCw, Calendar, Mail, Phone, MapPin, Trash2, CheckCircle2, Clock } from "lucide-react";

const serviceLabels = {
  neon_tattoo: "Neon Tattoos",
  glitter_hair_spray: "Glitter Hair Spray",
  glitter_face_art: "Glitter Face Art",
  glitter_eye_art: "Glitter Eye Art",
  bold_stone_designs: "Bold Stone Designs",
};

const statusColors = {
  pending: "text-yellow-500",
  confirmed: "text-primary",
  completed: "text-green-500",
  cancelled: "text-destructive",
};

const BookingsTab = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const data = await apiClient.getBookings();
      setBookings(data || []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error(`Load Failed: ${error.message || "Server Error"}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const updateStatus = async (id, status) => {
    const bid = String(id ?? (id?.toString?.() ?? ''));
    const bookingIndex = bookings.findIndex(b => String(b._id || b.id) === bid);
    if (bookingIndex === -1) return;

    const oldStatus = bookings[bookingIndex].status;

    setBookings(prev => prev.map(b =>
      String(b._id || b.id) === bid ? { ...b, status } : b
    ));

    try {
      await apiClient.updateBookingStatus(bid, status);
      toast.success("Status updated successfully");
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
      setBookings(prev => prev.map(b =>
        String(b._id || b.id) === bid ? { ...b, status: oldStatus } : b
      ));
    }
  };

  return (
    <Card variant="neon">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          Booking Requests
        </CardTitle>
        <Button variant="outline" size="sm" onClick={fetchBookings} disabled={loading}>
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No bookings yet
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-cyan-500/30 hover:bg-cyan-500/5">
                  <TableHead className="font-display">Name</TableHead>
                  <TableHead className="font-display">Contact</TableHead>
                  <TableHead className="font-display">Service</TableHead>
                  <TableHead className="font-display">Date</TableHead>
                  <TableHead className="font-display">Location</TableHead>
                  <TableHead className="font-display">Status</TableHead>
                  <TableHead className="font-display">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((booking, index) => (
                  <motion.tr
                    key={booking._id || booking.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-cyan-500/20 hover:bg-cyan-500/5 transition-colors"
                  >
                    <TableCell className="font-medium">{booking.name}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Mail className="w-3 h-3" />
                          {booking.email}
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <Phone className="w-3 h-3" />
                          {booking.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {serviceLabels[booking.service_type] || booking.service_type}
                    </TableCell>
                    <TableCell>
                      {booking.preferred_date ? (
                        <div>
                          <div className="text-sm">{new Date(booking.preferred_date).toLocaleDateString()}</div>
                          <div className="text-xs text-muted-foreground">
                            {booking.preferred_time_slot}
                          </div>
                        </div>
                      ) : (
                        "Not specified"
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {booking.location}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center gap-1 font-display uppercase text-xs px-2 py-1 rounded-full ${statusColors[booking.status]}`}>
                        {booking.status === 'pending' && <Clock className="w-3 h-3" />}
                        {booking.status === 'confirmed' && <CheckCircle2 className="w-3 h-3" />}
                        {booking.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={booking.status}
                        onValueChange={(value) => updateStatus(booking._id || booking.id, value)}
                      >
                        <SelectTrigger className="w-32 text-xs hover:border-primary/50 transition-colors">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BookingsTab;
