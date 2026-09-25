import { Head, Link, useForm } from '@inertiajs/react'
import { Heart, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react'
import React from 'react'

export default function Login() {
    const [showPassword, setShowPassword] = React.useState(false)
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        post(route('login'))
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#f2e4d8] via-[#fdf8f3] to-white flex">
            <Head title="Masuk" />

            {/* Left panel â€” decorative */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-[#8b5e5e] to-[#4a2c2c] p-12 flex-col justify-between">
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
                <div className="relative">
                    <blockquote className="font-display text-3xl font-medium text-white leading-relaxed">
                        "Setiap undangan adalah awal dari cerita cinta yang akan selalu dikenang."
                    </blockquote>
                    <p className="mt-4 text-rose-200">Design Gratis Â· Bayar Saat Siap Publish</p>
                </div>
                <div className="relative text-rose-300 text-sm">
                    &copy; {new Date().getFullYear()} InviteMe
                </div>
            </div>

            {/* Right panel â€” form */}
            <div className="flex w-full flex-col items-center justify-center px-6 py-12 lg:w-1/2">
                <div className="w-full max-w-sm">
                    {/* Mobile logo */}
                    <Link href={route('home')} className="lg:hidden flex items-center justify-center gap-2 mb-8">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#c8956c] to-[#8b5e5e]">
                            <Heart className="h-4.5 w-4.5 text-white fill-white" />
                        </div>
                        <span className="font-display text-2xl font-bold text-[#4a2c2c]">InviteMe</span>
                    </Link>

                    <div className="mb-8">
                        <h1 className="font-display text-3xl font-bold text-[#4a2c2c]">Selamat datang!</h1>
                        <p className="mt-2 text-gray-500 text-sm">Masuk ke akun InviteMu</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    id="email"
                                    type="email"
                                    autoComplete="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-[#c8956c] focus:ring-2 focus:ring-[#c8956c]/20 transition-all"
                                    placeholder="nama@email.com"
                                />
                            </div>
                            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="current-password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="w-full rounded-xl border border-gray-200 bg-white pl-10 pr-10 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-[#c8956c] focus:ring-2 focus:ring-[#c8956c]/20 transition-all"
                                    placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
                        </div>

                        {/* Remember me */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="h-4 w-4 rounded border-gray-300 text-[#c8956c] focus:ring-[#c8956c]/30"
                                />
                                <span className="text-sm text-gray-600">Ingat saya</span>
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#c8956c] to-[#8b5e5e] py-3 text-sm font-semibold text-white shadow-md shadow-[#c8956c]/25 hover:shadow-lg hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
                        >
                            {processing ? 'Memproses...' : 'Masuk'}
                            <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-gray-500">
                        Belum punya akun?{' '}
                        <Link href={route('register')} className="font-semibold text-[#8b5e5e] hover:text-[#c8956c] transition-colors">
                            Daftar gratis
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
