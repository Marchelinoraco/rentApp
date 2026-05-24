import { useCallback, useMemo } from 'react';
import { BrowserRouter, Link, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  CalendarDays,
  Car,
  CheckCircle2,
  Clock,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Star,
} from 'lucide-react';
import { Layout } from '@/components/layout';
import { FilterPanel, SearchBar, SortControls, VehicleGrid } from '@/components/vehicle';
import { BookingForm } from '@/components/booking';
import { ToastContainer } from '@/components/ui/Toast';
import { MOCK_TESTIMONIALS } from '@/data/testimonials';
import { useAppStore } from '@/store/useAppStore';
import type { Vehicle, VehicleFilters } from '@/types/vehicle';
import { filterVehicles, sortVehicles } from '@/utils/filtering';
import { AnimatedSection, StaggerContainer } from '@/components/ui/AnimatedSection';
import { PageTransition } from '@/components/ui/PageTransition';
import { useCountUpOnScroll } from '@/hooks/useCountUp';

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value);

const normalizeVehicleFilters = (filters: VehicleFilters): VehicleFilters => {
  const normalized: VehicleFilters = {};

  if (filters.category?.length) {
    normalized.category = filters.category;
  }

  if (filters.priceRange) {
    normalized.priceRange = filters.priceRange;
  }

  if (filters.availability === true) {
    normalized.availability = true;
  }

  const searchQuery = filters.searchQuery?.trim();
  if (searchQuery) {
    normalized.searchQuery = searchQuery;
  }

  return normalized;
};

