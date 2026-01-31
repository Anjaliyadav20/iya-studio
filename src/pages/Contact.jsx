import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiClient } from "@/services/api";
import { toast } from "sonner";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, Instagram } from "lucide-react";

const bookingSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Please enter a valid phone number").max(15),
  location: z.string().min(3, "Please enter your location").max(200),
  service_type: z.enum([
    "neon_tattoo",
    "glitter_hair_spray",
    "glitter_face_art",
    "glitter_eye_art",
    "bold_stone_designs",
  ]),
  preferred_date: z.string().optional(),
  preferred_time_slot: z.string().optional(),
  event_details: z.string().max(1000).optional(),
});

const serviceOptions = [
  { value: "neon_tattoo", label: "Neon Tattoos" },
  { value: "glitter_hair_spray", label: "Glitter Hair Spray" },
  { value: "glitter_face_art", label: "Glitter Face Art" },
  { value: "glitter_eye_art", label: "Glitter Eye Art" },
  { value: "bold_stone_designs", label: "Bold Stone Designs" },
];

const timeSlots = [
  "Morning (9 AM - 12 PM)",
  "Afternoon (12 PM - 4 PM)",
  "Evening (4 PM - 8 PM)",
  "Night (8 PM - 11 PM)",
];

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(bookingSchema),
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await apiClient.createBooking({
        name: data.name,
        email: data.email,
        phone: data.phone,
        location: data.location,
        service_type: data.service_type,
        preferred_date: data.preferred_date || null,
        preferred_time_slot: data.preferred_time_slot || null,
        additional_info: data.event_details || null,
      });
      setIsSubmitted(true);
      reset();
      toast.success("Booking request submitted successfully!");
    } catch (error) {
      console.error("Error submitting booking:", error);
      toast.error("Failed to submit booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-28 pb-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="font-display text-4xl md:text-6xl mb-4 text-foreground">
              Book Your <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">Session</span>
            </h1>
            <div className="section-heading-line mx-auto mb-4" />
            <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
              Fill out the form below and we'll get back to you with availability and pricing.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-1"
            >
              <div className="space-y-6">
                {[
                  { icon: Phone, title: "Phone", content: "+91 7745946808 / 7489326251", href: "tel:+917745946808" },
                  { icon: Mail, title: "Email", content: "imprint.your.aura@gmail.com", href: "mailto:imprint.your.aura@gmail.com" },
                  { icon: MapPin, title: "Location", content: "Indore, India" },
                  { icon: Clock, title: "Working Hours", content: "Flexible timings based on event requirements" },
                  { icon: Instagram, title: "Instagram", content: "imprint.your.aura", href: "https://www.instagram.com/imprint.your.aura/" },
                ].map((item) => (
                  <Card key={item.title} variant="neon" className="bg-card/60 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2 text-foreground">
                        <item.icon className="w-5 h-5 text-primary" />
                        {item.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {item.href ? (
                        <a href={item.href} target="_blank" rel="noopener noreferrer" className="font-body text-muted-foreground hover:text-primary transition-colors">
                          {item.content}
                        </a>
                      ) : (
                        <p className="font-body text-muted-foreground">{item.content}</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-2"
            >
              <Card variant="neon" className="bg-card/60 backdrop-blur-sm p-6">
                {isSubmitted ? (
                  <div className="text-center py-12">
                    <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
                    <h3 className="font-display text-2xl text-foreground mb-2">Thank You!</h3>
                    <p className="font-body text-muted-foreground mb-6">
                      Your booking request has been submitted. We'll contact you soon!
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => setIsSubmitted(false)}
                      className="h-12 px-8 rounded-2xl border-primary/40 text-primary hover:bg-primary/5 transition-all text-[10px] font-black uppercase tracking-widest shadow-[0_0_15px_rgba(var(--primary-rgb),0.1)]"
                    >
                      Submit Another Request
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input id="name" placeholder="Your name" className="bg-background/50 border-primary/30" {...register("name")} />
                        {errors.name && <p className="text-destructive text-sm">{errors.name.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input id="email" type="email" placeholder="your@email.com" className="bg-background/50 border-primary/30" {...register("email")} />
                        {errors.email && <p className="text-destructive text-sm">{errors.email.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input id="phone" placeholder="+91 7745946808" className="bg-background/50 border-primary/30" {...register("phone")} />
                        {errors.phone && <p className="text-destructive text-sm">{errors.phone.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Event Location *</Label>
                        <Input id="location" placeholder="City, Venue" className="bg-background/50 border-primary/30" {...register("location")} />
                        {errors.location && <p className="text-destructive text-sm">{errors.location.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label>Service Required *</Label>
                        <Select onValueChange={(value) => setValue("service_type", value)}>
                          <SelectTrigger className="bg-background/50 border-primary/30">
                            <SelectValue placeholder="Select a service" />
                          </SelectTrigger>
                          <SelectContent>
                            {serviceOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.service_type && <p className="text-destructive text-sm">{errors.service_type.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="preferred_date">Preferred Date</Label>
                        <Input id="preferred_date" type="date" className="bg-background/50 border-primary/30" {...register("preferred_date")} />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label>Preferred Time Slot</Label>
                        <Select onValueChange={(value) => setValue("preferred_time_slot", value)}>
                          <SelectTrigger className="bg-background/50 border-primary/30">
                            <SelectValue placeholder="Select time slot" />
                          </SelectTrigger>
                          <SelectContent>
                            {timeSlots.map((slot) => (
                              <SelectItem key={slot} value={slot}>
                                {slot}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="event_details">Event Details</Label>
                      <Textarea
                        id="event_details"
                        placeholder="Tell us about your event (type, number of guests, requirements...)"
                        className="min-h-[120px] bg-background/50 border-primary/30"
                        {...register("event_details")}
                      />
                    </div>
                    <Button
                      type="submit"
                      size="lg"
                      className="h-16 w-full rounded-2xl bg-primary text-black font-black uppercase tracking-[0.2em] text-[11px] hover:scale-[1.02] hover:bg-primary/90 transition-all shadow-[0_10px_40px_rgba(var(--primary-rgb),0.3)] flex items-center justify-center gap-3 border-none"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Submitting..." : <><Send className="w-5 h-5 fill-current" /> Submit Booking Request</>}
                    </Button>
                  </form>
                )}
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
