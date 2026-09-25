import React from 'react'
import BlockSettingsPanel from '../components/BlockSettingsPanel'

export default function CountdownProperties({ props, onChange }: any) {
    const handleChange = (key: string, value: any) => {
        onChange({ [key]: value })
    }

    return (
        <div className="space-y-4">
            <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Tanggal & Waktu Acara</label>
                <input 
                    type="datetime-local" 
                    value={props.targetDate ? new Date(props.targetDate).toISOString().slice(0, 16) : ''} 
                    onChange={(e) => handleChange('targetDate', new Date(e.target.value).toISOString())}
                    className="w-full text-sm border-gray-200 rounded-lg focus:ring-[#c8956c] focus:border-[#c8956c]"
                />
            </div>

            <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Label / Judul</label>
                <input 
                    type="text" 
                    value={props.label || ''} 
                    onChange={(e) => handleChange('label', e.target.value)}
                    className="w-full text-sm border-gray-200 rounded-lg focus:ring-[#c8956c] focus:border-[#c8956c]"
                />
            </div>

            <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Teks Setelah Selesai</label>
                <input 
                    type="text" 
                    value={props.completedText || ''} 
                    onChange={(e) => handleChange('completedText', e.target.value)}
                    className="w-full text-sm border-gray-200 rounded-lg focus:ring-[#c8956c] focus:border-[#c8956c]"
                />
            </div>

            <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Gaya Tampilan</label>
                <select 
                    value={props.style || 'boxes'} 
                    onChange={(e) => handleChange('style', e.target.value)}
                    className="w-full text-sm border-gray-200 rounded-lg focus:ring-[#c8956c] focus:border-[#c8956c]"
                >
                    <option value="boxes">Kotak-kotak (Boxes)</option>
                    <option value="minimal">Minimalis</option>
                </select>
            </div>

            <BlockSettingsPanel props={props} onChange={handleChange} />
        </div>
    )
}
