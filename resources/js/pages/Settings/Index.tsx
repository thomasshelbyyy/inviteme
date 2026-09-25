import { Head, useForm } from '@inertiajs/react'
import DashboardLayout from '@/layouts/DashboardLayout'
import { User, Lock, CheckCircle } from 'lucide-react'

interface Props {
    user: {
        id: number
        name: string
        email: string
        phone: string | null
        avatar: string | null
    }
    flash?: { success?: string; error?: string }
}

export default function SettingsIndex({ user, flash }: Props) {
    const profileForm = useForm({
        name: user.name,
        email: user.email,
        phone: user.phone ?? '',
    })

    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    })

    const handleProfileSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        profileForm.put(route('settings.update'))
    }

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        passwordForm.put(route('settings.password'), {
            onSuccess: () => passwordForm.reset(),
        })
    }

    return (
        <DashboardLayout title="Pengaturan">
            <Head title="Pengaturan Akun" />

            <div className="p-6 max-w-2xl space-y-8">
                <div>
                    <h1 className="font-display text-2xl font-bold text-[#4a2c2c]">Pengaturan Akun</h1>
                    <p className="text-gray-500 mt-1 text-sm">Kelola informasi profil dan keamanan akun Anda.</p>
                </div>

                {/* Flash message */}
                {flash?.success && (
                    <div className="flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">
                        <CheckCircle className="h-4 w-4 shrink-0" />
                        {flash.success}
                    </div>
                )}

                {/* Profile Form */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                        <User className="h-4 w-4 text-[#c8956c]" />
                        <h2 className="font-semibold text-gray-800 text-sm">Informasi Profil</h2>
                    </div>

                    <form onSubmit={handleProfileSubmit} className="p-6 space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Nama Lengkap</label>
                            <input
                                type="text"
                                value={profileForm.data.name}
                                onChange={(e) => profileForm.setData('name', e.target.value)}
                                className="w-full rounded-xl border-gray-200 shadow-sm focus:ring-[#c8956c] focus:border-[#c8956c]"
                                required
                            />
                            {profileForm.errors.name && (
                                <p className="text-xs text-red-500 mt-1">{profileForm.errors.name}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                            <input
                                type="email"
                                value={profileForm.data.email}
                                onChange={(e) => profileForm.setData('email', e.target.value)}
                                className="w-full rounded-xl border-gray-200 shadow-sm focus:ring-[#c8956c] focus:border-[#c8956c]"
                                required
                            />
                            {profileForm.errors.email && (
                                <p className="text-xs text-red-500 mt-1">{profileForm.errors.email}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Nomor HP <span className="text-gray-400 font-normal">(opsional)</span></label>
                            <input
                                type="tel"
                                value={profileForm.data.phone}
                                onChange={(e) => profileForm.setData('phone', e.target.value)}
                                placeholder="08xxxxxxxxxx"
                                className="w-full rounded-xl border-gray-200 shadow-sm focus:ring-[#c8956c] focus:border-[#c8956c]"
                            />
                        </div>

                        <div className="flex justify-end pt-2">
                            <button
                                type="submit"
                                disabled={profileForm.processing}
                                className="px-5 py-2 bg-[#c8956c] text-white text-sm font-medium rounded-xl hover:bg-[#8b5e5e] transition-colors disabled:opacity-60"
                            >
                                {profileForm.processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Password Form */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                        <Lock className="h-4 w-4 text-[#c8956c]" />
                        <h2 className="font-semibold text-gray-800 text-sm">Ubah Password</h2>
                    </div>

                    <form onSubmit={handlePasswordSubmit} className="p-6 space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Password Saat Ini</label>
                            <input
                                type="password"
                                value={passwordForm.data.current_password}
                                onChange={(e) => passwordForm.setData('current_password', e.target.value)}
                                className="w-full rounded-xl border-gray-200 shadow-sm focus:ring-[#c8956c] focus:border-[#c8956c]"
                                required
                            />
                            {passwordForm.errors.current_password && (
                                <p className="text-xs text-red-500 mt-1">{passwordForm.errors.current_password}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Password Baru</label>
                            <input
                                type="password"
                                value={passwordForm.data.password}
                                onChange={(e) => passwordForm.setData('password', e.target.value)}
                                className="w-full rounded-xl border-gray-200 shadow-sm focus:ring-[#c8956c] focus:border-[#c8956c]"
                                required
                            />
                            {passwordForm.errors.password && (
                                <p className="text-xs text-red-500 mt-1">{passwordForm.errors.password}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Konfirmasi Password Baru</label>
                            <input
                                type="password"
                                value={passwordForm.data.password_confirmation}
                                onChange={(e) => passwordForm.setData('password_confirmation', e.target.value)}
                                className="w-full rounded-xl border-gray-200 shadow-sm focus:ring-[#c8956c] focus:border-[#c8956c]"
                                required
                            />
                        </div>

                        <div className="flex justify-end pt-2">
                            <button
                                type="submit"
                                disabled={passwordForm.processing}
                                className="px-5 py-2 bg-[#c8956c] text-white text-sm font-medium rounded-xl hover:bg-[#8b5e5e] transition-colors disabled:opacity-60"
                            >
                                {passwordForm.processing ? 'Menyimpan...' : 'Ubah Password'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </DashboardLayout>
    )
}
