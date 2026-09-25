import React from 'react'
import { Link, usePage } from '@inertiajs/react'
import { Heart, Menu, X } from 'lucide-react'
import type { PageProps } from '@/types'

interface AppLayoutProps {
    children: React.ReactNode
    title?: string
}

export default function AppLayout({ children }: AppLayoutProps) {
    const { auth } = usePage<PageProps>().props
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

    return (
        <div className="min-h-screen bg-[#fdf8f3]">
            {/* Navbar */}
            <nav className="sticky top-0 z-50 glass border-b border-white/30 shadow-sm">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        <Link href={route('home')} className="flex items-center gap-2 group">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#c8956c] to-[#8b5e5e] shadow-md group-hover:scale-105 transition-transform">
                                <Heart className="h-4 w-4 text-white fill-white" />
                            </div>
                            <span className="font-display text-xl font-semibold text-[#4a2c2c]">
                                InviteMe
                            </span>
                        </Link>

                        <div className="hidden md:flex items-center gap-6">
                            {auth.user ? (
                                <>
                                    <Link
                                        href={route('dashboard')}
                                        className="text-sm font-medium text-gray-600 hover:text-[#8b5e5e] transition-colors"
                                    >
                                        Dashboard
                                    </Link>
                                    <Link
                                        href={route('invitations.index')}
                                        className="text-sm font-medium text-gray-600 hover:text-[#8b5e5e] transition-colors"
                                    >
                                        Undanganku
                                    </Link>
                                    {auth.user.role === 'admin' && (
                                        <Link
                                            href={route('admin.dashboard')}
                                            className="text-sm font-medium text-[#c8956c] hover:text-[#8b5e5e] transition-colors"
                                        >
                                            Admin
                                        </Link>
                                    )}
                                </>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="text-sm font-medium text-gray-600 hover:text-[#8b5e5e] transition-colors"
                                    >
                                        Masuk
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="rounded-full bg-gradient-to-r from-[#c8956c] to-[#8b5e5e] px-5 py-2 text-sm font-semibold text-white shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
                                    >
                                        Mulai Gratis
                                    </Link>
                                </>
                            )}
                        </div>

                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden rounded-lg p-2 text-gray-600 hover:bg-gray-100"
                        >
                            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>
                    </div>
                </div>

                {/* Mobile menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden border-t border-gray-100 bg-white/95 px-4 py-4 space-y-3">
                        {auth.user ? (
                            <>
                                <Link href={route('dashboard')} className="block text-sm font-medium text-gray-700">Dashboard</Link>
                                <Link href={route('invitations.index')} className="block text-sm font-medium text-gray-700">Undanganku</Link>
                            </>
                        ) : (
                            <>
                                <Link href={route('login')} className="block text-sm font-medium text-gray-700">Masuk</Link>
                                <Link href={route('register')} className="block rounded-full bg-gradient-to-r from-[#c8956c] to-[#8b5e5e] px-5 py-2 text-center text-sm font-semibold text-white">
                                    Mulai Gratis
                                </Link>
                            </>
                        )}
                    </div>
                )}
            </nav>

            {/* Main Content */}
            <main>{children}</main>
        </div>
    )
}
