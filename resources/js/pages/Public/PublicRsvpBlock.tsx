import React, { useState } from 'react'
import { Send, CheckCircle2 } from 'lucide-react'
import axios from 'axios'

export default function PublicRsvpBlock({ props, theme, slug, guest }: any) {
    const { title, subtitle, showGuestCount, showWishes, deadline } = props
    
    const [attendance, setAttendance] = useState('yes')
    const [attendeeCount, setAttendeeCount] = useState(1)
    const [message, setMessage] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [successMessage, setSuccessMessage] = useState('')
    const [error, setError] = useState('')

    // If deadline has passed, disable the form
    const isPastDeadline = deadline ? new Date(deadline).getTime() < new Date().getTime() : false

    // If guest already RSVP'd, we could show a different state, but for MVP let's allow them to update it
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (isSubmitting || isPastDeadline) return
        
        setIsSubmitting(true)
        setError('')
        
        try {
            const res = await axios.post(`/${slug}/rsvp`, {
                token: guest?.token || null,
                attendance,
                attendee_count: attendeeCount,
                message
            })
            
            setSuccessMessage(res.data.message || 'RSVP berhasil dikirim.')
        } catch (err: any) {
            setError(err.response?.data?.message || 'Gagal mengirim RSVP. Silakan coba lagi nanti.')
        } finally {
            setIsSubmitting(false)
        }
    }

    if (successMessage) {
        return (
            <div className="py-16 px-4 w-full">
                <div className="max-w-md mx-auto text-center bg-white rounded-2xl p-8 shadow-sm border border-green-100">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 mb-4">
                        <CheckCircle2 className="h-7 w-7 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Terima Kasih!</h3>
                    <p className="text-gray-500">{successMessage}</p>
                </div>
            </div>
        )
    }

    return (
        <div className="py-16 px-6 w-full relative">
            <div className="max-w-md mx-auto text-center relative z-10">
                {title && (
                    <h3 
                        style={{ fontFamily: theme?.fontHeading, color: theme?.primaryColor }} 
                        className="text-3xl font-medium mb-2"
                    >
                        {title}
                    </h3>
                )}
                
                {subtitle && (
                    <p style={{ fontFamily: theme?.fontBody }} className="text-gray-600 text-sm mb-8">
                        {subtitle}
                    </p>
                )}

                {isPastDeadline ? (
                    <div className="bg-red-50 rounded-2xl p-6 border border-red-100 text-red-600 text-sm">
                        Maaf, batas waktu konfirmasi kehadiran telah berakhir pada {new Date(deadline).toLocaleDateString('id-ID')}.
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-left space-y-4">
                        {error && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                            <input 
                                type="text" 
                                value={guest ? guest.name : 'Tamu Undangan (Anonim)'}
                                disabled
                                className="w-full bg-gray-50 border-gray-200 rounded-xl text-sm py-2.5 px-3 text-gray-500 font-medium"
                            />
                            {!guest && (
                                <p className="text-xs text-gray-400 mt-1">
                                    Anda membuka undangan tanpa link personal. RSVP akan tercatat sebagai anonim.
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Konfirmasi Kehadiran</label>
                            <select 
                                value={attendance}
                                onChange={(e) => setAttendance(e.target.value)}
                                className="w-full border-gray-200 rounded-xl text-sm py-2.5 px-3 focus:ring-[#c8956c] focus:border-[#c8956c]"
                            >
                                <option value="yes">Ya, Saya akan hadir</option>
                                <option value="no">Maaf, Saya tidak bisa hadir</option>
                            </select>
                        </div>

                        {showGuestCount && attendance === 'yes' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah Kehadiran</label>
                                <select 
                                    value={attendeeCount}
                                    onChange={(e) => setAttendeeCount(parseInt(e.target.value))}
                                    className="w-full border-gray-200 rounded-xl text-sm py-2.5 px-3 focus:ring-[#c8956c] focus:border-[#c8956c]"
                                >
                                    {[1, 2, 3, 4, 5].map(num => (
                                        <option key={num} value={num}>{num} Orang</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {showWishes && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Ucapan & Doa (Opsional)</label>
                                <textarea 
                                    rows={3}
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Tuliskan ucapan dan doa..."
                                    className="w-full border-gray-200 rounded-xl text-sm py-2 px-3 focus:ring-[#c8956c] focus:border-[#c8956c]"
                                />
                            </div>
                        )}

                        <button 
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white shadow-md hover:opacity-90 disabled:opacity-70 transition-opacity"
                            style={{ backgroundColor: theme?.accentColor || '#C8956C' }}
                        >
                            {isSubmitting ? (
                                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <Send className="h-4 w-4" />
                            )}
                            Kirim Konfirmasi
                        </button>
                    </form>
                )}
            </div>
        </div>
    )
}
