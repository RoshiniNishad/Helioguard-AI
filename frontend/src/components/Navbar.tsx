import { Link, useLocation } from "react-router-dom";

import {
  Menu,
  X,
  ShieldCheck,
  Lock,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  useState,
  useEffect,
} from "react";

import logo from "@/assets/helioguard-logo.png";

const Navbar = () => {

  // =========================================
  // FORCE DARK MODE ALWAYS
  // =========================================

  useEffect(() => {

    document.documentElement.classList.add(
      "dark"
    );

    document.body.classList.add(
      "dark"
    );

    document.body.style.backgroundColor =
      "#020617";

  }, []);

  // =========================================
  // STATES
  // =========================================

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const [accessGranted, setAccessGranted] =
    useState(false);

  const [showPopup, setShowPopup] =
    useState(false);

  const [accessCode, setAccessCode] =
    useState("");

  const [error, setError] =
    useState("");

  const location = useLocation();

  // =========================================
  // NAVIGATION LINKS
  // =========================================

  const navLinks = [

    {
      path: "/",
      label: "Home",
    },

    {
      path: "/dashboard",
      label: "Dashboard",
    },

    {
      path: "/prediction",
      label: "Prediction",
    },

    {
      path: "/mining",
      label: "Mining",
    },

    {
      path: "/alerts",
      label: "Alerts",
    },

    {
      path: "/about",
      label: "About",
    },

    {
      path: "/contact",
      label: "Contact",
    },
  ];

  // =========================================
  // CHECK ACCESS
  // =========================================

  useEffect(() => {

    const savedAccess =
      localStorage.getItem(
        "helioguard_access"
      );

    // HOME PAGE
    if (
      location.pathname === "/"
    ) {

      setShowPopup(false);

      return;
    }

    // ACCESS GRANTED
    if (
      savedAccess === "granted"
    ) {

      setAccessGranted(true);

      setShowPopup(false);

    } else {

      setAccessGranted(false);

      setShowPopup(true);
    }

  }, [location.pathname]);

  // =========================================
  // HANDLE ACCESS
  // =========================================

  const handleAccess = () => {

    if (
      accessCode ===
      "Helioguard@123"
    ) {

      localStorage.setItem(
        "helioguard_access",
        "granted"
      );

      setAccessGranted(true);

      setShowPopup(false);

      setError("");

    } else {

      setError(
        "Invalid Access Code"
      );
    }
  };

  // =========================================
  // ACTIVE ROUTE
  // =========================================

  const isActive = (
    path: string
  ) => {

    return (
      location.pathname === path
    );
  };

  // =========================================
  // UI
  // =========================================

  return (

    <>

      {/* =====================================
          ACCESS POPUP
      ===================================== */}

      {showPopup && (

        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center px-4">

          <div className="w-full max-w-md bg-[#07111f] border border-cyan-500/20 rounded-3xl p-8 shadow-[0_0_50px_rgba(0,255,255,0.15)]">

            {/* ICON */}

            <div className="flex justify-center mb-6">

              <div className="w-24 h-24 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">

                <ShieldCheck className="w-12 h-12 text-cyan-400" />

              </div>

            </div>

            {/* TITLE */}

            <div className="text-center">

              <h1 className="text-3xl font-bold text-white">

                Secure Access

              </h1>

              <p className="text-gray-400 mt-3 leading-relaxed">

                Authorization required to
                access HelioGuard AI
                Monitoring System

              </p>

            </div>

            {/* INPUT */}

            <div className="mt-8">

              <input
                type="password"
                placeholder="Enter Secure Access Code"
                value={accessCode}
                onChange={(e) =>
                  setAccessCode(
                    e.target.value
                  )
                }
                className="w-full px-5 py-4 rounded-2xl bg-black/40 border border-cyan-500/20 text-white outline-none focus:border-cyan-400 transition-all"
              />

              {/* ERROR */}

              {error && (

                <p className="text-red-400 text-sm mt-3 text-center">

                  {error}

                </p>
              )}

              {/* BUTTON */}

              <Button
                onClick={handleAccess}
                className="w-full mt-6 py-6 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-lg"
              >

                <Lock className="w-5 h-5 mr-2" />

                Unlock System

              </Button>

            </div>

          </div>

        </div>
      )}

      {/* =====================================
          NAVBAR
      ===================================== */}

      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-cyan-500/10 bg-[#020617]/80 backdrop-blur-xl">

        <div className="container mx-auto px-4 py-4">

          <div className="flex items-center justify-between">

            {/* LOGO */}

            <Link
              to="/"
              className="flex items-center gap-3 group"
            >

              <img
                src={logo}
                alt="HelioGuard AI"
                className="w-12 h-12 transition-transform duration-300 group-hover:scale-110"
              />

              <div>

                <h1 className="text-2xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">

                  HelioGuard AI

                </h1>

                <p className="text-xs text-gray-400 tracking-wide">

                  Space Intelligence System

                </p>

              </div>

            </Link>

            {/* DESKTOP MENU */}

            <div className="hidden lg:flex items-center gap-2">

              {navLinks.map((link) => (

                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-5 py-2 rounded-xl text-sm font-medium transition-all duration-300

                  ${
                    isActive(link.path)

                      ? "bg-cyan-500/20 text-cyan-400"

                      : "text-gray-300 hover:text-cyan-400 hover:bg-white/5"
                  }`}
                >

                  {link.label}

                  {isActive(link.path) && (

                    <span className="absolute left-3 right-3 bottom-0 h-[2px] rounded-full bg-cyan-400"></span>
                  )}

                </Link>
              ))}

            </div>

            {/* RIGHT SECTION */}

            <div className="flex items-center gap-3">

              {/* ACCESS STATUS */}

              <Button
                className={`hidden md:flex rounded-full px-5 py-5 font-semibold

                ${
                  accessGranted

                    ? "bg-green-500 hover:bg-green-400"

                    : "bg-red-500 hover:bg-red-400"
                }

                text-white`}
              >

                <ShieldCheck className="w-4 h-4 mr-2" />

                {
                  accessGranted

                    ? "Access Granted"

                    : "System Locked"
                }

              </Button>

              {/* MOBILE BUTTON */}

              <Button
                variant="outline"
                size="icon"
                className="lg:hidden rounded-full border-cyan-500/30 bg-black/30 text-white"
                onClick={() =>
                  setMobileMenuOpen(
                    !mobileMenuOpen
                  )
                }
              >

                {mobileMenuOpen

                  ? <X className="w-5 h-5" />

                  : <Menu className="w-5 h-5" />
                }

              </Button>

            </div>

          </div>

          {/* MOBILE MENU */}

          {mobileMenuOpen && (

            <div className="lg:hidden mt-5 bg-[#07111f]/95 border border-cyan-500/10 rounded-3xl p-5 backdrop-blur-xl">

              {navLinks.map((link) => (

                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() =>
                    setMobileMenuOpen(
                      false
                    )
                  }
                  className={`block px-5 py-4 rounded-2xl mb-2 transition-all duration-300

                  ${
                    isActive(link.path)

                      ? "bg-cyan-500/20 text-cyan-400 font-semibold"

                      : "text-gray-300 hover:bg-white/5 hover:text-cyan-400"
                  }`}
                >

                  {link.label}

                </Link>
              ))}

            </div>
          )}

        </div>

      </nav>

    </>
  );
};

export default Navbar;