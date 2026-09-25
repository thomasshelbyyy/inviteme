import { Head, Link, useForm } from '@inertiajs/react'
import { Heart, Mail, Lock, Eye, EyeOff, User, ArrowRight } from 'lucide-react'
import React from 'react'

export default function Register() {
    const [showPassword, setShowPassword] = React.useState(false)
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        post(route('register'))
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#f2e4d8] via-[#fdf8f3] to-white flex">
            <Head title="Daftar Gratis" />

            {/* Left panel â€” decorative */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-[#c8956c] to-[#4a2c2c] p-12 flex-col justify-between">
                <div className="absolute inset-0 opacity-10">
                    {Array.from({ length: 15 }).map((_, i) => (
                        <Heart
                            key={i}
                            className="absolute text-white"
                            style={{ left: `${(i * 53) % 95}%`, top: `${(i * 37) % 90}%`, width: 20 + (i % 4) * 12, height: 20 + (i % 4) * 12 }}
                        />
                    ))}
                </div>
                <Link href={route('home')} className="relative flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                        <Heart className="h-4.5 w-4.5 text-white fill-white" />
                    </div>
                    <span className="font-display text-2xl font-bold text-white">InviteMe</span>
                </Link>
                <div className="relative space-y-6">
                    {[
                        { label: 'Editor drag & drop', sub: 'Susun konten sesukamu' },
                        { label: 'Desain gratis selamanya', sub: 'Bayar hanya saat publish' },
                        { label: 'Link personal tiap tamu', sub: 'Sapaan otomatis dengan nama' },
                    ].map((item, i) => (
                        <div key={i} className="flex items-start gap-3">
                            <div className="mt-0.5 h-5 w-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                                <Heart className="h-2.5 w-2.5 text-white fill-white" />
                            </div>
                            <div>
                                <div className="font-semibold text-white text-sm">{item.label}</div>
                                <div className="text-rose-200 text-xs">{item.sub}</div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="relative text-rose-300 text-sm">&copy; {new Date().getFullYear()} InviteMe</div>
            </div>

            {/* Right panel â€” form */}
            <div className="flex w-full flex-col items-center justify-center px-6 py-12 lg:w-1/2">
                <div className="w-full max-w-sm">
                    <Link href={route('home')} className="lg:hidden flex items-center justify-center gap-2 mb-8">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#c8956c] to-[#8b5e5e]">
                            <Heart className="h-4.5 w-4.5 text-white fill-white" />
                        </div>
                        <span className="font-display text-2xl font-bold text-[#4a2c2c]">InviteMe</span>
                    </Link>

                    <div className="mb-8">
                        <h1 className="font-display text-3xl font-bold text-[#4a2c2c]">Mulai Gratis</h1>
                        <p className="mt-2 text-gray-500 text-sm">Buat akunmu dan mulai desain undangan impianmu</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Name */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">Nama Lengkap</label>
                            <div className="relative">
                                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    id="name"
                                    type="text"
                                    autoComplete="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 py-3 text-sm placeholder-gray-400 outline-none focus:border-[#c8956c] focus:ring-2 focus:ring-[#c8956c]/20 transition-all"
                                    placeholder="Nama Lengkapmu"
                                />
                            </div>
                            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    id="email"
                                    type="email"
                                    autoComplete="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 py-3 text-sm placeholder-gray-400 outline-none focus:border-[#c8956c] focus:ring-2 focus:ring-[#c8956c]/20 transition-all"
                                    placeholder="nama@email.com"
                                />
                            </div>
                            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="new-password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="w-full rounded-xl border border-gray-200 bg-white pl-10 pr-10 py-3 text-sm placeholder-gray-400 outline-none focus:border-[#c8956c] focus:ring-2 focus:ring-[#c8956c]/20 transition-all"
                                    placeholder="Min. 8 karakter"
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-1.5">Konfirmasi Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    id="password_confirmation"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="new-password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    className="w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 py-3 text-sm placeholder-gray-400 outline-none focus:border-[#c8956c] focus:ring-2 focus:ring-[#c8956c]/20 transition-all"
                                    placeholder="Ulangi password"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#c8956c] to-[#8b5e5e] py-3 text-sm font-semibold text-white shadow-md shadow-[#c8956c]/25 hover:shadow-lg hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 mt-2"
                        >
                            {processing ? 'Memproses...' : 'Daftar Gratis'}
                            <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                    </form>

                    <p className="mt-5 text-center text-sm text-gray-500">
                        Sudah punya akun?{' '}
                        <Link href={route('login')} className="font-semibold text-[#8b5e5e] hover:text-[#c8956c] transition-colors">
                            Masuk
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
