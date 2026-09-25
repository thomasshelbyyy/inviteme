import { Head, Link } from '@inertiajs/react'
import { LayoutTemplate, ArrowRight } from 'lucide-react'
import DashboardLayout from '@/layouts/DashboardLayout'
import type { InvitationTemplate } from '@/types'

interface Props {
    templates: InvitationTemplate[]
}

export default function TemplatesIndex({ templates }: Props) {
    return (
        <DashboardLayout title="Template">
            <Head title="Galeri Template" />
            <div className="p-6 space-y-6">
                <div>
                    <h1 className="font-display text-2xl font-bold text-[#4a2c2c]">Galeri Template</h1>
                    <p className="text-gray-500 text-sm mt-1">Pilih desain awal untuk undangan pernikahan digitalmu.</p>
                </div>

                {templates.length === 0 ? (
                    <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-white p-12 text-center">
                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#f2e4d8] to-[#c8956c]/20">
                            <LayoutTemplate className="h-7 w-7 text-[#8b5e5e]" />
                        </div>
                        <h3 className="font-display text-lg font-semibold text-[#4a2c2c] mb-2">
                            Belum ada template
                        </h3>
                        <p className="text-sm text-gray-500 mb-6">
                            Admin belum menambahkan template. Silakan buat undangan dari kanvas kosong.
                        </p>
                        <Link
                            href={route('invitations.create')}
                            className="inline-flex items-center gap-2 rounded-xl bg-[#c8956c] px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-[#8b5e5e] transition-colors"
                        >
                            Buat Undangan Kosong
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {templates.map((template) => (
                            <div
                                key={template.id}
                                className="group flex flex-col rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
                            >
                                <div className="aspect-[3/4] bg-gray-100 relative overflow-hidden flex items-center justify-center">
                                    {template.thumbnail_url ? (
                                        <img 
                                            src={template.thumbnail_url} 
                                            alt={template.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="text-gray-400 font-medium">Tanpa Thumbnail</div>
                                    )}
                                    
                                    {template.is_premium && (
                                        <div className="absolute top-3 right-3 bg-gradient-to-r from-amber-400 to-orange-400 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
                                            PREMIUM
                                        </div>
                                    )}
                                    
                                    {/* Hover overlay */}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
                                        <button
                                            className="px-5 py-2 bg-white text-[#4a2c2c] text-sm font-semibold rounded-lg hover:bg-gray-100 transition-colors shadow-sm"
                                        >
                                            Gunakan Template
                                        </button>
                                        <button
                                            className="px-5 py-2 border border-white text-white text-sm font-medium rounded-lg hover:bg-white/20 transition-colors"
                                        >
                                            Preview
                                        </button>
                                    </div>
                                </div>

                                <div className="p-4 flex-1 flex flex-col justify-between">
                                    <div>
                                        <h3 className="font-semibold text-gray-800 text-sm truncate">{template.name}</h3>
                                        <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                                            {template.description || 'Template elegan untuk momen spesial.'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    )
}
