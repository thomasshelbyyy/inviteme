import React, { useCallback, useRef, useState } from 'react'
import { Head, router } from '@inertiajs/react'
import DashboardLayout from '@/layouts/DashboardLayout'
import { UploadCloud, Trash2, Loader2, Image as ImageIcon } from 'lucide-react'

interface Media {
    id: string
    url: string
    filename: string
    size_bytes: number
    mime_type: string
}

interface Props {
    media: {
        data: Media[]
        links: any[]
        current_page: number
        last_page: number
    }
}

export default function MediaIndex({ media }: Props) {
    const [uploading, setUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return
        
        const file = e.target.files[0]
        if (file.size > 5 * 1024 * 1024) {
            alert('File size exceeds 5MB limit.')
            return
        }

        setUploading(true)
        const formData = new FormData()
        formData.append('file', file)

        router.post(route('media.store'), formData, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                if (fileInputRef.current) fileInputRef.current.value = ''
            },
            onError: (errors) => {
                alert(errors.file || 'Gagal mengupload media.')
            },
            onFinish: () => setUploading(false)
        })
    }

    const handleDelete = (id: string) => {
        if (confirm('Yakin ingin menghapus media ini?')) {
            router.delete(route('media.destroy', id), {
                preserveScroll: true
            })
        }
    }

    return (
        <DashboardLayout title="Media Library">
            <Head title="Media Library" />
            
            <div className="p-6 max-w-6xl mx-auto space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="font-display text-2xl font-bold text-[#4a2c2c]">Media Library</h1>
                        <p className="text-gray-500 text-sm mt-1">Kelola aset gambar untuk undangan Anda.</p>
                    </div>

                    <div>
                        <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                        />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading}
                            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#c8956c] to-[#8b5e5e] px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:shadow-lg transition-all disabled:opacity-70"
                        >
                            {uploading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <UploadCloud className="h-4 w-4" />
                            )}
                            {uploading ? 'Mengupload...' : 'Upload Media'}
                        </button>
                    </div>
                </div>

                {media.data.length === 0 ? (
                    <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-white p-12 text-center">
                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#f2e4d8] to-[#c8956c]/20">
                            <ImageIcon className="h-7 w-7 text-[#8b5e5e]" />
                        </div>
                        <h3 className="font-display text-lg font-semibold text-[#4a2c2c] mb-2">
                            Belum ada media
                        </h3>
                        <p className="text-sm text-gray-500 mb-6">
                            Upload gambar pertama Anda untuk digunakan di desain undangan.
                        </p>
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="inline-flex items-center gap-2 rounded-xl bg-[#c8956c] px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-[#8b5e5e] transition-colors"
                        >
                            <UploadCloud className="h-4 w-4" />
                            Pilih File
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {media.data.map((item) => (
                            <div key={item.id} className="group relative rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden aspect-square">
                                <img
                                    src={item.url}
                                    alt={item.filename}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                
                                {/* Hover overlay */}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                                    <div className="flex justify-end">
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="p-1.5 bg-white/20 hover:bg-red-500 rounded-lg text-white backdrop-blur-sm transition-colors"
                                            title="Hapus Media"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                    <div className="text-white text-xs truncate">
                                        <p className="font-medium truncate">{item.filename}</p>
                                        <p className="text-white/70">{formatBytes(item.size_bytes)}</p>
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
