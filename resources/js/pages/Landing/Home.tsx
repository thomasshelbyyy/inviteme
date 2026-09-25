import { Head, Link } from '@inertiajs/react'
import {
    Heart,
    Palette,
    Users,
    Link as LinkIcon,
    CheckCircle,
    Star,
    ChevronDown,
    Sparkles,
    Zap,
    Shield,
    ArrowRight,
    Play,
    Check,
} from 'lucide-react'
import AppLayout from '@/layouts/AppLayout'

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const features = [
    {
        icon: Palette,
        title: 'Drag & Drop Editor',
        description: 'Susun blok konten sesukamu. Pindahkan, hapus, duplikasi â€” semua dengan gerakan sederhana.',
    },
    {
        icon: Sparkles,
        title: 'Template Premium',
        description: 'Pilih dari koleksi desain elegan yang telah dikurasi tim kami. Edit hingga jadi milikmu.',
    },
    {
        icon: Users,
        title: 'Manajemen Tamu',
        description: 'Kelola daftar tamu, kirim link personal, dan pantau status RSVP secara real-time.',
    },
    {
        icon: LinkIcon,
        title: 'Link Personal Tamu',
        description: 'Setiap tamu mendapat link unik. Sapaan personal otomatis tampil saat mereka membuka undangan.',
    },
    {
        icon: Zap,
        title: 'Responsif & Cepat',
        description: 'Dioptimalkan untuk mobile. Undanganmu terlihat sempurna di HP dengan koneksi lambat sekalipun.',
    },
    {
        icon: Shield,
        title: 'Aman & Terpercaya',
        description: 'Data tamu dilindungi. Token unik mencegah akses tidak sah ke daftar tamu pribadimu.',
    },
]

const steps = [
    {
        step: '01',
        title: 'Pilih atau Mulai dari Kosong',
        description: 'Mulai dari template elegan atau kanvas kosong â€” bebas sesuai imajinasimu.',
    },
    {
        step: '02',
        title: 'Desain Sesukamu',
        description: 'Drag & drop blok konten. Atur foto, warna, font, dan teks dengan mudah.',
    },
    {
        step: '03',
        title: 'Kelola Tamu & RSVP',
        description: 'Tambahkan daftar tamu, generate link personal, dan pantau konfirmasi kehadiran.',
    },
    {
        step: '04',
        title: 'Publish & Bagikan',
        description: 'Preview gratis tanpa batas. Bayar hanya saat kamu yakin dan siap mempublikasikannya.',
    },
]

const testimonials = [
    {
        name: 'Anisa & Reza',
        date: 'November 2026',
        text: 'Desainnya cantik banget! Tamu-tamu kami terkesima saat buka undangannya. Prosesnya gampang banget, nggak perlu skill desain sama sekali.',
        rating: 5,
    },
    {
        name: 'Dewi & Bagas',
        date: 'Oktober 2026',
        text: 'Fitur link personal buat tiap tamu itu keren banget. Jadi berasa lebih personal. RSVP-nya juga mudah dipantau dari dashboard.',
        rating: 5,
    },
    {
        name: 'Sari & Fajar',
        date: 'September 2026',
        text: 'Awalnya ragu, tapi setelah coba gratis langsung jatuh cinta. Bayar pas udah puas â€” itu yang paling saya suka dari InviteMe.',
        rating: 5,
    },
]

