import { Link } from "react-router-dom";
import { Github, Twitter, Linkedin } from "lucide-react";
import logo from "@/assets/helioguard-logo.png";

const Footer = () => {
  return (
    <footer className="glass-card border-t border-white/10 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img src={logo} alt="HelioGuard AI" className="w-12 h-12" />
              <span className="text-2xl font-bold gradient-text">HelioGuard AI</span>
            </div>
            <p className="text-muted-foreground mb-4">
              Defending Earth with Intelligence. AI-powered asteroid risk prediction and space mining analysis.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-foreground/60 hover:text-primary transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-foreground/60 hover:text-secondary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-foreground/60 hover:text-accent transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4 text-primary">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/dashboard" className="text-foreground/60 hover:text-primary transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/prediction" className="text-foreground/60 hover:text-primary transition-colors">
                  Prediction
                </Link>
              </li>
              <li>
                <Link to="/mining" className="text-foreground/60 hover:text-primary transition-colors">
                  Mining Analysis
                </Link>
              </li>
              <li>
                <Link to="/alerts" className="text-foreground/60 hover:text-primary transition-colors">
                  Alerts
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4 text-secondary">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-foreground/60 hover:text-secondary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-foreground/60 hover:text-secondary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} HelioGuard AI. All rights reserved. Defending Earth, One Prediction at a Time.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
