import React from 'react'
import { Link, router, usePage } from '@inertiajs/react'
import {
    Heart,
    LayoutDashboard,
    ScrollText,
    Plus,
    Users,
    CheckSquare,
    BarChart2,
    CreditCard,
    Settings,
    LogOut,
    Menu,
    X,
    ChevronRight,
    Image,
} from 'lucide-react'
import type { PageProps } from '@/types'
import { clsx } from 'clsx'

interface DashboardLayoutProps {
    children: React.ReactNode
    title?: string
}

const navItems = [
    { label: 'Dashboard', href: 'dashboard', icon: LayoutDashboard },
    { label: 'Undanganku', href: 'invitations.index', icon: ScrollText },
    { label: 'Template', href: 'templates.index', icon: Heart },
    { label: 'Media', href: 'media.index', icon: Image },
    { label: 'Billing', href: 'billing.index', icon: CreditCard },
    { label: 'Pengaturan', href: 'settings.index', icon: Settings },
]

function NavItem({ item }: { item: typeof navItems[0] }) {
    const { url } = usePage()
    const href = route(item.href)
    const isActive = url.startsWith(href.replace(window.location.origin, ''))

    return (
        <Link
            href={href}
            className={clsx(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150',
                isActive
                    ? 'bg-[#f9ede8] text-[#8b5e5e] shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
            )}
        >
            <item.icon className={clsx('h-4.5 w-4.5', isActive ? 'text-[#8b5e5e]' : 'text-gray-400')} />
            {item.label}
        </Link>
    )
}

export default function DashboardLayout({ children, title }: DashboardLayoutProps) {
    const { auth } = usePage<PageProps>().props
    const [sidebarOpen, setSidebarOpen] = React.useState(false)

    const handleLogout = () => {
        router.post(route('logout'))
    }

    return (
        <div className="flex h-screen overflow-hidden bg-gray-50">
            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-20 bg-black/30 backdrop-blur-sm lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={clsx(
                    'fixed inset-y-0 left-0 z-30 flex w-64 flex-col bg-white border-r border-gray-100 shadow-xl transition-transform duration-300 lg:static lg:translate-x-0 lg:shadow-none',
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full',
                )}
            >
                {/* Logo */}
                <div className="flex h-16 items-center gap-2 border-b border-gray-100 px-5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#c8956c] to-[#8b5e5e]">
                        <Heart className="h-4 w-4 text-white fill-white" />
                    </div>
                    <span className="font-display text-xl font-semibold text-[#4a2c2c]">InviteMe</span>
                </div>

                {/* Create button */}
                <div className="px-4 pt-5 pb-2">
                    <Link
                        href={route('invitations.create')}
                        className="flex items-center justify-center gap-2 w-full rounded-xl bg-gradient-to-r from-[#c8956c] to-[#8b5e5e] py-2.5 text-sm font-semibold text-white shadow-md hover:shadow-lg hover:scale-[1.02] transition-all"
                    >
                        <Plus className="h-4 w-4" />
                        Buat Undangan
                    </Link>
                </div>

                {/* Nav */}
                <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-0.5">
                    {navItems.map((item) => (
                        <NavItem key={item.href} item={item} />
                    ))}
                    {auth.user?.role === 'admin' && (
                        <>
                            <div className="my-3 border-t border-gray-100" />
                            <Link
                                href={route('admin.dashboard')}
                                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[#c8956c] hover:bg-rose-50 transition-all"
                            >
                                <BarChart2 className="h-4.5 w-4.5" />
                                Admin Panel
                            </Link>
                        </>
                    )}
                </nav>

                {/* User info */}
                <div className="border-t border-gray-100 p-4">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#f2e4d8] to-[#c8956c]/30 text-sm font-semibold text-[#8b5e5e]">
                            {auth.user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                            <div className="text-sm font-semibold text-gray-800 truncate">{auth.user?.name}</div>
                            <div className="text-xs text-gray-400 truncate">{auth.user?.email}</div>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                        <LogOut className="h-4 w-4" />
                        Keluar
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Top bar */}
                <header className="flex h-16 items-center gap-4 border-b border-gray-100 bg-white px-6 shadow-sm">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="lg:hidden text-gray-500 hover:text-gray-700"
                    >
                        {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>

                    {title && (
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Link href={route('dashboard')} className="hover:text-gray-700">Dashboard</Link>
                            {title !== 'Dashboard' && (
                                <>
                                    <ChevronRight className="h-3.5 w-3.5" />
                                    <span className="text-gray-900 font-medium">{title}</span>
                                </>
                            )}
                        </div>
                    )}
                </header>

                {/* Page content */}
                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    )
}
