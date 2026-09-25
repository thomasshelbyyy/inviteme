import { Head, Link } from '@inertiajs/react'
import {
    ArrowLeft, Users, CheckCircle2, XCircle, Clock,
    UserCheck, MessageSquare, ChevronRight
} from 'lucide-react'
import DashboardLayout from '@/layouts/DashboardLayout'
import type { Invitation, RsvpResponse } from '@/types'

interface Stats {
    total_guests: number
    total_responses: number
    confirmed: number
    declined: number
    total_attendees: number
    pending: number
    guests_by_status: Record<string, number>
}

interface ExtendedRsvpResponse extends RsvpResponse {
    guest: {
        id: string
        name: string
        phone: string | null
        group: string | null
        rsvp_status: string
    } | null
}

interface Props {
    invitation: Pick<Invitation, 'id' | 'title' | 'slug' | 'status'>
    stats: Stats
    responses: ExtendedRsvpResponse[]
    responses_by_day: Record<string, number>
}

const StatCard = ({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color: string }) => (
    <div className="flex items-center gap-4 rounded-2xl bg-white border border-gray-100 shadow-sm p-5">
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${color}`}>
            {icon}
        </div>
        <div>
            <div className="text-2xl font-bold text-[#4a2c2c]">{value.toLocaleString()}</div>
            <div className="text-xs text-gray-500 mt-0.5">{label}</div>
        </div>
    </div>
)

export default function RsvpDashboard({ invitation, stats, responses, responses_by_day }: Props) {
    const responseRate = stats.total_guests > 0
        ? Math.round((stats.total_responses / stats.total_guests) * 100)
        : 0

    const confirmedRate = stats.total_responses > 0
        ? Math.round((stats.confirmed / stats.total_responses) * 100)
        : 0

    return (
        <DashboardLayout title="RSVP">
            <Head title={`RSVP â€” ${invitation.title}`} />

            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center gap-3">
                    <Link
                        href={route('invitations.guests.index', invitation.id)}
                        className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                    <div>
                        <h1 className="font-display text-xl font-bold text-[#4a2c2c]">Dashboard RSVP</h1>
                        <p className="text-xs text-gray-500 mt-0.5">{invitation.title}</p>
                    </div>
                </div>

                {/* Stat cards */}
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                    <StatCard
                        icon={<Users className="h-5 w-5 text-[#8b5e5e]" />}
                        label="Total Tamu"
                        value={stats.total_guests}
                        color="bg-[#f2e4d8]"
                    />
                    <StatCard
                        icon={<CheckCircle2 className="h-5 w-5 text-green-600" />}
                        label="Konfirmasi Hadir"
                        value={stats.confirmed}
                        color="bg-green-100"
                    />
                    <StatCard
                        icon={<XCircle className="h-5 w-5 text-red-400" />}
                        label="Tidak Hadir"
                        value={stats.declined}
                        color="bg-red-50"
                    />
                    <StatCard
                        icon={<UserCheck className="h-5 w-5 text-blue-500" />}
                        label="Total Tamu Hadir"
                        value={stats.total_attendees}
                        color="bg-blue-50"
                    />
                </div>

                {/* Response rate bars */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-5">
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-sm font-semibold text-gray-700">Tingkat Respons</span>
                            <span className="text-lg font-bold text-[#4a2c2c]">{responseRate}%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2.5">
                            <div
                                className="h-2.5 rounded-full bg-gradient-to-r from-[#c8956c] to-[#8b5e5e] transition-all duration-700"
                                style={{ width: `${responseRate}%` }}
                            />
                        </div>
                        <p className="text-xs text-gray-400 mt-2">{stats.total_responses} dari {stats.total_guests} tamu sudah konfirmasi</p>
                    </div>

                    <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-5">
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-sm font-semibold text-gray-700">Tingkat Kehadiran</span>
                            <span className="text-lg font-bold text-[#4a2c2c]">{confirmedRate}%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2.5">
                            <div
                                className="h-2.5 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-700"
                                style={{ width: `${confirmedRate}%` }}
                            />
                        </div>
                        <p className="text-xs text-gray-400 mt-2">{stats.confirmed} hadir dari {stats.total_responses} yang merespons</p>
                    </div>
                </div>

                {/* Response list */}
                <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                        <h3 className="font-semibold text-[#4a2c2c] text-sm flex items-center gap-2">
                            <MessageSquare className="h-4 w-4 text-[#8b5e5e]" />
                            Konfirmasi Masuk
                        </h3>
                        <span className="text-xs text-gray-400">{responses.length} respons</span>
                    </div>

                    {responses.length === 0 ? (
                        <div className="py-12 text-center">
                            <Clock className="h-8 w-8 text-gray-300 mx-auto mb-3" />
                            <p className="text-sm text-gray-400">Belum ada tamu yang konfirmasi.</p>
                            <p className="text-xs text-gray-300 mt-1">Bagikan link undangan ke daftar tamu Anda.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-50">
                            {responses.map(response => (
                                <div key={response.id} className="px-5 py-4 hover:bg-gray-50/50 transition-colors">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium text-gray-800 text-sm truncate">
                                                    {response.guest?.name ?? 'Tamu Anonim'}
                                                </span>
                                                {response.guest?.group && (
                                                    <span className="text-[10px] bg-gray-100 text-gray-500 rounded-full px-2 py-0.5 shrink-0">
                                                        {response.guest.group}
                                                    </span>
                                                )}
                                            </div>
                                            {response.message && (
                                                <p className="text-xs text-gray-500 mt-1 line-clamp-2 italic">
                                                    "{response.message}"
                                                </p>
                                            )}
                                            <p className="text-[10px] text-gray-400 mt-1">
                                                {new Date(response.submitted_at).toLocaleString('id-ID', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                        <div className="flex flex-col items-end gap-1 shrink-0">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                                                response.attendance === 'yes'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-red-100 text-red-600'
                                            }`}>
                                                {response.attendance === 'yes' ? 'âœ“ Hadir' : 'âœ— Tidak Hadir'}
                                            </span>
                                            {response.attendance === 'yes' && (
                                                <span className="text-[10px] text-gray-400">{response.attendee_count} orang</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    )
}
