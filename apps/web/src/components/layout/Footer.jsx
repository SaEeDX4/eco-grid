import React from "react";
import { Link } from "react-router-dom";
import {
  Zap,
  Mail,
  MapPin,
  Phone,
  Github,
  Linkedin,
  Twitter,
} from "lucide-react";

const Footer = () => {
  const footerLinks = {
    Product: [
      { label: "Features", to: "/features" },
      { label: "Pricing", to: "/pricing" },
      { label: "Demo", to: "/demo" },
      { label: "Roadmap", to: "/roadmap" },
    ],
    Resources: [
      { label: "Blog", to: "/blog" },
      { label: "FAQ", to: "/faq" },
      { label: "API Docs", to: "/docs" },
      { label: "Community", to: "/community" },
    ],
    Company: [
      { label: "About", to: "/about" },
      { label: "Careers", to: "/careers" },
      { label: "Partners", to: "/partners" },
      { label: "Contact", to: "/contact" }, // ✅ Added Contact Link (per Module 31)
    ],
    Legal: [
      { label: "Privacy", to: "/privacy" },
      { label: "Terms", to: "/terms" },
      { label: "Security", to: "/security" },
      { label: "Compliance", to: "/compliance" },
    ],
  };

  return (
    <footer className="bg-slate-900 dark:bg-black text-white mt-20">
      <div className="container mx-auto px-4 py-16">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4 group">
              <div className="relative">
                <div className="absolute inset-0 bg-green-500 rounded-lg blur-md opacity-50" />
                <div className="relative bg-gradient-to-br from-green-500 to-emerald-600 p-2 rounded-lg">
                  <Zap className="text-white" size={24} />
                </div>
              </div>
              <span className="text-2xl font-bold">Eco-Grid</span>
            </Link>
            <p className="text-slate-400 mb-6 max-w-sm">
              Smart energy management for Canadian homes and businesses. Join
              the green revolution in Vancouver, BC.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="p-2 rounded-lg bg-slate-800 hover:bg-green-600 transition-colors"
              >
                <Twitter size={20} />
              </a>
              <a
                href="#"
                className="p-2 rounded-lg bg-slate-800 hover:bg-green-600 transition-colors"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="#"
                className="p-2 rounded-lg bg-slate-800 hover:bg-green-600 transition-colors"
              >
                <Github size={20} />
              </a>
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-bold text-lg mb-4">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-slate-400 hover:text-green-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact Info */}
        <div className="border-t border-slate-800 pt-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <MapPin className="text-green-500" size={20} />
              <span className="text-slate-400">Vancouver, BC, Canada</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="text-green-500" size={20} />
              <span className="text-slate-400">hello@ecogrid.ca</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="text-green-500" size={20} />
              <span className="text-slate-400">+1 (604) 555-0100</span>
            </div>
          </div>

          {/* ✅ Added Contact Us link below info */}
          <div className="mt-6 text-center">
            <a
              href="/contact"
              className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm font-medium"
            >
              Contact Us
            </a>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-sm">
            © 2025 Eco-Grid. All rights reserved.
          </p>
          <p className="text-slate-400 text-sm">
            Made with 💚 in Vancouver for a sustainable future
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
