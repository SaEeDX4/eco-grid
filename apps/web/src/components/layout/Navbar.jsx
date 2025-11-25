import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Moon, Sun, Menu, X, Zap, ChevronDown } from "lucide-react";
import { useTranslation } from "../../lib/i18n";
import { useAuth } from "../../context/AuthContext";
import Button from "../ui/Button";

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Dropdown states
  const [exploreOpen, setExploreOpen] = useState(false);
  const [companyOpen, setCompanyOpen] = useState(false);

  const exploreRef = useRef(null);
  const companyRef = useRef(null);

  const { locale, setLocale } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Handle sticky background
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (exploreRef.current && !exploreRef.current.contains(e.target)) {
        setExploreOpen(false);
      }
      if (companyRef.current && !companyRef.current.contains(e.target)) {
        setCompanyOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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

  // -------- NAVIGATION GROUPS -------- //

  const leftNav = [
    { to: "/", label: "Home" },
    { to: "/dashboard", label: "Dashboard", protected: true },
    { to: "/devices", label: "Devices", protected: true },
    { to: "/optimizer", label: "Optimizer", protected: true },
    { to: "/vpp", label: "VPP" },
    { to: "/reports", label: "Reports", protected: true },
  ];

  const exploreNav = [
    { to: "/map", label: "Pilot Map" },
    { to: "/testimonials", label: "Testimonials" },
    { to: "/blog", label: "Blog" },
    { to: "/faq", label: "FAQ" },
    { to: "/roadmap", label: "Roadmap" },
    { to: "/pricing", label: "Pricing" },
  ];

  const companyNav = [
    { to: "/about", label: "About" },
    { to: "/partners", label: "Partners" },
    { to: "/startup-visa", label: "Startup Visa" },
    { to: "/contact", label: "Contact" },
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
            {/* LEFT NAV ITEMS */}
            {leftNav.map((link) => (
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

            {/* EXPLORE DROPDOWN */}
            <div ref={exploreRef} className="relative">
              <button
                onClick={() => setExploreOpen(!exploreOpen)}
                className="flex items-center gap-1 text-slate-700 dark:text-slate-300 hover:text-green-600 dark:hover:text-green-400 font-medium"
              >
                Explore
                <ChevronDown
                  size={16}
                  className={`transition-transform ${exploreOpen ? "rotate-180" : ""}`}
                />
              </button>

              {exploreOpen && (
                <div className="absolute mt-3 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl py-2 z-50">
                  {exploreNav.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      className="block px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* COMPANY DROPDOWN */}
            <div ref={companyRef} className="relative">
              <button
                onClick={() => setCompanyOpen(!companyOpen)}
                className="flex items-center gap-1 text-slate-700 dark:text-slate-300 hover:text-green-600 dark:hover:text-green-400 font-medium"
              >
                Company
                <ChevronDown
                  size={16}
                  className={`transition-transform ${companyOpen ? "rotate-180" : ""}`}
                />
              </button>

              {companyOpen && (
                <div className="absolute mt-3 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl py-2 z-50">
                  {companyNav.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      className="block px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-4">
            <select
              value={locale}
              onChange={(e) => setLocale(e.target.value)}
              className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white hover:border-green-500"
            >
              <option value="en">🇨🇦 EN</option>
              <option value="fa">🇮🇷 فا</option>
              <option value="fr">🇫🇷 FR</option>
            </select>

            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all hover:scale-110"
            >
              {darkMode ? (
                <Sun size={20} className="text-yellow-500" />
              ) : (
                <Moon size={20} />
              )}
            </button>

            <Button variant="gradient" size="default">
              Join Pilot
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* MOBILE MENU */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4">
            <div className="flex flex-col gap-4">
              {/* LEFT NAV */}
              {leftNav.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 px-4 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  {link.label}
                </Link>
              ))}

              {/* EXPLORE */}
              <details className="px-4">
                <summary className="cursor-pointer py-2 text-slate-700 dark:text-slate-300 font-medium">
                  Explore
                </summary>
                <div className="flex flex-col pl-4 mt-2">
                  {exploreNav.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className="py-2 text-slate-700 dark:text-slate-300"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </details>

              {/* COMPANY */}
              <details className="px-4">
                <summary className="cursor-pointer py-2 text-slate-700 dark:text-slate-300 font-medium">
                  Company
                </summary>
                <div className="flex flex-col pl-4 mt-2">
                  {companyNav.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className="py-2 text-slate-700 dark:text-slate-300"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </details>

              {/* Language + Dark Mode */}
              <div className="flex items-center gap-4 px-4 pt-4 border-t border-slate-300 dark:border-slate-700">
                <select
                  value={locale}
                  onChange={(e) => setLocale(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600"
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

              <Button variant="gradient" size="lg" className="w-full mt-4">
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
