import { Head, Link, router } from '@inertiajs/react'
import { Plus, ScrollText, Users, CheckCircle, ArrowRight, Eye, Edit2, Trash2 } from 'lucide-react'
import DashboardLayout from '@/layouts/DashboardLayout'
import type { Invitation } from '@/types'

interface Props {
    invitations: {
        data: (Invitation & { guests_count: number; rsvp_responses_count: number })[]
        links: { url: string | null; label: string; active: boolean }[]
        current_page: number
        last_page: number
    }
}

const statusConfig = {
    draft: { label: 'Draft', classes: 'bg-gray-100 text-gray-600' },
    published: { label: 'Published', classes: 'bg-green-100 text-green-700' },
    suspended: { label: 'Suspended', classes: 'bg-red-100 text-red-700' },
}

export default function InvitationsIndex({ invitations }: Props) {
    const handleDelete = (id: string) => {
        if (confirm('Apakah Anda yakin ingin menghapus undangan ini? Tindakan ini tidak dapat dibatalkan.')) {
            router.delete(route('invitations.destroy', id))
        }
    }

    return (
        <DashboardLayout title="Undanganku">
            <Head title="Undanganku" />
            <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="font-display text-2xl font-bold text-[#4a2c2c]">Undanganku</h1>
                        <p className="text-gray-500 text-sm mt-1">Daftar semua undangan yang telah Anda buat.</p>
                    </div>
                    <Link
                        href={route('invitations.create')}
                        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#c8956c] to-[#8b5e5e] px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:shadow-lg hover:scale-[1.02] transition-all"
                    >
                        <Plus className="h-4 w-4" />
                        Buat Baru
                    </Link>
                </div>

                {invitations.data.length === 0 ? (
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
                            className="inline-flex items-center gap-2 rounded-xl bg-[#c8956c] px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-[#8b5e5e] transition-colors"
                        >
                            <Plus className="h-4 w-4" />
                            Buat Undangan Pertamamu
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {invitations.data.map((invitation) => {
                            const status = statusConfig[invitation.status]
                            return (
                                <div
                                    key={invitation.id}
                                    className="group flex flex-col rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200"
                                >
                                    <div className="h-28 rounded-t-2xl bg-gradient-to-br from-[#f2e4d8] to-[#c8956c]/30 relative overflow-hidden flex items-center justify-center">
                                        <div className="font-display text-center px-4">
                                            <div className="text-xs text-[#c8956c] font-medium mb-1 italic">The Wedding Of</div>
                                            <div className="text-[#4a2c2c] font-bold text-sm leading-tight">
                                                {invitation.title}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-4 flex-1 flex flex-col">
                                        <div className="flex items-start justify-between gap-2 mb-3">
                                            <div className="min-w-0">
                                                <h3 className="font-semibold text-gray-800 text-sm truncate">{invitation.title}</h3>
                                                <p className="text-xs text-gray-400 mt-0.5 truncate">/{invitation.slug}</p>
                                            </div>
                                            <span className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-xs font-medium ${status.classes}`}>
                                                {status.label}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-3 text-xs text-gray-500 mb-5">
                                            <span className="flex items-center gap-1">
                                                <Users className="h-3 w-3" />
                                                {invitation.guests_count}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <CheckCircle className="h-3 w-3" />
                                                {invitation.rsvp_responses_count}
                                            </span>
                                        </div>

                                        <div className="mt-auto grid grid-cols-2 gap-2">
                                            <Link
                                                href={route('invitations.editor', invitation.id)}
                                                className="flex items-center justify-center gap-1.5 rounded-lg bg-gray-50 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
                                            >
                                                <Edit2 className="h-3.5 w-3.5" />
                                                Editor
                                            </Link>
                                            <Link
                                                href={route('invitations.edit', invitation.id)}
                                                className="flex items-center justify-center gap-1.5 rounded-lg bg-gray-50 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
                                            >
                                                Pengaturan
                                            </Link>
                                            
                                            {invitation.status === 'published' ? (
                                                <Link
                                                    href={route('public.invitation', invitation.slug)}
                                                    className="col-span-2 flex items-center justify-center gap-1.5 rounded-lg border border-[#c8956c] py-2 text-xs font-semibold text-[#c8956c] hover:bg-[#f2e4d8]/20 transition-colors"
                                                >
                                                    <Eye className="h-3.5 w-3.5" />
                                                    Lihat Undangan
                                                </Link>
                                            ) : (
                                                <button
                                                    onClick={() => handleDelete(invitation.id)}
                                                    className="col-span-2 flex items-center justify-center gap-1.5 rounded-lg border border-red-200 text-red-600 py-2 text-xs font-semibold hover:bg-red-50 transition-colors"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                    Hapus
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}

                {/* Pagination */}
                {invitations.last_page > 1 && (
                    <div className="flex items-center justify-center gap-1 mt-8">
                        {invitations.links.map((link, i) => (
                            <Link
                                key={i}
                                href={link.url || '#'}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                                    link.active
                                        ? 'bg-[#c8956c] text-white'
                                        : link.url
                                        ? 'text-gray-600 hover:bg-gray-100'
                                        : 'text-gray-300 cursor-not-allowed'
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    )
}
