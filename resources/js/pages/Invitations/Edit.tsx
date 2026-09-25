import { Head, Link, useForm } from '@inertiajs/react'
import { ArrowLeft, Save } from 'lucide-react'
import DashboardLayout from '@/layouts/DashboardLayout'
import type { Invitation } from '@/types'
import React from 'react'

interface Props {
    invitation: Invitation
}

export default function InvitationsEdit({ invitation }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        title: invitation.title,
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        put(route('invitations.update', invitation.id))
    }

    return (
        <DashboardLayout title="Pengaturan Undangan">
            <Head title="Pengaturan Undangan" />
            <div className="max-w-3xl mx-auto p-6 space-y-6">
                <div>
                    <Link href={route('invitations.index')} className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
                        <ArrowLeft className="h-4 w-4" /> Kembali
                    </Link>
                    <h1 className="font-display text-2xl font-bold text-[#4a2c2c]">Pengaturan Undangan</h1>
                    <p className="text-gray-500 text-sm mt-1">Ubah detail undangan Anda.</p>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1.5">
                                Judul Undangan <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="title"
                                type="text"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#c8956c] focus:ring-2 focus:ring-[#c8956c]/20 transition-all"
                                required
                            />
                            {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                URL Undangan (Tidak dapat diubah)
                            </label>
                            <div className="flex items-center">
                                <span className="rounded-l-xl border border-r-0 border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-500">
                                    inviteme.id/
                                </span>
                                <input
                                    type="text"
                                    value={invitation.slug}
                                    disabled
                                    className="w-full rounded-r-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-500 cursor-not-allowed"
                                />
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end">
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#c8956c] to-[#8b5e5e] px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:shadow-lg hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                            >
                                <Save className="h-4 w-4" />
                                {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </DashboardLayout>
    )
}
