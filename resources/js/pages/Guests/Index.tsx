import React, { useState } from 'react'
import { Head, router, Link } from '@inertiajs/react'
import {
    UserPlus, Trash2, Edit2, Link2, Copy, CheckCheck,
    Users, ArrowLeft, Search, Filter, ChevronDown,
    Phone, Mail, MapPin, Tag, ClipboardList, X
} from 'lucide-react'
import DashboardLayout from '@/layouts/DashboardLayout'
import Modal from '@/components/Modal'
import type { Guest, Invitation } from '@/types'

interface Props {
    invitation: Pick<Invitation, 'id' | 'title' | 'slug' | 'status'>
    guests: {
        data: Guest[]
        total: number
        current_page: number
        last_page: number
    }
}

const RSVP_BADGE: Record<string, { label: string; class: string }> = {
    pending: { label: 'Menunggu', class: 'bg-yellow-100 text-yellow-700' },
    confirmed: { label: 'Hadir', class: 'bg-green-100 text-green-700' },
    declined: { label: 'Tidak Hadir', class: 'bg-red-100 text-red-700' },
}

export default function GuestsIndex({ invitation, guests }: Props) {
    const [search, setSearch] = useState('')
    const [showAddForm, setShowAddForm] = useState(false)
    const [editingGuest, setEditingGuest] = useState<Guest | null>(null)
    const [copiedToken, setCopiedToken] = useState<string | null>(null)

    // Form state
    const [form, setForm] = useState({ name: '', phone: '', email: '', group: '', address: '' })
    const [isSubmitting, setIsSubmitting] = useState(false)

    const filteredGuests = guests.data.filter(g =>
        g.name.toLowerCase().includes(search.toLowerCase()) ||
        g.group?.toLowerCase().includes(search.toLowerCase()) ||
        g.phone?.includes(search)
    )

    const handleAddGuest = (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        router.post(route('invitations.guests.store', invitation.id), form, {
            onSuccess: () => {
                setForm({ name: '', phone: '', email: '', group: '', address: '' })
                setShowAddForm(false)
            },
            onFinish: () => setIsSubmitting(false),
        })
    }

    const handleUpdateGuest = (e: React.FormEvent) => {
        if (!editingGuest) return
        e.preventDefault()
        setIsSubmitting(true)
        router.put(route('invitations.guests.update', [invitation.id, editingGuest.id]), form, {
            onSuccess: () => setEditingGuest(null),
            onFinish: () => setIsSubmitting(false),
        })
    }

    const handleDelete = (guest: Guest) => {
        if (!confirm(`Hapus tamu "${guest.name}"?`)) return
        router.delete(route('invitations.guests.destroy', [invitation.id, guest.id]))
    }

    const handleCopyLink = async (guest: Guest) => {
        const url = `${window.location.origin}/${invitation.slug}?to=${guest.token}`
        await navigator.clipboard.writeText(url)
        setCopiedToken(guest.token)
        setTimeout(() => setCopiedToken(null), 2000)
    }

    const openEditForm = (guest: Guest) => {
        setEditingGuest(guest)
        setForm({
            name: guest.name,
            phone: guest.phone ?? '',
            email: guest.email ?? '',
            group: guest.group ?? '',
            address: guest.address ?? '',
        })
    }

    const GuestFormFields = () => (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nama Lengkap <span className="text-red-500">*</span></label>
                <input
                    type="text"
                    required
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Cth: Budi Santoso"
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm transition-all focus:border-[#c8956c] focus:outline-none focus:ring-4 focus:ring-[#c8956c]/15"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nomor HP</label>
                <input
                    type="text"
                    value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    placeholder="08xxxxxxxxxx"
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm transition-all focus:border-[#c8956c] focus:outline-none focus:ring-4 focus:ring-[#c8956c]/15"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="budi@email.com"
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm transition-all focus:border-[#c8956c] focus:outline-none focus:ring-4 focus:ring-[#c8956c]/15"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Grup / Keluarga</label>
                <input
                    type="text"
                    value={form.group}
                    onChange={e => setForm(f => ({ ...f, group: e.target.value }))}
                    placeholder="Cth: Keluarga Bapak"
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm transition-all focus:border-[#c8956c] focus:outline-none focus:ring-4 focus:ring-[#c8956c]/15"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Alamat</label>
                <input
                    type="text"
                    value={form.address}
                    onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                    placeholder="Jakarta"
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm transition-all focus:border-[#c8956c] focus:outline-none focus:ring-4 focus:ring-[#c8956c]/15"
                />
            </div>
        </div>
    )

    return (
        <DashboardLayout title="Daftar Tamu">
            <Head title={`Tamu â€” ${invitation.title}`} />

            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <Link
                            href={route('invitations.index')}
                            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                        <div>
                            <h1 className="font-display text-xl font-bold text-[#4a2c2c]">Daftar Tamu</h1>
                            <p className="text-xs text-gray-500 mt-0.5">{invitation.title} Â· {guests.total} tamu</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link
                            href={route('invitations.rsvp', invitation.id)}
                            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            <ClipboardList className="h-4 w-4" />
                            RSVP
                        </Link>
                        <button
                            onClick={() => { setShowAddForm(true); setEditingGuest(null); setForm({ name: '', phone: '', email: '', group: '', address: '' }); }}
                            className="inline-flex items-center gap-2 rounded-xl bg-[#c8956c] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#8b5e5e] transition-colors"
                        >
                            <UserPlus className="h-4 w-4" />
                            Tambah Tamu
                        </button>
                    </div>
                </div>

                {/* Add Guest form */}
                {showAddForm && (
                    <div className="rounded-2xl bg-white border border-[#c8956c]/30 shadow-sm p-6 mb-6">
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="font-semibold text-gray-900 text-lg">Tambah Tamu Baru</h3>
                            <button onClick={() => setShowAddForm(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleAddGuest} className="space-y-4">
                            <GuestFormFields />
                            <div className="flex justify-end gap-3 pt-4 mt-6 border-t border-gray-100">
                                <button type="button" onClick={() => setShowAddForm(false)} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">
                                    Batal
                                </button>
                                <button type="submit" disabled={isSubmitting} className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#c8956c] to-[#8b5e5e] text-sm font-semibold text-white hover:shadow-md disabled:opacity-60 transition-all">
                                    {isSubmitting ? 'Menyimpan...' : 'Simpan Tamu'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Edit Guest form */}
                {editingGuest && (
                    <div className="rounded-2xl bg-white border border-blue-200 shadow-sm p-6 mb-6">
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="font-semibold text-gray-900 text-lg">Edit Tamu: {editingGuest.name}</h3>
                            <button onClick={() => setEditingGuest(null)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleUpdateGuest} className="space-y-4">
                            <GuestFormFields />
                            <div className="flex justify-end gap-3 pt-4 mt-6 border-t border-gray-100">
                                <button type="button" onClick={() => setEditingGuest(null)} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">
                                    Batal
                                </button>
                                <button type="submit" disabled={isSubmitting} className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#c8956c] to-[#8b5e5e] text-sm font-semibold text-white hover:shadow-md disabled:opacity-60 transition-all">
                                    {isSubmitting ? 'Menyimpan...' : 'Update Tamu'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Search */}
                {guests.total > 0 && (
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Cari nama, grup, atau nomor HP..."
                            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-[#c8956c] focus:border-[#c8956c] bg-white"
                        />
                    </div>
                )}

                {/* Guest list */}
                {guests.total === 0 ? (
                    <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-white p-12 text-center">
                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#f2e4d8] to-[#c8956c]/20">
                            <Users className="h-7 w-7 text-[#8b5e5e]" />
                        </div>
                        <h3 className="font-display text-lg font-semibold text-[#4a2c2c] mb-2">Belum ada tamu</h3>
                        <p className="text-sm text-gray-500 mb-6">Tambahkan nama-nama tamu undangan untuk membuat link personal.</p>
                        <button
                            onClick={() => setShowAddForm(true)}
                            className="inline-flex items-center gap-2 rounded-xl bg-[#c8956c] px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-[#8b5e5e] transition-colors"
                        >
                            <UserPlus className="h-4 w-4" />
                            Tambah Tamu Pertama
                        </button>
                    </div>
                ) : (
                    <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-100">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Nama</th>
                                        <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Kontak</th>
                                        <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Grup</th>
                                        <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status RSVP</th>
                                        <th className="py-3 px-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {filteredGuests.map(guest => {
                                        const badge = RSVP_BADGE[guest.rsvp_status] ?? RSVP_BADGE.pending
                                        return (
                                            <tr key={guest.id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="py-3 px-4">
                                                    <div className="font-medium text-gray-800 text-sm">{guest.name}</div>
                                                    {guest.address && (
                                                        <div className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5">
                                                            <MapPin className="h-2.5 w-2.5" />{guest.address}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="py-3 px-4 hidden sm:table-cell">
                                                    <div className="space-y-0.5">
                                                        {guest.phone && (
                                                            <div className="text-xs text-gray-500 flex items-center gap-1">
                                                                <Phone className="h-3 w-3" />{guest.phone}
                                                            </div>
                                                        )}
                                                        {guest.email && (
                                                            <div className="text-xs text-gray-500 flex items-center gap-1">
                                                                <Mail className="h-3 w-3" />{guest.email}
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4 hidden md:table-cell">
                                                    {guest.group ? (
                                                        <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                                                            <Tag className="h-3 w-3" />{guest.group}
                                                        </span>
                                                    ) : (
                                                        <span className="text-xs text-gray-300">â€”</span>
                                                    )}
                                                </td>
                                                <td className="py-3 px-4">
                                                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${badge.class}`}>
                                                        {badge.label}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center justify-end gap-1">
                                                        {/* Copy link */}
                                                        <button
                                                            onClick={() => handleCopyLink(guest)}
                                                            title="Salin link personal"
                                                            className="p-1.5 rounded-lg text-gray-400 hover:text-[#c8956c] hover:bg-rose-50 transition-colors"
                                                        >
                                                            {copiedToken === guest.token ? (
                                                                <CheckCheck className="h-4 w-4 text-green-500" />
                                                            ) : (
                                                                <Link2 className="h-4 w-4" />
                                                            )}
                                                        </button>
                                                        {/* Edit */}
                                                        <button
                                                            onClick={() => openEditForm(guest)}
                                                            title="Edit tamu"
                                                            className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                                                        >
                                                            <Edit2 className="h-4 w-4" />
                                                        </button>
                                                        {/* Delete */}
                                                        <button
                                                            onClick={() => handleDelete(guest)}
                                                            title="Hapus tamu"
                                                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    )
}
