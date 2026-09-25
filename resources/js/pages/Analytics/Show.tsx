import { Head, Link } from '@inertiajs/react'
import DashboardLayout from '@/layouts/DashboardLayout'
import { BarChart2, Eye, Users, MousePointerClick, TrendingUp, ArrowLeft } from 'lucide-react'

interface Stats {
    total_views: number
    unique_visitors: number
    rsvp_count: number
    conversion_rate: number
}

interface Props {
    invitation: { id: string; title: string; slug: string; status: string }
    stats: Stats
    views_by_day: Record<string, number>
    event_breakdown: Record<string, number>
}

export default function AnalyticsShow({ invitation, stats, views_by_day, event_breakdown }: Props) {
    const dayEntries = Object.entries(views_by_day)
    const maxViews = dayEntries.length > 0 ? Math.max(...dayEntries.map(([, v]) => v)) : 1

    const statCards = [
        { label: 'Total Kunjungan', value: stats.total_views, icon: Eye, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Pengunjung Unik', value: stats.unique_visitors, icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
        { label: 'Total RSVP', value: stats.rsvp_count, icon: MousePointerClick, color: 'text-green-600', bg: 'bg-green-50' },
        { label: 'Conversion Rate', value: `${stats.conversion_rate}%`, icon: TrendingUp, color: 'text-[#c8956c]', bg: 'bg-[#c8956c]/10' },
    ]

    return (
        <DashboardLayout title={`Analitik — ${invitation.title}`}>
            <Head title={`Analitik — ${invitation.title}`} />

            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link
                        href={route('dashboard')}
                        className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <div>
                        <h1 className="font-display text-2xl font-bold text-[#4a2c2c]">Analitik Undangan</h1>
                        <p className="text-sm text-gray-500 mt-0.5">{invitation.title}</p>
                    </div>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {statCards.map((card) => (
                        <div key={card.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                            <div className={`inline-flex p-2 rounded-xl ${card.bg} mb-3`}>
                                <card.icon className={`h-5 w-5 ${card.color}`} />
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                            <p className="text-xs text-gray-500 mt-1">{card.label}</p>
                        </div>
                    ))}
                </div>

                {/* Views Per Day Chart */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <BarChart2 className="h-5 w-5 text-[#c8956c]" />
                        <h2 className="font-semibold text-gray-800">Kunjungan 30 Hari Terakhir</h2>
                    </div>

                    {dayEntries.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                            <Eye className="h-10 w-10 mb-3 opacity-30" />
                            <p className="text-sm">Belum ada data kunjungan.</p>
                            <p className="text-xs mt-1">Data akan muncul setelah undangan dikunjungi tamu.</p>
                        </div>
                    ) : (
                        <div className="flex items-end gap-1 h-40">
                            {dayEntries.map(([date, count]) => (
                                <div key={date} className="flex-1 flex flex-col items-center gap-1 group relative">
                                    <div
                                        className="w-full bg-[#c8956c]/20 hover:bg-[#c8956c]/50 rounded-sm transition-colors cursor-default"
                                        style={{ height: `${(count / maxViews) * 100}%`, minHeight: 4 }}
                                    />
                                    {/* Tooltip */}
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-10">
                                        {date}: {count}×
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Event Breakdown */}
                {Object.keys(event_breakdown).length > 0 && (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <h2 className="font-semibold text-gray-800 mb-4">Rincian Aktivitas</h2>
                        <div className="space-y-3">
                            {Object.entries(event_breakdown).map(([type, count]) => (
                                <div key={type} className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600 capitalize">{type.replace('_', ' ')}</span>
                                    <div className="flex items-center gap-3">
                                        <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-[#c8956c] rounded-full"
                                                style={{ width: `${(count / Math.max(...Object.values(event_breakdown))) * 100}%` }}
                                            />
                                        </div>
                                        <span className="text-sm font-medium text-gray-800 w-10 text-right">{count}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    )
}
