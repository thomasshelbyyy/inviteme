import React from 'react'
import { Head, Link } from '@inertiajs/react'
import AdminLayout from '@/layouts/AdminLayout'
import { Users, FileText, CreditCard, TrendingUp, UserPlus, FileCheck } from 'lucide-react'

export default function AdminDashboard({ stats, recentUsers, recentOrders }: any) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount)
    }

    const statCards = [
        { name: 'Total Pengguna', value: stats.total_users, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
        { name: 'Pengguna Baru', value: stats.new_users_today, icon: UserPlus, color: 'text-indigo-600', bg: 'bg-indigo-100' },
        { name: 'Total Undangan', value: stats.total_invitations, icon: FileText, color: 'text-gray-600', bg: 'bg-gray-100' },
        { name: 'Undangan Publik', value: stats.published_invitations, icon: FileCheck, color: 'text-green-600', bg: 'bg-green-100' },
        { name: 'Total Transaksi', value: stats.total_orders, icon: CreditCard, color: 'text-purple-600', bg: 'bg-purple-100' },
        { name: 'Pendapatan', value: formatCurrency(stats.total_revenue), icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    ]

    return (
        <AdminLayout title="Admin Dashboard">
            <Head title="Admin Dashboard" />

            <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {statCards.map((stat, idx) => {
                        const Icon = stat.icon
                        return (
                            <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${stat.bg} ${stat.color}`}>
                                    <Icon className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                    {/* Recent Users */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="font-semibold text-gray-800">Pengguna Baru</h3>
                            <Link href={route('admin.users.index')} className="text-sm text-[#8b5e5e] hover:underline font-medium">
                                Lihat Semua
                            </Link>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {recentUsers.length > 0 ? recentUsers.map((user: any) => (
                                <div key={user.id} className="p-4 px-6 flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <span className="font-medium text-gray-800">{user.name}</span>
                                        <span className="text-xs text-gray-500">{user.email}</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xs text-gray-400">
                                            {new Date(user.created_at).toLocaleDateString('id-ID')}
                                        </span>
                                    </div>
                                </div>
                            )) : (
                                <div className="p-6 text-center text-sm text-gray-500">Belum ada pengguna</div>
                            )}
                        </div>
                    </div>

                    {/* Recent Orders */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="font-semibold text-gray-800">Transaksi Terbaru</h3>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {recentOrders.length > 0 ? recentOrders.map((order: any) => (
                                <div key={order.id} className="p-4 px-6 flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <span className="font-medium text-gray-800">{order.user?.name || 'User'} - {order.plan}</span>
                                        <span className="text-xs text-gray-500 truncate max-w-[200px]">{order.invitation?.title}</span>
                                    </div>
                                    <div className="text-right flex flex-col">
                                        <span className="font-medium text-emerald-600">{formatCurrency(order.amount)}</span>
                                        <span className="text-xs text-gray-400">
                                            {new Date(order.paid_at || order.created_at).toLocaleDateString('id-ID')}
                                        </span>
                                    </div>
                                </div>
                            )) : (
                                <div className="p-6 text-center text-sm text-gray-500">Belum ada transaksi</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}
