import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Car } from 'lucide-react';

/**
 * Header component with logo, navigation, and mobile menu
 * Implements responsive navigation with hamburger menu on mobile
 * Includes proper ARIA labels and keyboard navigation
 * Requirements: 8.1
 */
export const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const isActivePath = (path: string): boolean => {
    return location.pathname === path;
  };

  const navLinks = [
    { path: '/', label: 'Beranda' },
    { path: '/vehicles', label: 'Kendaraan' },
    { path: '/booking', label: 'Booking' },
    { path: '/testimonials', label: 'Testimoni' },
    { path: '/about', label: 'Tentang' },
    { path: '/contact', label: 'Kontak' },
  ];

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'border-b border-cyan-500/20 bg-slate-950/80 shadow-2xl shadow-cyan-950/10 backdrop-blur-xl py-3' 
          : 'border-b border-transparent bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14 md:h-16">
          <Link
            to="/"
            className="flex items-center gap-3 text-white transition-all duration-300 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-950 rounded-md px-2 py-1"
            aria-label="Our Rentcar - Beranda"
            onClick={closeMobileMenu}
          >
            <div className="flex items-center gap-2">
              <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-fuchsia-600 p-0.5 shadow-lg shadow-cyan-500/25">
                <div className="flex items-center justify-center w-full h-full rounded-[10px] bg-slate-950">
                  <Car className="h-5 w-5 text-cyan-400" />
                </div>
              </div>
              <div>
                <span className="text-lg font-black tracking-wider text-white uppercase block leading-none">
                  OUR <span className="text-cyan-400">RENT</span>CAR
                </span>
                <span className="text-[9px] font-bold tracking-widest text-zinc-400 uppercase block mt-0.5 leading-none">
                  Balikpapan - IKN
                </span>
              </div>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1.5" aria-label="Navigasi utama">
            {navLinks.map((link) => {
              const active = isActivePath(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-950 ${
                    active
                      ? 'bg-gradient-to-tr from-cyan-500/20 to-fuchsia-500/10 text-cyan-300 border border-cyan-500/30'
                      : 'text-zinc-300 hover:text-white hover:bg-white/[0.04] border border-transparent'
                  }`}
                  aria-current={active ? 'page' : undefined}
                >
                  {link.label}
                  {active && (
                    <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-md shadow-cyan-400/80 animate-pulse" />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-4 lg:flex">
            <a
              href="tel:+628954052225577"
              className="inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold text-zinc-300 transition-colors hover:text-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-950"
            >
              <Phone className="h-4 w-4 text-cyan-400" aria-hidden="true" />
              +62 895-4052-225577
            </a>
            <Link
              to="/booking"
              className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 px-5 py-2.5 text-xs font-black uppercase tracking-wider text-slate-950 hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300 active:scale-95 glow-cyan-btn"
            >
              Mulai Sewa
            </Link>
          </div>

          <button
            type="button"
            className="lg:hidden inline-flex items-center justify-center p-2 rounded-xl text-zinc-300 hover:text-white hover:bg-white/[0.08] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-cyan-400 min-h-[44px] min-w-[44px]"
            onClick={toggleMobileMenu}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMobileMenuOpen ? 'Tutup menu' : 'Buka menu'}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" aria-hidden="true" />
            ) : (
              <Menu className="w-6 h-6" aria-hidden="true" />
            )}
          </button>
        </div>

        {/* Mobile Menu with slide-down glass animation */}
        <div
          id="mobile-menu"
          className={`lg:hidden overflow-hidden transition-all duration-500 ease-in-out ${
            isMobileMenuOpen ? 'max-h-[420px] opacity-100 mt-4' : 'max-h-0 opacity-0'
          }`}
        >
          <nav
            className="rounded-2xl border border-cyan-500/20 bg-slate-950/95 p-3 shadow-2xl backdrop-blur-2xl"
            aria-label="Navigasi mobile"
          >
            <div className="flex flex-col gap-1.5">
              {navLinks.map((link) => {
                const active = isActivePath(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-4 py-3 rounded-xl text-base font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-900 min-h-[44px] flex items-center justify-between ${
                      active
                        ? 'bg-gradient-to-r from-cyan-500/20 to-fuchsia-500/10 text-cyan-300 border border-cyan-500/30'
                        : 'text-zinc-300 hover:text-white hover:bg-white/[0.04] border border-transparent'
                    }`}
                    onClick={closeMobileMenu}
                    aria-current={active ? 'page' : undefined}
                  >
                    <span>{link.label}</span>
                    {active && <span className="w-2 h-2 rounded-full bg-cyan-400" />}
                  </Link>
                );
              })}
              <div className="h-px bg-zinc-800 my-2" />
              <a
                href="tel:+628954052225577"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold text-zinc-300 hover:text-white hover:bg-white/[0.04] min-h-[44px]"
              >
                <Phone className="h-5 w-5 text-cyan-400" />
                <span>+62 895-4052-225577</span>
              </a>
              <Link
                to="/booking"
                className="flex items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 px-4 py-3.5 text-base font-black uppercase tracking-wider text-slate-950 mt-1"
                onClick={closeMobileMenu}
              >
                Mulai Sewa Mobil
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};
