import React from 'react'
import BlockSettingsPanel from '../components/BlockSettingsPanel'

export default function HeroProperties({ props, onChange }: any) {
    const handleChange = (key: string, value: any) => {
        onChange({ [key]: value })
    }

    return (
        <div className="space-y-4">
            <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Label Atas</label>
                <input 
                    type="text" 
                    value={props.title || ''} 
                    onChange={(e) => handleChange('title', e.target.value)}
                    className="w-full text-sm border-gray-200 rounded-lg focus:ring-[#c8956c] focus:border-[#c8956c]"
                />
            </div>
            
            <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Nama Pasangan</label>
                <textarea 
                    value={props.coupleNames || ''} 
                    onChange={(e) => handleChange('coupleNames', e.target.value)}
                    rows={2}
                    className="w-full text-sm border-gray-200 rounded-lg focus:ring-[#c8956c] focus:border-[#c8956c]"
                />
            </div>

            <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Subjudul / Pesan Singkat</label>
                <textarea 
                    value={props.subtitle || ''} 
                    onChange={(e) => handleChange('subtitle', e.target.value)}
                    rows={3}
                    className="w-full text-sm border-gray-200 rounded-lg focus:ring-[#c8956c] focus:border-[#c8956c]"
                />
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Tinggi Block</label>
                    <select 
                        value={props.height || 'screen'} 
                        onChange={(e) => handleChange('height', e.target.value)}
                        className="w-full text-sm border-gray-200 rounded-lg focus:ring-[#c8956c] focus:border-[#c8956c]"
                    >
                        <option value="screen">Full Screen</option>
                        <option value="auto">Menyesuaikan</option>
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Perataan Teks</label>
                    <select 
                        value={props.textAlign || 'center'} 
                        onChange={(e) => handleChange('textAlign', e.target.value)}
                        className="w-full text-sm border-gray-200 rounded-lg focus:ring-[#c8956c] focus:border-[#c8956c]"
                    >
                        <option value="left">Kiri</option>
                        <option value="center">Tengah</option>
                        <option value="right">Kanan</option>
                    </select>
                </div>
            </div>

            <BlockSettingsPanel props={props} onChange={handleChange} />
        </div>
    )
}
