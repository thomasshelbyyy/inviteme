import React from 'react'
import BlockSettingsPanel from '../components/BlockSettingsPanel'

export default function RsvpProperties({ props, onChange }: any) {
    const handleChange = (key: string, value: any) => {
        onChange({ [key]: value })
    }

    return (
        <div className="space-y-4">
            <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Judul Form</label>
                <input 
                    type="text" 
                    value={props.title || ''} 
                    onChange={(e) => handleChange('title', e.target.value)}
                    className="w-full text-sm border-gray-200 rounded-lg focus:ring-[#c8956c] focus:border-[#c8956c]"
                />
            </div>
            
            <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Subjudul / Deskripsi</label>
                <textarea 
                    value={props.subtitle || ''} 
                    onChange={(e) => handleChange('subtitle', e.target.value)}
                    rows={2}
                    className="w-full text-sm border-gray-200 rounded-lg focus:ring-[#c8956c] focus:border-[#c8956c]"
                />
            </div>

            <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Batas Waktu RSVP (Opsional)</label>
                <input 
                    type="datetime-local" 
                    value={props.deadline ? props.deadline.substring(0, 16) : ''} 
                    onChange={(e) => {
                        const date = new Date(e.target.value)
                        handleChange('deadline', isNaN(date.getTime()) ? null : date.toISOString())
                    }}
                    className="w-full text-sm border-gray-200 rounded-lg focus:ring-[#c8956c] focus:border-[#c8956c]"
                />
            </div>

            <div className="space-y-2 pt-2 border-t border-gray-100">
                <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                        type="checkbox" 
                        checked={props.showGuestCount !== false} 
                        onChange={(e) => handleChange('showGuestCount', e.target.checked)}
                        className="rounded border-gray-300 text-[#c8956c] focus:ring-[#c8956c]"
                    />
                    <span className="text-sm text-gray-700">Tampilkan Input Jumlah Kehadiran</span>
                </label>
                
                <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                        type="checkbox" 
                        checked={props.showWishes !== false} 
                        onChange={(e) => handleChange('showWishes', e.target.checked)}
                        className="rounded border-gray-300 text-[#c8956c] focus:ring-[#c8956c]"
                    />
                    <span className="text-sm text-gray-700">Tampilkan Input Ucapan & Doa</span>
                </label>
            </div>

            <BlockSettingsPanel props={props} onChange={handleChange} />
        </div>
    )
}