const faqs = [
    {
        question: 'Apakah benar-benar gratis?',
        answer: 'Ya! Kamu bisa mendesain, mengedit, dan preview undangan tanpa biaya apapun. Kamu hanya membayar saat ingin mempublikasikan undangan agar bisa diakses oleh tamu.',
    },
    {
        question: 'Berapa harga untuk publish?',
        answer: 'Harga publish mulai dari Rp 49.000 untuk paket Basic. Semua harga bisa dilihat di halaman Billing setelah kamu login. Tidak ada biaya tersembunyi.',
    },
    {
        question: 'Bagaimana link personal tamu bekerja?',
        answer: 'Setiap tamu mendapat URL unik yang mengandung token acak. Saat tamu membuka link tersebut, nama mereka otomatis tampil di sapaan undangan.',
    },
    {
        question: 'Apakah undangan bisa diedit setelah dipublish?',
        answer: 'Ya, undangan tetap bisa diedit setelah dipublish. Perubahan akan langsung terlihat oleh semua tamu yang mengakses link undangan.',
    },
    {
        question: 'Apakah mendukung domain kustom?',
        answer: 'Saat ini URL undangan menggunakan format inviteme.id/nama-kamu. Dukungan domain kustom sedang dalam pengembangan dan akan tersedia sebagai fitur premium.',
    },
]

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function Home() {
    return (
        <AppLayout>
            <Head title="Bikin Undangan Pernikahan Digital â€” Gratis" />

            {/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ HERO â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
            <section className="relative overflow-hidden">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#f2e4d8] via-[#fdf8f3] to-white" />

                {/* Decorative orbs */}
                <div className="absolute top-20 right-10 h-72 w-72 rounded-full bg-gradient-to-br from-[#c8956c]/30 to-[#8b5e5e]/20 blur-3xl" />
                <div className="absolute -bottom-10 left-10 h-64 w-64 rounded-full bg-gradient-to-tr from-rose-200/40 to-pink-100/30 blur-3xl" />

                <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
                    <div className="text-center">
                        {/* Badge */}
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#c8956c]/30 bg-white/80 px-4 py-1.5 shadow-sm backdrop-blur-sm">
                            <Sparkles className="h-3.5 w-3.5 text-[#c8956c]" />
                            <span className="text-xs font-semibold text-[#8b5e5e] uppercase tracking-wide">
                                Design Gratis Â· Bayar Saat Siap Publish
                            </span>
                        </div>

                        {/* Headline */}
                        <h1 className="font-display text-5xl font-bold leading-tight text-[#4a2c2c] sm:text-6xl lg:text-7xl animate-slide-up">
                            Bikin Undangan
                            <br />
                            <span className="bg-gradient-to-r from-[#c8956c] to-[#8b5e5e] bg-clip-text text-transparent">
                                Pernikahanmu Sendiri
                            </span>
                            <br />
                            <span className="text-4xl sm:text-5xl lg:text-6xl">â€” Gratis.</span>
                        </h1>

                        {/* Subheadline */}
                        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 leading-relaxed animate-slide-up [animation-delay:150ms]">
                            Drag & drop. Atur warna, foto, font, dan isi sesukamu.
                            <br className="hidden sm:block" />
                            Mulai dari kosong atau pilih template yang kamu suka.
                        </p>

                        {/* CTA Buttons */}
                        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center animate-slide-up [animation-delay:300ms]">
                            <Link
                                href={route('register')}
                                className="group flex items-center gap-2 rounded-full bg-gradient-to-r from-[#c8956c] to-[#8b5e5e] px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-[#c8956c]/30 hover:shadow-xl hover:scale-105 transition-all duration-300"
                            >
                                Mulai Desain Gratis
                                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                href={route('templates.index')}
                                className="flex items-center gap-2 rounded-full border border-[#8b5e5e]/30 bg-white px-8 py-3.5 text-base font-semibold text-[#8b5e5e] hover:bg-[#f2e4d8] transition-all duration-200"
                            >
                                <Play className="h-4 w-4" />
                                Lihat Template
                            </Link>
                        </div>

                        {/* Social proof */}
                        <p className="mt-8 text-sm text-gray-400 animate-fade-in [animation-delay:500ms]">
                            âœ¨ Dipercaya oleh 1,000+ pasangan Â· Tanpa kartu kredit
                        </p>
                    </div>

                    {/* Hero Preview Card */}
                    <div className="relative mx-auto mt-20 max-w-4xl animate-slide-up [animation-delay:400ms]">
                        <div className="rounded-2xl border border-white/50 bg-white/70 p-1 shadow-2xl shadow-[#8b5e5e]/10 backdrop-blur-md">
                            <div className="rounded-xl overflow-hidden bg-gradient-to-br from-[#f2e4d8] to-white aspect-video flex items-center justify-center">
                                {/* Invitation preview mockup */}
                                <div className="text-center px-8">
                                    <div className="font-display text-2xl italic text-[#8b5e5e] mb-2">
                                        The Wedding Of
                                    </div>
                                    <div className="font-display text-5xl font-bold text-[#4a2c2c] mb-4">
                                        Andi & Sarah
                                    </div>
                                    <div className="flex items-center justify-center gap-2 text-[#c8956c]">
                                        <div className="h-px w-16 bg-[#c8956c]/40" />
                                        <Heart className="h-4 w-4 fill-current" />
                                        <div className="h-px w-16 bg-[#c8956c]/40" />
                                    </div>
                                    <div className="mt-3 text-gray-500 text-sm">12 Desember 2027 Â· Jakarta</div>
                                    <div className="mt-6 grid grid-cols-4 gap-2 text-center">
                                        {['120', '05', '18', '42'].map((val, i) => (
                                            <div key={i} className="rounded-lg bg-white/80 p-2 shadow-sm">
                                                <div className="font-display text-2xl font-bold text-[#8b5e5e]">{val}</div>
                                                <div className="text-xs text-gray-400">{['Hari', 'Jam', 'Menit', 'Detik'][i]}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Floating badges */}
                        <div className="absolute -top-4 -left-6 hidden sm:flex glass rounded-xl px-4 py-2.5 shadow-lg animate-float">
                            <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                </div>
                                <div>
                                    <div className="text-xs font-semibold text-gray-700">RSVP Masuk</div>
                                    <div className="text-xs text-gray-400">Budi Santoso Â· Hadir</div>
                                </div>
                            </div>
                        </div>

                        <div className="absolute -bottom-4 -right-4 hidden sm:flex glass rounded-xl px-4 py-2.5 shadow-lg animate-float [animation-delay:2s]">
                            <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-full bg-[#f2e4d8] flex items-center justify-center">
                                    <Users className="h-4 w-4 text-[#8b5e5e]" />
                                </div>
                                <div>
                                    <div className="text-xs font-semibold text-gray-700">247 Tamu</div>
                                    <div className="text-xs text-gray-400">192 Konfirmasi Hadir</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Scroll indicator */}
                <div className="flex justify-center pb-8 animate-bounce">
                    <ChevronDown className="h-5 w-5 text-[#c8956c]" />
                </div>
            </section>

            {/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ HOW IT WORKS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
            <section className="bg-white py-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <p className="text-sm font-semibold uppercase tracking-widest text-[#c8956c] mb-3">
                            Cara Kerja
                        </p>
                        <h2 className="font-display text-4xl font-bold text-[#4a2c2c] sm:text-5xl">
                            Dari Imajinasi ke Undangan
                        </h2>
                        <p className="mt-4 text-gray-500 max-w-xl mx-auto">
                            Empat langkah mudah untuk undangan pernikahan digital yang memukau.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                        {steps.map((item, idx) => (
                            <div key={idx} className="relative group">
                                {idx < steps.length - 1 && (
                                    <div className="absolute top-8 left-1/2 hidden h-px w-full bg-gradient-to-r from-[#c8956c]/30 to-transparent lg:block" />
                                )}
                                <div className="relative z-10 flex flex-col items-center text-center">
                                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#f2e4d8] to-[#c8956c]/20 group-hover:scale-110 transition-transform duration-300">
                                        <span className="font-display text-2xl font-bold text-[#8b5e5e]">
                                            {item.step}
                                        </span>
                                    </div>
                                    <h3 className="font-display text-lg font-semibold text-[#4a2c2c] mb-2">
                                        {item.title}
                                    </h3>
                                    <p className="text-sm text-gray-500 leading-relaxed">{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ FEATURES â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
            <section className="py-24 bg-gradient-to-b from-[#fdf8f3] to-[#f2e4d8]/30">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <p className="text-sm font-semibold uppercase tracking-widest text-[#c8956c] mb-3">
                            Fitur Unggulan
                        </p>
                        <h2 className="font-display text-4xl font-bold text-[#4a2c2c] sm:text-5xl">
                            Semua yang Kamu Butuhkan
                        </h2>
                        <p className="mt-4 text-gray-500 max-w-xl mx-auto">
                            Dirancang khusus untuk pasangan yang ingin undangan digital berkelas tanpa kerumitan.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {features.map((feature, idx) => {
                            const Icon = feature.icon
                            return (
                                <div
                                    key={idx}
                                    className="group rounded-2xl border border-white bg-white/80 p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                                >
                                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#f2e4d8] to-[#c8956c]/20 group-hover:scale-110 transition-transform duration-300">
                                        <Icon className="h-6 w-6 text-[#8b5e5e]" />
                                    </div>
                                    <h3 className="font-display text-lg font-semibold text-[#4a2c2c] mb-2">
                                        {feature.title}
                                    </h3>
                                    <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ PRICING TEASER â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
            <section className="bg-white py-24">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
                    <p className="text-sm font-semibold uppercase tracking-widest text-[#c8956c] mb-3">
                        Harga
                    </p>
                    <h2 className="font-display text-4xl font-bold text-[#4a2c2c] sm:text-5xl mb-6">
                        Bayar Hanya Saat Siap
                    </h2>
                    <p className="text-gray-500 mb-12 max-w-xl mx-auto">
                        Desain gratis tanpa batas waktu. Preview sepuasnya. Bayar hanya saat kamu yakin dan ingin mempublikasikan undanganmu.
                    </p>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                        {[
                            {
                                name: 'Desain',
                                price: 'Gratis',
                                priceNote: 'Selamanya',
                                features: ['Editor lengkap', 'Semua template gratis', 'Preview tanpa batas', 'Guest list'],
                                cta: 'Mulai Gratis',
                                href: route('register'),
                                highlight: false,
                            },
                            {
                                name: 'Basic Publish',
                                price: 'Rp 49k',
                                priceNote: 'per undangan',
                                features: ['Semua fitur Desain', 'Publish & bagikan', 'Link personal tamu', 'RSVP dashboard'],
                                cta: 'Pilih Basic',
                                href: route('register'),
                                highlight: true,
                            },
                            {
                                name: 'Premium',
                                price: 'Rp 149k',
                                priceNote: 'per undangan',
                                features: ['Semua fitur Basic', 'Template premium', 'Musik latar', 'Analitik lengkap'],
                                cta: 'Pilih Premium',
                                href: route('register'),
                                highlight: false,
                            },
                        ].map((plan, idx) => (
                            <div
                                key={idx}
                                className={`relative rounded-2xl p-6 text-left ${
                                    plan.highlight
                                        ? 'bg-gradient-to-b from-[#8b5e5e] to-[#4a2c2c] text-white shadow-2xl shadow-[#8b5e5e]/20 scale-105'
                                        : 'border border-gray-100 bg-white'
                                }`}
                            >
                                {plan.highlight && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-[#c8956c] to-amber-400 px-4 py-1 text-xs font-bold text-white shadow-md">
                                        Terpopuler
                                    </div>
                                )}
                                <div className={`text-sm font-semibold mb-1 ${plan.highlight ? 'text-rose-200' : 'text-[#c8956c]'}`}>
                                    {plan.name}
                                </div>
                                <div className={`font-display text-3xl font-bold mb-0.5 ${plan.highlight ? 'text-white' : 'text-[#4a2c2c]'}`}>
                                    {plan.price}
                                </div>
                                <div className={`text-xs mb-6 ${plan.highlight ? 'text-rose-200' : 'text-gray-400'}`}>
                                    {plan.priceNote}
                                </div>
                                <ul className="space-y-2 mb-6">
                                    {plan.features.map((f, i) => (
                                        <li key={i} className="flex items-center gap-2 text-sm">
                                            <Check className={`h-4 w-4 shrink-0 ${plan.highlight ? 'text-rose-300' : 'text-[#c8956c]'}`} />
                                            <span className={plan.highlight ? 'text-rose-100' : 'text-gray-600'}>{f}</span>
                                        </li>
                                    ))}
                                </ul>
                                <Link
                                    href={plan.href}
                                    className={`block w-full rounded-full py-2.5 text-center text-sm font-semibold transition-all hover:scale-105 ${
                                        plan.highlight
                                            ? 'bg-white text-[#8b5e5e] hover:bg-rose-50'
                                            : 'bg-gradient-to-r from-[#c8956c] to-[#8b5e5e] text-white'
                                    }`}
                                >
                                    {plan.cta}
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ TESTIMONIALS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
            <section className="py-24 bg-[#fdf8f3]">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <p className="text-sm font-semibold uppercase tracking-widest text-[#c8956c] mb-3">
                            Cerita Mereka
                        </p>
                        <h2 className="font-display text-4xl font-bold text-[#4a2c2c] sm:text-5xl">
                            Pasangan yang Bahagia
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                        {testimonials.map((t, idx) => (
                            <div key={idx} className="rounded-2xl bg-white p-6 shadow-sm border border-gray-50 hover:shadow-md transition-shadow">
                                <div className="flex gap-0.5 mb-4">
                                    {Array.from({ length: t.rating }).map((_, i) => (
                                        <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                                    ))}
                                </div>
                                <p className="text-sm text-gray-600 leading-relaxed mb-4 italic">"{t.text}"</p>
                                <div>
                                    <div className="font-display font-semibold text-[#4a2c2c]">{t.name}</div>
                                    <div className="text-xs text-gray-400">{t.date}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ FAQ â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
            <section className="bg-white py-24">
                <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <p className="text-sm font-semibold uppercase tracking-widest text-[#c8956c] mb-3">
                            FAQ
                        </p>
                        <h2 className="font-display text-4xl font-bold text-[#4a2c2c]">
                            Pertanyaan Umum
                        </h2>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq, idx) => (
                            <details key={idx} className="group rounded-xl border border-gray-100 bg-gray-50/50 p-5 open:bg-[#fdf8f3] transition-all">
                                <summary className="flex cursor-pointer items-center justify-between gap-4 font-semibold text-[#4a2c2c] list-none">
                                    {faq.question}
                                    <ChevronDown className="h-4 w-4 text-[#c8956c] shrink-0 transition-transform group-open:rotate-180" />
                                </summary>
                                <p className="mt-3 text-sm text-gray-600 leading-relaxed">{faq.answer}</p>
                            </details>
                        ))}
                    </div>
                </div>
            </section>

            {/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ CTA FINAL â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
            <section className="relative overflow-hidden bg-gradient-to-br from-[#8b5e5e] to-[#4a2c2c] py-24">
                <div className="absolute inset-0 opacity-10">
                    {Array.from({ length: 20 }).map((_, i) => (
                        <Heart
                            key={i}
                            className="absolute text-white"
                            style={{
                                left: `${(i * 47) % 100}%`,
                                top: `${(i * 31) % 100}%`,
                                width: `${16 + (i % 4) * 8}px`,
                                height: `${16 + (i % 4) * 8}px`,
                                opacity: 0.3 + (i % 5) * 0.1,
                            }}
                        />
                    ))}
                </div>

                <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
                    <h2 className="font-display text-4xl font-bold text-white sm:text-5xl">
                        Siap Bikin Undangan
                        <br />
                        <span className="text-rose-200">yang Tak Terlupakan?</span>
                    </h2>
                    <p className="mt-6 text-rose-100 text-lg">
                        Gratis selamanya untuk mendesain. Tidak perlu kartu kredit.
                    </p>
                    <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                        <Link
                            href={route('register')}
                            className="group flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-base font-semibold text-[#8b5e5e] shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
                        >
                            Mulai Desain Gratis
                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ FOOTER â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
            <footer className="bg-[#4a2c2c] py-12 text-center">
                <div className="mx-auto max-w-7xl px-4">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10">
                            <Heart className="h-3.5 w-3.5 text-rose-300 fill-rose-300" />
                        </div>
                        <span className="font-display text-lg font-semibold text-white">InviteMe</span>
                    </div>
                    <p className="text-rose-200/60 text-sm">
                        Â© {new Date().getFullYear()} InviteMe. Dibuat dengan â¤ï¸ untuk setiap momen pernikahan yang istimewa.
                    </p>
                </div>
            </footer>
        </AppLayout>
    )
}
