import React, { useState } from 'react'
import { Link, usePage, router } from '@inertiajs/react'
import { 
    LayoutDashboard, 
    Users, 
    FileText, 
    CreditCard, 
    LogOut,
    Menu,
    X,
    ChevronLeft
} from 'lucide-react'

export default function AdminLayout({ children, title }: { children: React.ReactNode, title: string }) {
    const { auth } = usePage<any>().props
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const navigation = [
        { name: 'Dashboard', href: route('admin.dashboard'), icon: LayoutDashboard },
        { name: 'Users', href: route('admin.users.index'), icon: Users },
    ]

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#2c1818] text-white transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:block`}>
                <div className="h-16 flex items-center justify-between px-6 border-b border-white/10">
                    <Link href="/" className="font-display text-xl font-bold tracking-tight">
                        InviteMe Admin
                    </Link>
                    <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden text-white/70 hover:text-white">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-4">
                    <div className="mb-6 px-4">
                        <p className="text-xs text-white/50 uppercase tracking-wider font-bold">Admin Panel</p>
                    </div>
                    
                    <nav className="space-y-1">
                        {navigation.map((item) => {
                            const Icon = item.icon
                            const isActive = route().current(item.href.split('/').pop()?.split('?')[0] + '*') || window.location.href.includes(item.href)
                            
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                                        isActive 
                                            ? 'bg-white/10 text-white font-medium' 
                                            : 'text-white/70 hover:text-white hover:bg-white/5'
                                    }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    {item.name}
                                </Link>
                            )
                        })}
                    </nav>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
                    <div className="flex items-center gap-3 px-4 py-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm">
                            {auth.user.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{auth.user.name}</p>
                            <p className="text-xs text-white/50 truncate">Administrator</p>
                        </div>
                    </div>
                    <Link 
                        href={route('dashboard')}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-colors w-full"
                    >
                        <ChevronLeft className="w-5 h-5" />
                        Kembali ke App
                    </Link>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top header */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8 shrink-0">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="lg:hidden p-2 -ml-2 text-gray-500 hover:text-gray-700"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <h1 className="font-semibold text-gray-800">{title}</h1>
                    </div>
                    
                    <button 
                        onClick={() => router.post(route('logout'))}
                        className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-2"
                    >
                        <LogOut className="w-4 h-4" />
                        <span className="hidden sm:inline">Logout</span>
                    </button>
                </header>

                {/* Page content */}
                <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
                    {children}
                </main>
            </div>
            
            {/* Mobile overlay */}
            {isMobileMenuOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}
        </div>
    )
}
