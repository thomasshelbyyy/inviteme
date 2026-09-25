import React, { useState, useEffect, useRef } from 'react'
import { X, UploadCloud, Loader2, Image as ImageIcon } from 'lucide-react'
import { router } from '@inertiajs/react'

interface Media {
    id: string
    url: string
    filename: string
    size_bytes: number
}

interface MediaPickerProps {
    isOpen: boolean
    onClose: () => void
    onSelect: (url: string) => void
}

export default function MediaPicker({ isOpen, onClose, onSelect }: MediaPickerProps) {
    const [media, setMedia] = useState<Media[]>([])
    const [loading, setLoading] = useState(true)
    const [uploading, setUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const fetchMedia = async () => {
        try {
            const res = await fetch(route('media.index'), {
                headers: { 'Accept': 'application/json' }
            })
            const data = await res.json()
            setMedia(data.data || [])
        } catch (e) {
            console.error('Failed to fetch media', e)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (isOpen) {
            fetchMedia()
        }
    }, [isOpen])

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return
        
        const file = e.target.files[0]
        if (file.size > 5 * 1024 * 1024) {
            alert('File size exceeds 5MB limit.')
            return
        }

        setUploading(true)
        const formData = new FormData()
        formData.append('file', file)

        try {
            // we use fetch instead of inertia router to avoid full page reload side effects in modal
            const res = await fetch(route('media.store'), {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': (document.head.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || ''
                },
                body: formData
            })
            if (res.ok) {
                const data = await res.json()
                setMedia(prev => [data.media, ...prev])
                if (fileInputRef.current) fileInputRef.current.value = ''
            } else {
                alert('Gagal mengupload media.')
            }
        } catch (e) {
            alert('Error saat mengupload.')
        } finally {
            setUploading(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50/50">
                    <div>
                        <h3 className="font-semibold text-lg text-[#4a2c2c]">Pilih Media</h3>
                        <p className="text-sm text-gray-500">Pilih gambar dari library Anda atau upload baru.</p>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Toolbar */}
                <div className="px-6 py-3 border-b flex justify-between items-center">
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
                        className="inline-flex items-center gap-2 rounded-lg bg-[#c8956c] px-4 py-2 text-sm font-medium text-white hover:bg-[#8b5e5e] transition-colors disabled:opacity-50"
                    >
                        {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
                        {uploading ? 'Mengupload...' : 'Upload Baru'}
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto flex-1 bg-gray-50">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                            <Loader2 className="w-8 h-8 animate-spin mb-4 text-[#c8956c]" />
                            <p>Memuat media library...</p>
                        </div>
                    ) : media.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-gray-400 text-center">
                            <ImageIcon className="w-12 h-12 mb-4 text-gray-300" />
                            <p className="text-gray-600 font-medium mb-1">Belum ada media</p>
                            <p className="text-sm text-gray-400">Silakan upload gambar pertama Anda.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                            {media.map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        onSelect(item.url)
                                        onClose()
                                    }}
                                    className="group relative aspect-square rounded-xl border border-gray-200 overflow-hidden hover:border-[#c8956c] hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-[#c8956c] focus:ring-offset-2"
                                >
                                    <img src={item.url} alt={item.filename} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
