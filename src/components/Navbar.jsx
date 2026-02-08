import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import logo from "@/assets/logo.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const links = [
    { href: "/", label: "Home" },
    { href: "/services", label: "Services" },
    { href: "/gallery", label: "Gallery" },
    { href: "/previous-work", label: "Previous Work" },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 w-full bg-[#0a0a0a]/70 backdrop-blur-3xl border-b border-primary/20 shadow-[0_4px_30px_rgba(0,0,0,0.3)]"
    >
      {/* Decorative Glow Line */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-50" />

      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20 md:h-24">

          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-4 group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden flex-shrink-0 border border-primary/40 p-0.5 bg-black"
            >
              <div className="absolute inset-0 bg-primary/20 blur-md group-hover:bg-primary/40 transition-all duration-500" />
              <img
                src={logo}
                alt="IYA - Imprint Your Aura"
                className="relative w-full h-full object-cover rounded-full z-10"
              />
            </motion.div>
            <div className="block sm:block">
              <span className="block text-lg sm:text-xl font-display font-black text-white tracking-tighter leading-none group-hover:text-primary transition-colors">IYA</span>
              <p className="text-[8px] sm:text-[10px] text-primary font-body font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] mt-1 italic">Imprint Your Aura</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-10">
            {links.map((link, idx) => {
              const isActive = location.pathname === link.href;
              return (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Link
                    to={link.href}
                    className={`text-sm font-black uppercase tracking-[0.2em] transition-all relative group ${isActive ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
                  >
                    {link.label}
                    <span className={`absolute -bottom-1 left-0 h-[1.5px] bg-primary transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Actions - PREMIUM STYLE SYNCED */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/auth">
              <Button
                variant="outline"
                className="h-12 px-8 rounded-2xl border-primary bg-black/40 text-[10px] sm:text-xs font-black uppercase tracking-widest text-primary hover:bg-primary/5 transition-all shadow-[0_0_20px_rgba(var(--primary-rgb),0.15)]"
              >
                Admin Panel
              </Button>
            </Link>
            <Link to="/contact">
              <Button
                className="h-12 px-10 rounded-2xl bg-primary text-black text-[10px] sm:text-xs font-black uppercase tracking-widest hover:scale-[1.03] transition-all shadow-[0_10px_30px_rgba(var(--primary-rgb),0.3)]"
              >
                Book Session
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-3 rounded-2xl text-foreground bg-white/5 border border-white/10 hover:bg-primary/10 transition-all active:scale-95 shadow-lg"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <motion.div
          initial={false}
          animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
          transition={{ duration: 0.4, ease: "circOut" }}
          className="lg:hidden overflow-hidden bg-[#0a0a0a]/95 backdrop-blur-3xl rounded-3xl mb-4 border border-white/5 shadow-2xl mx-2"
        >
          <div className="px-4 py-8 space-y-4">
            {links.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`block px-6 py-4 text-xs font-black uppercase tracking-[0.2em] rounded-2xl transition-all ${isActive ? 'bg-primary/10 text-primary border border-primary/20' : 'text-muted-foreground bg-white/5 hover:bg-primary/10 hover:text-primary border border-transparent'}`}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="flex flex-col gap-4 mt-6">
              <Link to="/contact" onClick={() => setIsOpen(false)}>
                <Button className="w-full h-14 rounded-2xl text-xs font-black uppercase tracking-widest bg-primary text-black hover:scale-[1.02] transition-transform shadow-lg shadow-primary/20">Book Session Now</Button>
              </Link>
              <Link to="/auth" onClick={() => setIsOpen(false)}>
                <Button variant="outline" className="w-full h-14 rounded-2xl text-xs font-black uppercase tracking-widest border-primary bg-primary/5 text-primary hover:bg-primary/10 shadow-lg shadow-primary/5">Admin Panel Access</Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
