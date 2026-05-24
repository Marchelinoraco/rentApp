import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Share2, Car } from 'lucide-react';
import { AnimatedSection } from '@/components/ui/AnimatedSection';

/**
 * Footer component with contact info and social links
 * Requirements: 6.3
 */
export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-cyan-500/10 bg-slate-950 text-slate-300 overflow-hidden">
      {/* Subtle bottom glow decorative elements */}
      <div className="absolute bottom-0 right-1/4 -z-10 w-96 h-96 bg-cyan-500/5 rounded-full filter blur-[100px]" />
      <div className="absolute top-0 left-1/4 -z-10 w-96 h-96 bg-fuchsia-500/5 rounded-full filter blur-[100px]" />
      
      {/* Modern Gradient Separator Line */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />

      <div className="container mx-auto px-4 py-12 md:py-16">
        <AnimatedSection animation="fade-up" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Section */}
          <div className="space-y-5">
            <Link to="/" className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-fuchsia-600 p-0.5 shadow-lg shadow-cyan-500/25">
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
            </Link>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Penyedia layanan rental mobil premium terpercaya di Balikpapan dan kawasan Ibu Kota Nusantara (IKN). Mengutamakan kenyamanan, kualitas armada, dan kemudahan proses sewa.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-black uppercase tracking-wider text-white">Navigasi</h3>
            <nav aria-label="Footer navigasi">
              <ul className="space-y-2.5">
                {[
                  { to: '/', label: 'Beranda' },
                  { to: '/vehicles', label: 'Kendaraan' },
                  { to: '/booking', label: 'Booking Sewa' },
                  { to: '/testimonials', label: 'Testimoni Pelanggan' },
                  { to: '/about', label: 'Tentang Kami' },
                  { to: '/contact', label: 'Kontak Hubungi' },
                ].map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-sm text-zinc-400 hover:text-cyan-400 transition-colors duration-200 focus:outline-none focus:underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-black uppercase tracking-wider text-white">Hubungi Kami</h3>
            <ul className="space-y-3.5">
              <li className="flex items-start gap-3.5">
                <div className="mt-1 flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 text-cyan-400">
                  <Phone className="w-4 h-4" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Telepon & WA</p>
                  <a
                    href="tel:+628954052225577"
                    className="text-sm font-semibold text-white hover:text-cyan-400 transition-colors focus:outline-none"
                  >
                    +62 895-4052-225577
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3.5">
                <div className="mt-1 flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 text-cyan-400">
                  <Mail className="w-4 h-4" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Email</p>
                  <a
                    href="mailto:info@ourrentcar.com"
                    className="text-sm font-semibold text-white hover:text-cyan-400 transition-colors focus:outline-none"
                  >
                    info@ourrentcar.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3.5">
                <div className="mt-1 flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 text-cyan-400">
                  <MapPin className="w-4 h-4" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Alamat Layanan</p>
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    Balikpapan, Kalimantan Timur — Akses Utama menuju IKN Nusantara
                  </p>
                </div>
              </li>
            </ul>
          </div>

          {/* Social Media & Business Hours */}
          <div className="space-y-5">
            <div className="space-y-3">
              <h3 className="text-sm font-black uppercase tracking-wider text-white">Media Sosial</h3>
              <div className="flex gap-2.5">
                {['Facebook', 'Instagram', 'TikTok'].map((social) => (
                  <a
                    key={social}
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-all duration-300 hover:-translate-y-0.5 min-h-[44px] min-w-[44px]"
                    aria-label={social}
                  >
                    <Share2 className="w-4 h-4" aria-hidden="true" />
                  </a>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-white mb-1.5">Jam Layanan</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Setiap Hari: 08:00 - 20:00 WITA<br />
                Pemesanan Online: 24 Jam Nonstop
              </p>
            </div>
          </div>
        </AnimatedSection>

        {/* Bottom Bar with smooth fade-in */}
        <AnimatedSection
          animation="fade-in"
          delay={200}
          className="mt-12 pt-8 border-t border-zinc-800/80 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left"
        >
          <p className="text-xs text-zinc-500">
            &copy; {currentYear} OUR RENTCAR. Seluruh hak cipta dilindungi undang-undang.
          </p>
          <div className="flex gap-6 text-xs text-zinc-500">
            <Link to="/about" className="hover:text-cyan-400 transition-colors">
              Syarat & Ketentuan
            </Link>
            <Link to="/about" className="hover:text-cyan-400 transition-colors">
              Kebijakan Privasi
            </Link>
          </div>
        </AnimatedSection>
      </div>
    </footer>
  );
};