function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <section className="relative isolate overflow-hidden border-b border-zinc-800 bg-zinc-950 text-white py-16 lg:py-24">
      {/* Dynamic Animated Gradient Header Background */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(135deg,#030712_0%,#0f172a_50%,#0c4a6e_100%)] opacity-95" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />

      {/* Subtle Glow Circle */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 -z-10 w-96 h-96 bg-cyan-500/10 rounded-full filter blur-[120px]" />

      <div className="container mx-auto grid gap-8 px-4 lg:grid-cols-[1fr_auto] lg:items-end">
        <AnimatedSection animation="slide-right" className="space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest text-cyan-400 bg-cyan-500/10 border border-cyan-500/20">
            {eyebrow}
          </span>
          <h1 className="text-3xl font-black leading-tight text-white md:text-5xl lg:text-6xl tracking-tight max-w-4xl">
            {title}
          </h1>
          <p className="max-w-2xl text-sm md:text-base leading-relaxed text-zinc-400">
            {description}
          </p>
        </AnimatedSection>

        <AnimatedSection
          animation="scale-up"
          delay={150}
          className="hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 text-right shadow-2xl backdrop-blur-md lg:block min-w-[240px]"
        >
          <p className="text-[10px] font-black uppercase tracking-widest text-cyan-400">
            Our Rentcar
          </p>
          <p className="mt-1.5 text-base font-black text-white">Balikpapan - IKN</p>
          <p className="mt-2 text-xs text-zinc-500 font-medium">Siap jalan setiap hari</p>
        </AnimatedSection>
      </div>
    </section>
  );
}

function StatCounterCard({
  label,
  targetValue,
  prefix = '',
  suffix = '',
  duration = 1500,
}: {
  label: string;
  targetValue: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}) {
  const { ref, value } = useCountUpOnScroll(targetValue, { duration });
  return (
    <div ref={ref as any} className="glass-card rounded-2xl p-5 border border-white/[0.04]">
      <p className="text-[10px] font-black uppercase tracking-wider text-zinc-400">{label}</p>
      <p className="mt-2 text-xl font-black text-white">
        {prefix}
        {value.toLocaleString('id-ID')}
        {suffix}
      </p>
    </div>
  );
}

function HomePage() {
  const navigate = useNavigate();
  const vehicles = useAppStore((state) => state.vehicles);
  const featuredVehicles = vehicles.slice(0, 4);
  const lowestRate = Math.min(...vehicles.map((vehicle) => vehicle.dailyRate));
  const heroVehicles = useMemo(() => {
    const selectedVehicles = ['Innova Zenix Q', 'Alphard', 'Fortuner TRD/GR']
      .map((name) => vehicles.find((vehicle) => vehicle.name === name))
      .filter((vehicle): vehicle is Vehicle => Boolean(vehicle));

    return selectedVehicles.length > 0 ? selectedVehicles : vehicles.slice(0, 1);
  }, [vehicles]);
  const vipCount = vehicles.filter((vehicle) => vehicle.category === 'luxury').length;

  const favoriteRoutes = [
    {
      title: 'Bandara SAMS Sepinggan',
      meta: 'Antar Jemput Cepat',
      time: '15-25 menit',
      body: 'Layanan antar jemput praktis untuk tamu dinas, keluarga, maupun perjalanan bisnis langsung dari bandara.',
    },
    {
      title: 'Balikpapan - IKN Nusantara',
      meta: 'Perjalanan Utama',
      time: '2-3 jam',
      body: 'Pilihan unit SUV premium dan MPV tangguh untuk menunjang akses operasional ke kawasan Ibu Kota Nusantara.',
    },
    {
      title: 'Dalam Kota Balikpapan',
      meta: 'Mobilitas Fleksibel',
      time: 'Fleksibel',
      body: 'Unit terawat yang nyaman untuk kebutuhan harian, pariwisata kuliner, meeting korporat, maupun urusan keluarga.',
    },
  ];

  return (
    <PageTransition>
      {/* HERO SECTION */}
      <section className="relative isolate overflow-hidden bg-slate-950 text-white min-h-[750px] flex items-center">
        {/* Animated fluid gradient backdrop */}
        <div className="absolute inset-0 -z-10 animated-gradient-bg opacity-75" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-slate-950 to-transparent" />

        {/* Floating particles decoration */}
        <div className="decor-dot-container">
          <div className="decor-dot" style={{ top: '20%', left: '15%', animationDelay: '0s' }} />
          <div className="decor-dot" style={{ top: '60%', left: '8%', animationDelay: '2s' }} />
          <div className="decor-dot" style={{ top: '40%', left: '85%', animationDelay: '4s' }} />
          <div className="decor-dot" style={{ top: '15%', left: '75%', animationDelay: '1s' }} />
        </div>

        <div className="container relative mx-auto px-4 py-16 lg:py-24">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
            {/* Left Column Content */}
            <AnimatedSection animation="slide-right" className="max-w-3xl space-y-6 z-20">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest text-cyan-400 bg-cyan-500/10 border border-cyan-500/20">
                RENTAL MOBIL PREMIUM BALIKPAPAN
              </span>
              <h1 className="text-4xl font-black leading-[1.1] text-white md:text-6xl lg:text-7xl tracking-tight">
                Armada Premium, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500">
                  Perjalanan Tenang.
                </span>
              </h1>
              <p className="text-base md:text-lg leading-relaxed text-zinc-300 max-w-xl">
                Sewa mobil harian terpercaya untuk pariwisata, perjalanan bisnis, akses bandara,
                maupun kunjungan ke kawasan IKN Nusantara. Dilengkapi opsi sewa lepas kunci atau
                dengan driver profesional.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link
                  to="/vehicles"
                  className="inline-flex min-h-[50px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 px-6 py-3 text-sm font-black uppercase tracking-wider text-slate-950 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-400/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 glow-cyan-btn"
                >
                  Lihat Katalog Mobil
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <div className="relative min-h-[50px] w-full sm:w-[220px]">
                  {heroVehicles.map((vehicle, index) => (
                    <Link
                      key={vehicle.id}
                      to={`/booking?vehicle=${vehicle.id}`}
                      className="hero-rotator-item absolute inset-0 inline-flex min-h-[50px] items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-6 py-3 text-sm font-bold text-white transition-all duration-300 hover:bg-white/[0.08] hover:border-white/20"
                      style={{ animationDelay: `${index * 4}s` }}
                    >
                      Sewa {vehicle.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Statistics Grid */}
              <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-6">
                <StatCounterCard
                  label="Armada Pilihan"
                  targetValue={vehicles.length}
                  suffix=" Unit"
                />
                <StatCounterCard
                  label="Mulai Dari"
                  targetValue={lowestRate / 1000}
                  prefix="Rp "
                  suffix="rb"
                />
                <StatCounterCard label="Kelas VIP" targetValue={vipCount} suffix=" Pilihan" />
                <div className="glass-card rounded-2xl p-5 border border-white/[0.04] flex flex-col justify-center">
                  <p className="text-[10px] font-black uppercase tracking-wider text-zinc-400">
                    Wilayah Dinas
                  </p>
                  <p className="mt-2 text-sm font-black text-white leading-tight">
                    Balikpapan & IKN
                  </p>
                </div>
              </StaggerContainer>
            </AnimatedSection>

            {/* Right Column Image */}
            <AnimatedSection
              animation="scale-up"
              delay={200}
              className="relative w-full h-[420px] lg:h-[620px] z-10"
            >
              {/* Glow backdrop behind car */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-fuchsia-600/10 rounded-full filter blur-[80px]" />

              {heroVehicles.map((vehicle, index) => (
                <img
                  key={vehicle.id}
                  src={vehicle.images[0]}
                  alt={vehicle.name}
                  className="hero-rotator-item absolute inset-0 h-full w-full scale-125 object-contain drop-shadow-[0_20px_50px_rgba(6,182,212,0.15)] lg:scale-[1.35]"
                  style={{ animationDelay: `${index * 4}s` }}
                />
              ))}

              <div className="absolute bottom-8 left-6 max-w-[290px] rounded-2xl border border-white/[0.06] bg-slate-950/80 p-5 shadow-2xl backdrop-blur-md md:left-8">
                <p className="text-[11px] font-black uppercase tracking-wider text-cyan-400">
                  Rekomendasi Hari Ini
                </p>
                <div className="relative mt-1.5 min-h-[78px]">
                  {heroVehicles.map((vehicle, index) => (
                    <div
                      key={vehicle.id}
                      className="hero-rotator-item absolute inset-0"
                      style={{ animationDelay: `${index * 4}s` }}
                    >
                      <p className="text-lg font-black text-white">{vehicle.name}</p>
                      <p className="mt-1 text-sm text-zinc-400 font-semibold">
                        {formatCurrency(vehicle.dailyRate)} / hari
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* CORE BENEFITS SECTION */}
      <section className="relative border-b border-zinc-900 bg-slate-950 py-16">
        <div className="container mx-auto px-4">
          <StaggerContainer className="grid gap-6 lg:grid-cols-3">
            {[
              {
                icon: ShieldCheck,
                label: 'Kondisi Prima',
                value: 'Siap Tempuh & Terawat',
                body: 'Setiap unit menjalani inspeksi menyeluruh sebelum diserahkan ke tangan Anda demi keselamatan optimal.',
              },
              {
                icon: CalendarDays,
                label: 'Skema Fleksibel',
                value: 'Sewa Harian / Bulanan',
                body: 'Pilihan sewa lepas kunci, dengan driver, hingga kontrak bulanan perusahaan dengan administrasi ringkas.',
              },
              {
                icon: MessageCircle,
                label: 'Respons Cepat',
                value: 'Layanan Aktif 24/7',
                body: 'Tim admin kami selalu siaga membalas pertanyaan dan mengonfirmasi pemesanan Anda dengan cepat via WhatsApp.',
              },
            ].map((item, idx) => (
              <div
                key={item.label}
                className="premium-card p-6 flex flex-col justify-between"
                style={{ transitionDelay: `${idx * 100}ms` }}
              >
                <div>
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 mb-5">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-zinc-400">
                    {item.label}
                  </p>
                  <p className="mt-2 text-lg font-black text-white">{item.value}</p>
                  <p className="mt-3 text-sm text-zinc-400 leading-relaxed">{item.body}</p>
                </div>
              </div>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* SERVICES AREA SECTION */}
      <section className="bg-slate-900/40 py-20 border-b border-zinc-900">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <AnimatedSection animation="slide-right" className="space-y-5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest text-cyan-400 bg-cyan-500/10 border border-cyan-500/20">
                📍 Area Layanan Utama
              </span>
              <h2 className="text-3xl font-black leading-tight text-white md:text-4xl lg:text-5xl">
                Menghubungkan Kota, Bandara, hingga IKN Nusantara.
              </h2>
              <p className="text-zinc-400 leading-relaxed text-sm md:text-base">
                OUR RENTCAR berbasis strategis di Balikpapan, memudahkan mobilisasi cepat untuk
                antar jemput bandara, operasional perkantoran, dinas pemerintahan, hingga perjalanan
                logistik ke Ibu Kota Nusantara.
              </p>

              <div className="grid gap-3.5 sm:grid-cols-2 pt-2">
                {[
                  'Driver Profesional',
                  'Armada SUV VIP',
                  'Sewa Lepas Kunci',
                  'Layanan Emergency Call',
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2.5 text-sm font-bold text-zinc-300"
                  >
                    <div className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400">
                      <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                    </div>
                    {item}
                  </div>
                ))}
              </div>
            </AnimatedSection>

            {/* Favorite Routes */}
            <StaggerContainer className="grid gap-4">
              {favoriteRoutes.map((route, index) => (
                <div
                  key={route.title}
                  className="premium-card p-5 hover:border-cyan-500/40"
                  style={{ animationDelay: `${index * 90}ms` }}
                >
                  <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-cyan-400">
                        <MapPin className="h-3.5 w-3.5 text-cyan-400" aria-hidden="true" />
                        {route.meta}
                      </div>
                      <h3 className="text-lg font-black text-white">{route.title}</h3>
                      <p className="text-xs text-zinc-400 leading-relaxed">{route.body}</p>
                    </div>

                    <div className="rounded-xl border border-zinc-800 bg-slate-950/80 px-4 py-3 min-w-[120px] text-left sm:text-right">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-500 sm:justify-end">
                        <Clock className="h-3.5 w-3.5 text-zinc-500" aria-hidden="true" />
                        Estimasi
                      </div>
                      <p className="mt-1 text-sm font-black text-white">{route.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </StaggerContainer>
          </div>
        </div>
      </section>

      {/* THREE STEP BOOKING */}
      <section className="bg-slate-950 py-20 border-b border-zinc-900">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <AnimatedSection animation="slide-right" className="space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest text-cyan-400 bg-cyan-500/10 border border-cyan-500/20">
                📝 Alur Pemesanan
              </span>
              <h2 className="text-3xl font-black text-white md:text-4xl">
                Proses Sewa Mudah dalam 3 Langkah Praktis.
              </h2>
              <p className="text-zinc-400 text-sm md:text-base leading-relaxed">
                Tanpa birokrasi berbelit. Pilih mobil impian Anda, jadwalkan waktu penjemputan, dan
                tim kami akan segera memproses administrasi sewa untuk Anda.
              </p>
            </AnimatedSection>

            <StaggerContainer className="grid gap-5 md:grid-cols-3">
              {[
                [
                  '01',
                  'Pilih Armada',
                  'Tentukan jenis mobil, kapasitas tempat duduk, dan harga harian yang paling pas dengan rencana perjalanan Anda.',
                ],
                [
                  '02',
                  'Isi Form Jadwal',
                  'Masukkan tanggal durasi sewa, kebutuhan supir, serta informasi kontak dasar untuk kelancaran administrasi.',
                ],
                [
                  '03',
                  'Konfirmasi & Pick-up',
                  'Admin kami segera mengonfirmasi pesanan Anda via WhatsApp, dan mobil siap diantar ke titik ketersediaan.',
                ],
              ].map(([step, title, body], idx) => (
                <div
                  key={step}
                  className="premium-card p-5 space-y-4 hover:border-cyan-500/30"
                  style={{ animationDelay: `${idx * 120}ms` }}
                >
                  <span className="text-xs font-black text-cyan-400 block tracking-widest">
                    LANGKAH {step}
                  </span>
                  <h3 className="font-black text-white text-lg">{title}</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">{body}</p>
                </div>
              ))}
            </StaggerContainer>
          </div>
        </div>
      </section>

      {/* POPULAR VEHICLES SECTION */}
      <section className="bg-slate-900/20 py-20 border-b border-zinc-900">
        <div className="container mx-auto px-4">
          <AnimatedSection
            animation="fade-up"
            className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end"
          >
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest text-cyan-400 bg-cyan-500/10 border border-cyan-500/20">
                🚗 Katalog Terpopuler
              </span>
              <h2 className="text-3xl font-black text-white md:text-4xl">
                Pilihan Utama Pelanggan
              </h2>
              <p className="text-zinc-400 text-sm">
                Unit armada premium yang paling sering dipesan untuk kebutuhan dinas perkantoran
                maupun pariwisata.
              </p>
            </div>

            <Link
              to="/vehicles"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-zinc-800 bg-zinc-900/60 text-xs font-bold text-white hover:text-cyan-400 hover:border-cyan-500/30 transition-all duration-300"
            >
              Semua Kendaraan
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={100}>
            <VehicleGrid
              vehicles={featuredVehicles}
              onVehicleSelect={(vehicleId) => navigate(`/booking?vehicle=${vehicleId}`)}
            />
          </AnimatedSection>

          {/* QUICK CTA BOX */}
          <AnimatedSection
            animation="scale-up"
            delay={200}
            className="mt-14 rounded-2xl border border-white/[0.06] bg-slate-950 p-6 text-white shadow-2xl relative overflow-hidden md:p-10"
          >
            <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full filter blur-[100px]" />
            <div className="relative z-10 grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400">
                  Konfirmasi Cepat
                </span>
                <h2 className="text-2xl font-black text-white md:text-3xl">
                  Rencanakan Perjalanan Anda ke Balikpapan atau IKN Sekarang
                </h2>
                <p className="text-xs md:text-sm leading-relaxed text-zinc-400 max-w-2xl">
                  Konsultasikan kebutuhan tipe armada, ketersediaan jadwal kosong, maupun
                  kualifikasi supir dengan tim kami tanpa komitmen awal.
                </p>
              </div>

              <Link
                to="/booking"
                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 px-6 py-3 text-xs font-black uppercase tracking-wider text-slate-950 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] glow-cyan-btn"
              >
                Mulai Booking Sewa
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </PageTransition>
  );
}

function VehiclesPage() {
  const navigate = useNavigate();
  const filters = useAppStore((state) => state.filters);
  const sortOption = useAppStore((state) => state.sortOption);
  const allVehicles = useAppStore((state) => state.vehicles);
  const setFilters = useAppStore((state) => state.setFilters);
  const setSortOption = useAppStore((state) => state.setSortOption);

  const vehicles = useMemo(() => {
    return sortVehicles(filterVehicles(allVehicles, filters, []), sortOption);
  }, [allVehicles, filters, sortOption]);

  const handleSearch = useCallback(
    (searchQuery: string) => {
      const currentFilters = useAppStore.getState().filters;
      const nextFilters = normalizeVehicleFilters({
        ...currentFilters,
        searchQuery,
      });

      if (currentFilters.searchQuery === nextFilters.searchQuery) return;
      setFilters(nextFilters);
    },
    [setFilters]
  );

  const handleFilterChange = useCallback(
    (nextFilters: VehicleFilters) => {
      setFilters(normalizeVehicleFilters(nextFilters));
    },
    [setFilters]
  );

  return (
    <PageTransition>
      <PageHeader
        eyebrow="Katalog Sewa"
        title="Temukan Kendaraan Pilihan Anda"
        description="Bandingkan spesifikasi mobil, kapasitas penumpang, serta kalkulasi harga sewa harian yang transparan tanpa biaya tersembunyi."
      />
      <section className="bg-slate-950 py-12">
        <div className="container mx-auto px-4">
          {/* Quick stats counter */}
          <StaggerContainer className="mb-8 grid gap-4 grid-cols-2 md:grid-cols-3">
            <StatCounterCard
              label="Total Ketersediaan Armada"
              targetValue={allVehicles.length}
              suffix=" Unit"
            />
            <StatCounterCard
              label="Harga Terendah"
              targetValue={Math.min(...allVehicles.map((v) => v.dailyRate)) / 1000}
              prefix="Rp "
              suffix="rb / hari"
            />
            <StatCounterCard
              label="Hasil Pencarian"
              targetValue={vehicles.length}
              suffix=" Mobil"
            />
          </StaggerContainer>

          <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
            <AnimatedSection animation="slide-right" className="h-fit lg:sticky lg:top-28 z-20">
              <FilterPanel filters={filters} onFilterChange={handleFilterChange} />
            </AnimatedSection>

            <div className="space-y-6">
              <AnimatedSection
                animation="fade-up"
                className="glass-card rounded-2xl p-4 border border-white/[0.04]"
              >
                <SearchBar onSearch={handleSearch} initialValue={filters.searchQuery || ''} />
              </AnimatedSection>

              <AnimatedSection
                animation="fade-up"
                delay={50}
                className="glass-card rounded-2xl p-4 border border-white/[0.04]"
              >
                <SortControls
                  sortOption={sortOption}
                  onSortChange={setSortOption}
                  resultCount={vehicles.length}
                />
              </AnimatedSection>

              <div>
                <VehicleGrid
                  vehicles={vehicles}
                  onVehicleSelect={(vehicleId) => navigate(`/booking?vehicle=${vehicleId}`)}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}

function BookingPage() {
  const searchParams = new URLSearchParams(window.location.search);
  const vehicleId = searchParams.get('vehicle') || undefined;

  return (
    <PageTransition>
      <PageHeader
        eyebrow="Formulir Booking"
        title="Lengkapi Jadwal Sewa Kendaraan"
        description="Isi tanggal sewa, kebutuhan supir pendamping, dan rincian data diri untuk menghitung estimasi tagihan sewa."
      />
      <section className="bg-slate-950 py-12">
        <div className="container mx-auto grid gap-8 px-4 lg:grid-cols-[1fr_320px]">
          <AnimatedSection
            animation="slide-right"
            className="glass-card rounded-2xl p-5 md:p-8 border border-white/[0.04] shadow-2xl"
          >
            <BookingForm preselectedVehicleId={vehicleId} />
          </AnimatedSection>

          <AnimatedSection
            animation="scale-up"
            className="h-fit rounded-2xl border border-white/[0.06] bg-slate-950 p-6 text-white shadow-2xl lg:sticky lg:top-28"
          >
            <p className="text-[10px] font-black uppercase tracking-wider text-cyan-400">
              Konfirmasi Cepat
            </p>
            <h2 className="mt-2 text-xl font-black text-white">Butuh Bantuan Segera?</h2>
            <p className="mt-3 text-xs text-zinc-400 leading-relaxed">
              Hubungi layanan admin support kami secara langsung jika Anda menemui kendala pengisian
              formulir online atau butuh koordinasi khusus.
            </p>

            <a
              href="https://wa.me/628954052225577"
              className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 px-4 py-2.5 text-xs font-black uppercase tracking-wider text-slate-950 hover:scale-[1.02] transition-all duration-300 mt-5 glow-cyan-btn"
            >
              <MessageCircle className="h-4.5 w-4.5" aria-hidden="true" />
              Chat Admin WhatsApp
            </a>

            <div className="mt-6 space-y-3.5 border-t border-zinc-800 pt-6 text-xs text-zinc-400">
              {['Verifikasi KTP Cepat', 'Harga Final Transparan', 'Opsi Pengiriman Unit'].map(
                (item) => (
                  <div key={item} className="flex items-center gap-2.5 font-semibold text-zinc-300">
                    <div className="flex items-center justify-center w-5 h-5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                    </div>
                    <span>{item}</span>
                  </div>
                )
              )}
            </div>

            <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
              <p className="text-[10px] font-black uppercase tracking-wider text-zinc-500">
                Waktu Pelayanan Administrasi
              </p>
              <p className="mt-1 text-sm font-bold text-white">08:00 - 20:00 WITA</p>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </PageTransition>
  );
}

function TestimonialsPage() {
  return (
    <PageTransition>
      <PageHeader
        eyebrow="Testimoni"
        title="Ulasan Pelanggan OUR RENTCAR"
        description="Simak testimoni tulus dari jajaran direksi, dinas perkantoran pemerintahan, wisatawan keluarga, maupun perorangan yang telah menyewa armada kami."
      />
      <section className="bg-slate-950 py-12">
        <div className="container mx-auto px-4">
          <AnimatedSection
            animation="fade-up"
            className="mb-8 rounded-2xl border border-zinc-800 bg-slate-900/20 p-6"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-cyan-400">
                  Statistik Pelayanan
                </p>
                <p className="mt-1 text-xl font-black text-white">
                  Dipercaya oleh Ratusan Pelanggan
                </p>
              </div>
              <div className="flex gap-1 text-fuchsia-500">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} className="h-5 w-5 fill-current" />
                ))}
              </div>
            </div>
          </AnimatedSection>

          <StaggerContainer className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {MOCK_TESTIMONIALS.map((testimonial) => (
              <article
                key={testimonial.id}
                className="premium-card p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="mb-4 flex gap-0.5 text-fuchsia-500">
                    {Array.from({ length: testimonial.rating }).map((_, index) => (
                      <Star key={index} className="h-4.5 w-4.5 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed text-zinc-300">
                    "{testimonial.reviewText}"
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-zinc-800/80">
                  <p className="font-black text-white text-sm">{testimonial.customerName}</p>
                  <p className="text-xs text-zinc-500 font-bold mt-1 uppercase tracking-wider">
                    {testimonial.vehicleName}
                  </p>
                </div>
              </article>
            ))}
          </StaggerContainer>
        </div>
      </section>
    </PageTransition>
  );
}

function AboutPage() {
  return (
    <PageTransition>
      <PageHeader
        eyebrow="Tentang Kami"
        title="Mitra Perjalanan Anda di Kalimantan Timur"
        description="Fokus utama kami adalah menyediakan armada yang selalu bersih, wangi, dalam performa mesin optimal, dengan dukungan administrasi pemesanan termudah."
      />
      <section className="bg-slate-950 py-16">
        <div className="container mx-auto max-w-5xl px-4">
          <StaggerContainer className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: ShieldCheck,
                title: 'Transparansi Harga',
                body: 'Rincian tarif sewa harian tertera di depan tanpa ada biaya siluman saat pengembalian unit.',
              },
              {
                icon: Car,
                title: 'Kondisi Armada Prima',
                body: 'Perawatan berkala di bengkel resmi menjamin performa mesin selalu optimal saat penjemputan.',
              },
              {
                icon: Clock,
                title: 'Opsi Sewa Fleksibel',
                body: 'Tersedia pilihan sewa lepas kunci untuk privasi maksimal, maupun opsi dengan supir profesional.',
              },
            ].map((item) => (
              <div key={item.title} className="premium-card p-6 space-y-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                  <item.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <h2 className="font-black text-white text-lg">{item.title}</h2>
                <p className="text-xs text-zinc-400 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </StaggerContainer>

          <AnimatedSection
            animation="scale-up"
            delay={200}
            className="mt-10 rounded-2xl border border-zinc-800 bg-slate-900/20 p-6 md:p-10 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-84 h-84 bg-cyan-500/5 rounded-full filter blur-[100px]" />
            <div className="relative z-10 grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
              <div className="space-y-2">
                <h2 className="text-xl font-black text-white md:text-2xl">
                  Armada Siap untuk Segala Rencana Kunjungan Dinas & VIP
                </h2>
                <p className="text-xs text-zinc-400 leading-relaxed max-w-2xl">
                  Pilih tipe mobil yang paling sesuai dengan kebutuhan kapasitas barang bawaan Anda
                  maupun kesesuaian anggaran pengeluaran.
                </p>
              </div>
              <Link
                to="/vehicles"
                className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 px-5 py-2.5 text-xs font-black uppercase tracking-wider text-slate-950 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] glow-cyan-btn"
              >
                Lihat Katalog Armada
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </PageTransition>
  );
}

function ContactPage() {
  return (
    <PageTransition>
      <PageHeader
        eyebrow="Informasi Kontak"
        title="Konsultasikan Rencana Perjalanan Anda"
        description="Tim customer care kami siap membantu memberikan rekomendasi mobil yang paling ideal dengan rencana perjalanan Anda."
      />
      <section className="bg-slate-950 py-16">
        <div className="container mx-auto max-w-5xl px-4">
          <StaggerContainer className="grid gap-6 md:grid-cols-3">
            <a
              href="tel:+628954052225577"
              className="premium-card p-6 space-y-4 hover:border-cyan-500/30"
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                <Phone className="h-6 w-6" />
              </div>
              <div>
                <p className="font-black text-white text-base">Saluran Telepon</p>
                <p className="mt-1.5 text-xs text-zinc-400 font-semibold">+62 895-4052-225577</p>
              </div>
            </a>

            <a
              href="https://wa.me/628954052225577"
              className="premium-card p-6 space-y-4 hover:border-cyan-500/30"
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                <MessageCircle className="h-6 w-6" />
              </div>
              <div>
                <p className="font-black text-white text-base">WhatsApp Booking</p>
                <p className="mt-1.5 text-xs text-zinc-400 font-semibold">
                  Tanya Ketersediaan Cepat
                </p>
              </div>
            </a>

            <div className="premium-card p-6 space-y-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                <MapPin className="h-6 w-6" />
              </div>
              <div>
                <p className="font-black text-white text-base">Area Pelayanan</p>
                <p className="mt-1.5 text-xs text-zinc-400 font-semibold">Balikpapan & Akses IKN</p>
              </div>
            </div>
          </StaggerContainer>

          <AnimatedSection
            animation="fade-up"
            delay={200}
            className="mt-10 rounded-2xl border border-zinc-800 bg-slate-900/20 p-6 md:p-8"
          >
            <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
              <div className="space-y-1.5">
                <h2 className="text-lg font-black text-white md:text-xl">
                  Siap Memulai Sewa Mobil?
                </h2>
                <p className="text-xs text-zinc-400 leading-relaxed max-w-2xl">
                  Pilih unit dari katalog armada online kami atau kirim pesan singkat untuk
                  berkonsultasi mengenai kebutuhan perjalanan Anda.
                </p>
              </div>
              <Link
                to="/vehicles"
                className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 px-5 py-2.5 text-xs font-black uppercase tracking-wider text-slate-950 transition-all duration-300 hover:scale-[1.02]"
              >
                Lihat Katalog Armada
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </PageTransition>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/vehicles" element={<VehiclesPage />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/testimonials" element={<TestimonialsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
