import { Head, Link } from '@inertiajs/react'
import { Plus, ScrollText, Users, CheckCircle, ArrowRight, Eye, Edit2, MoreVertical } from 'lucide-react'
import DashboardLayout from '@/layouts/DashboardLayout'
import type { Invitation } from '@/types'

interface Props {
    invitations: (Invitation & { guests_count: number; rsvp_responses_count: number })[]
    stats: {
        total_invitations: number
        published_invitations: number
        total_guests: number
    }
}

const statusConfig = {
    draft: { label: 'Draft', classes: 'bg-gray-100 text-gray-600' },
    published: { label: 'Published', classes: 'bg-green-100 text-green-700' },
    suspended: { label: 'Suspended', classes: 'bg-red-100 text-red-700' },
}

export default function DashboardIndex({ invitations, stats }: Props) {
    return (
        <DashboardLayout title="Dashboard">
            <Head title="Dashboard" />

            <div className="p-6 space-y-6">
                {/* Greeting */}
                <div>
                    <h1 className="font-display text-2xl font-bold text-[#4a2c2c]">
                        Selamat datang kembali! ðŸ‘‹
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Kelola undangan pernikahanmu dari sini.
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {[
                        {
                            label: 'Total Undangan',
                            value: stats.total_invitations,
                            icon: ScrollText,
                            color: 'from-[#f2e4d8] to-[#c8956c]/20',
                            iconColor: 'text-[#8b5e5e]',
                        },
                        {
                            label: 'Dipublish',
                            value: stats.published_invitations,
                            icon: CheckCircle,
                            color: 'from-green-50 to-emerald-100/50',
                            iconColor: 'text-emerald-600',
                        },
                        {
                            label: 'Total Tamu',
                            value: stats.total_guests,
                            icon: Users,
                            color: 'from-blue-50 to-sky-100/50',
                            iconColor: 'text-sky-600',
                        },
                    ].map((stat, i) => (
                        <div key={i} className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-sm text-gray-500">{stat.label}</span>
                                <div className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${stat.color}`}>
                                    <stat.icon className={`h-4.5 w-4.5 ${stat.iconColor}`} />
                                </div>
                            </div>
                            <div className="font-display text-3xl font-bold text-[#4a2c2c]">
                                {stat.value}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Invitations */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-display text-lg font-semibold text-[#4a2c2c]">
                            Undangan Terbaru
                        </h2>
                        <Link
                            href={route('invitations.index')}
                            className="flex items-center gap-1 text-sm text-[#c8956c] hover:text-[#8b5e5e] font-medium transition-colors"
                        >
                            Lihat semua
                            <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                    </div>

                    {invitations.length === 0 ? (
                        <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-white p-12 text-center">
                            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#f2e4d8] to-[#c8956c]/20">
                                <ScrollText className="h-7 w-7 text-[#8b5e5e]" />
                            </div>
                            <h3 className="font-display text-lg font-semibold text-[#4a2c2c] mb-2">
                                Belum ada undangan
                            </h3>
                            <p className="text-sm text-gray-500 mb-6">
                                Mulai buat undangan pernikahan digitalmu sekarang â€” gratis!
                            </p>
                            <Link
                                href={route('invitations.create')}
                                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#c8956c] to-[#8b5e5e] px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:shadow-lg hover:scale-[1.02] transition-all"
                            >
                                <Plus className="h-4 w-4" />
                                Buat Undangan Pertamamu
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {invitations.map((invitation) => {
                                const status = statusConfig[invitation.status]
                                return (
                                    <div
                                        key={invitation.id}
                                        className="group rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                                    >
                                        {/* Card header */}
                                        <div className="h-24 rounded-t-2xl bg-gradient-to-br from-[#f2e4d8] to-[#c8956c]/30 relative overflow-hidden flex items-center justify-center">
                                            <div className="font-display text-center px-4">
                                                <div className="text-xs text-[#c8956c] font-medium mb-1 italic">The Wedding Of</div>
                                                <div className="text-[#4a2c2c] font-bold text-sm leading-tight">
                                                    {invitation.title}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-4">
                                            <div className="flex items-start justify-between gap-2 mb-3">
                                                <div className="min-w-0">
                                                    <h3 className="font-semibold text-gray-800 text-sm truncate">{invitation.title}</h3>
                                                    <p className="text-xs text-gray-400 mt-0.5">/{invitation.slug}</p>
                                                </div>
                                                <span className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-xs font-medium ${status.classes}`}>
                                                    {status.label}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
                                                <span className="flex items-center gap-1">
                                                    <Users className="h-3 w-3" />
                                                    {invitation.guests_count} tamu
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <CheckCircle className="h-3 w-3" />
                                                    {invitation.rsvp_responses_count} RSVP
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                                                <Link
                                                    href={route('invitations.editor', invitation.id)}
                                                    className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-[#c8956c] to-[#8b5e5e] py-2 text-xs font-semibold text-white hover:opacity-90 transition-opacity"
                                                >
                                                    <Edit2 className="h-3 w-3" />
                                                    Edit
                                                </Link>
                                                <Link
                                                    href={route('invitations.guests.index', invitation.id)}
                                                    className="flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 p-2 text-gray-500 hover:border-[#c8956c] hover:text-[#c8956c] hover:bg-orange-50 transition-colors"
                                                    title="Kelola Tamu & RSVP"
                                                >
                                                    <Users className="h-4 w-4" />
                                                </Link>
                                                {invitation.status === 'published' && (
                                                    <Link
                                                        href={route('public.invitation', invitation.slug)}
                                                        className="flex items-center justify-center rounded-lg border border-gray-200 p-2 text-gray-500 hover:border-[#c8956c] hover:text-[#c8956c] transition-colors"
                                                        title="Lihat Website"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}

                            {/* Add new card */}
                            <Link
                                href={route('invitations.create')}
                                className="group rounded-2xl border-2 border-dashed border-gray-200 hover:border-[#c8956c]/40 bg-white hover:bg-[#f2e4d8]/10 p-6 flex flex-col items-center justify-center gap-3 text-center transition-all duration-200 min-h-[180px]"
                            >
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#f2e4d8] to-[#c8956c]/20 group-hover:scale-110 transition-transform">
                                    <Plus className="h-5 w-5 text-[#8b5e5e]" />
                                </div>
                                <div>
                                    <div className="text-sm font-semibold text-gray-700">Buat Undangan Baru</div>
                                    <div className="text-xs text-gray-400 mt-0.5">Mulai dari kosong atau template</div>
                                </div>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    )
}
