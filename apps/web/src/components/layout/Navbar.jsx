import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Moon, Sun, Menu, X, Zap } from "lucide-react";
import { useTranslation } from "../../lib/i18n";
import { useAuth } from "../../context/AuthContext";
import Button from "../ui/Button";

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { locale, setLocale } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  const handleProtectedClick = (e, path) => {
    e.preventDefault();
    if (!user) {
      navigate("/auth/login", { state: { from: { pathname: path } } });
    } else {
      navigate(path);
    }
  };

  // ✅ Includes Reports + Partners + Contact routes + NEW Pricing route + Startup Visa + BLOG
  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/dashboard", label: "Dashboard", protected: true },
    { to: "/devices", label: "Devices", protected: true },
    { to: "/optimizer", label: "Optimizer", protected: true },
    { to: "/reports", label: "Reports", protected: true },
    { to: "/map", label: "Pilot Map" },
    { to: "/testimonials", label: "Testimonials" },
    { to: "/blog", label: "Blog" }, // ✅ Added Blog link (Claude instruction)
    { to: "/pricing", label: "Pricing" }, // ✅ Added Pricing link (Module 10)
    { to: "/about", label: "About" },
    { to: "/partners", label: "Partners" },
    { to: "/startup-visa", label: "Startup Visa" }, // ✅ Added per Claude instruction
    { to: "/contact", label: "Contact" }, // ✅ Added for Module 30
  ];

  return (
    <nav
      className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${
          scrolled || mobileMenuOpen
            ? "bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl shadow-lg"
            : "bg-transparent"
        }
      `}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="absolute inset-0 bg-green-500 rounded-lg blur-md opacity-50 group-hover:opacity-75 transition-opacity" />
              <div className="relative bg-gradient-to-br from-green-500 to-emerald-600 p-2 rounded-lg">
                <Zap className="text-white" size={24} />
              </div>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Eco-Grid
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={
                  link.protected
                    ? (e) => handleProtectedClick(e, link.to)
                    : undefined
                }
                className="text-slate-700 dark:text-slate-300 hover:text-green-600 dark:hover:text-green-400 font-medium transition-colors relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-600 group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-4">
            <select
              value={locale}
              onChange={(e) => setLocale(e.target.value)}
              className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white transition-all hover:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="en">🇨🇦 EN</option>
              <option value="fa">🇮🇷 فا</option>
              <option value="fr">🇫🇷 FR</option>
            </select>

            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all hover:scale-110 active:scale-95"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <Sun size={20} className="text-yellow-500" />
              ) : (
                <Moon size={20} className="text-slate-700" />
              )}
            </button>

            <Button variant="gradient" size="default">
              Join Pilot
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 animate-in slide-in-from-top duration-300">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={
                    link.protected
                      ? (e) => {
                          setMobileMenuOpen(false);
                          handleProtectedClick(e, link.to);
                        }
                      : () => setMobileMenuOpen(false)
                  }
                  className="text-slate-700 dark:text-slate-300 hover:text-green-600 font-medium py-2 px-4 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex items-center gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                <select
                  value={locale}
                  onChange={(e) => setLocale(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                >
                  <option value="en">🇨🇦 EN</option>
                  <option value="fa">🇮🇷 فا</option>
                  <option value="fr">🇫🇷 FR</option>
                </select>
                <button
                  onClick={toggleDarkMode}
                  className="p-2 rounded-lg border border-slate-300 dark:border-slate-600"
                >
                  {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>
              </div>
              <Button variant="gradient" size="lg" className="w-full">
                Join Pilot
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
