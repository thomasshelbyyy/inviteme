import React from 'react'
import { Send } from 'lucide-react'
import BlockWrapper from './BlockWrapper'

export default function RsvpBlock({ props, theme }: any) {
    const { title, subtitle, showGuestCount, showWishes } = props
    
    return (
        <BlockWrapper props={props} theme={theme} className="px-4 w-full bg-white/50 backdrop-blur-sm border-y border-gray-100">
            <div className="max-w-md mx-auto text-center w-full relative z-10">
                {title && (
                    <h3 
                        style={{ fontFamily: theme?.fontHeading, color: theme?.primaryColor }} 
                        className="text-3xl font-medium mb-2"
                    >
                        {title}
                    </h3>
                )}
                
                {subtitle && (
                    <p style={{ fontFamily: theme?.fontBody }} className="text-gray-500 text-sm mb-8">
                        {subtitle}
                    </p>
                )}

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-left space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                        <input 
                            type="text" 
                            disabled
                            placeholder="Akan terisi otomatis dari link tamu"
                            className="w-full bg-gray-50 border-gray-200 rounded-xl text-sm py-2.5 px-3 text-gray-400 cursor-not-allowed"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Konfirmasi Kehadiran</label>
                        <select 
                            disabled
                            className="w-full bg-gray-50 border-gray-200 rounded-xl text-sm py-2.5 px-3 text-gray-400 cursor-not-allowed"
                        >
                            <option>Ya, Saya akan hadir</option>
                        </select>
                    </div>

                    {showGuestCount && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah Kehadiran</label>
                            <select 
                                disabled
                                className="w-full bg-gray-50 border-gray-200 rounded-xl text-sm py-2.5 px-3 text-gray-400 cursor-not-allowed"
                            >
                                <option>1 Orang</option>
                            </select>
                        </div>
                    )}

                    {showWishes && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Ucapan & Doa</label>
                            <textarea 
                                disabled
                                rows={3}
                                placeholder="Tuliskan ucapan dan doa..."
                                className="w-full bg-gray-50 border-gray-200 rounded-xl text-sm py-2 px-3 text-gray-400 cursor-not-allowed"
                            />
                        </div>
                    )}

                    <button 
                        disabled
                        className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white shadow-md opacity-70 cursor-not-allowed"
                        style={{ backgroundColor: theme?.accentColor }}
                    >
                        <Send className="h-4 w-4" />
                        Kirim Konfirmasi
                    </button>
                    <p className="text-center text-xs text-gray-400 mt-3">
                        *(Ini adalah tampilan preview, form tidak dapat diisi di editor)
                    </p>
                </div>
            </div>
        </BlockWrapper>
    )
}
