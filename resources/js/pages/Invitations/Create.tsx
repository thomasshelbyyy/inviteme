import { Head, Link, useForm } from '@inertiajs/react'
import { Plus, ArrowLeft } from 'lucide-react'
import DashboardLayout from '@/layouts/DashboardLayout'
import React from 'react'

interface Template {
    id: string
    name: string
    thumbnail_url: string | null
    is_premium: boolean
}

interface Props {
    templates: Template[]
}

export default function InvitationsCreate({ templates }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        slug: '',
        template_id: '',
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        post(route('invitations.store'))
    }

    return (
        <DashboardLayout title="Buat Undangan">
            <Head title="Buat Undangan" />
            <div className="max-w-3xl mx-auto p-6 space-y-6">
                <div>
                    <Link href={route('invitations.index')} className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
                        <ArrowLeft className="h-4 w-4" /> Kembali
                    </Link>
                    <h1 className="font-display text-2xl font-bold text-[#4a2c2c]">Buat Undangan Baru</h1>
                    <p className="text-gray-500 text-sm mt-1">Mulai dengan mengisi nama pasangan dan URL undangan.</p>
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
                                placeholder="Cth: Romeo & Juliet"
                                required
                            />
                            {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
                            <p className="mt-1.5 text-xs text-gray-400">Nama panggilan Anda dan pasangan, akan ditampilkan sebagai judul utama undangan.</p>
                        </div>

                        <div>
                            <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1.5">
                                URL Undangan (Opsional)
                            </label>
                            <div className="flex items-center">
                                <span className="rounded-l-xl border border-r-0 border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-500">
                                    inviteme.id/
                                </span>
                                <input
                                    id="slug"
                                    type="text"
                                    value={data.slug}
                                    onChange={(e) => setData('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                                    className="w-full rounded-r-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#c8956c] focus:ring-2 focus:ring-[#c8956c]/20 transition-all"
                                    placeholder="romeo-juliet"
                                />
                            </div>
                            {errors.slug && <p className="mt-1 text-xs text-red-500">{errors.slug}</p>}
                            <p className="mt-1.5 text-xs text-gray-400">Hanya boleh huruf kecil, angka, dan strip (-). Kosongkan untuk dibuat otomatis.</p>
                        </div>

                        {/* Optional template selector could go here if cloning */}
                        {/* Currently InvitationController@store only takes title/slug and makes default design */}

                        <div className="pt-4 flex justify-end">
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#c8956c] to-[#8b5e5e] px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:shadow-lg hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                            >
                                {processing ? 'Menyimpan...' : 'Lanjutkan ke Editor'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </DashboardLayout>
    )
}
