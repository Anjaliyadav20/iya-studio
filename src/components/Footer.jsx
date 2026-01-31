import { Link } from "react-router-dom";
import { Instagram, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-primary/20 bg-card/30 backdrop-blur-sm py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="font-display text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
              IYA
            </h3>
            <p className="font-body text-muted-foreground mb-6 max-w-md leading-relaxed">
              Imprint Your Aura — premium temporary tattoos, fluorescent glow art, glitter and body jewels.
              Transform yourself for any event with our professional body art services.
            </p>
            <div className="flex gap-3">
              <a
                href="https://www.instagram.com/imprint.your.aura/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-primary/40 flex items-center justify-center text-primary hover:bg-primary/10 hover:border-primary/60 transition-all"
                title="Instagram"
              >
                <Instagram size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-sm font-semibold text-foreground uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-3 font-body">
              {[
                { to: "/", label: "Home" },
                { to: "/services", label: "Services" },
                { to: "/gallery", label: "Gallery" },
                { to: "/contact", label: "Book Now" },
              ].map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="text-muted-foreground hover:text-primary transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-sm font-semibold text-foreground uppercase tracking-wider mb-4">Contact</h4>
            <ul className="space-y-3 font-body text-muted-foreground">
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-primary shrink-0" />
                <a href="tel:+917745946808" className="hover:text-primary transition-colors">+91 7745946808 / 7489326251</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-primary shrink-0" />
                <a href="mailto:imprint.your.aura@gmail.com" className="hover:text-primary transition-colors">imprint.your.aura@gmail.com</a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={16} className="text-primary shrink-0 mt-0.5" />
                <span>Indore, India</span>
              </li>
              <li className="flex items-center gap-2">
                <Instagram size={16} className="text-primary shrink-0" />
                <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">imprint.your.aura</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary/20 mt-10 pt-8 text-center">
          <p className="font-body text-sm text-muted-foreground">
            © {new Date().getFullYear()} IYA — Imprint Your Aura. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
