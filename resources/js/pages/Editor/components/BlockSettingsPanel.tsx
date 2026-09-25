import React, { useState } from 'react'
import MediaPicker from './MediaPicker'

export default function BlockSettingsPanel({ props, onChange }: { props: any, onChange: (key: string, value: any) => void }) {
    const [isPickerOpen, setIsPickerOpen] = useState(false)

    return (
        <div className="space-y-4 pt-4 mt-4 border-t border-gray-200">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Desain & Layout</h4>
            
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Jarak Atas</label>
                    <select 
                        value={props.paddingTop || 'pt-12'} 
                        onChange={(e) => onChange('paddingTop', e.target.value)}
                        className="w-full text-sm border-gray-200 rounded-lg focus:ring-[#c8956c] focus:border-[#c8956c]"
                    >
                        <option value="pt-0">Tidak Ada (0)</option>
                        <option value="pt-4">Sangat Kecil</option>
                        <option value="pt-8">Kecil</option>
                        <option value="pt-12">Sedang</option>
                        <option value="pt-20">Besar</option>
                        <option value="pt-32">Sangat Besar</option>
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Jarak Bawah</label>
                    <select 
                        value={props.paddingBottom || 'pb-12'} 
                        onChange={(e) => onChange('paddingBottom', e.target.value)}
                        className="w-full text-sm border-gray-200 rounded-lg focus:ring-[#c8956c] focus:border-[#c8956c]"
                    >
                        <option value="pb-0">Tidak Ada (0)</option>
                        <option value="pb-4">Sangat Kecil</option>
                        <option value="pb-8">Kecil</option>
                        <option value="pb-12">Sedang</option>
                        <option value="pb-20">Besar</option>
                        <option value="pb-32">Sangat Besar</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Warna Background</label>
                    <div className="flex items-center gap-2">
                        <input 
                            type="color" 
                            value={props.backgroundColor && props.backgroundColor !== 'transparent' ? props.backgroundColor : '#ffffff'} 
                            onChange={(e) => onChange('backgroundColor', e.target.value)}
                            className="w-8 h-8 rounded cursor-pointer border border-gray-200 p-0.5"
                        />
                        <button 
                            onClick={() => onChange('backgroundColor', 'transparent')}
                            className="text-xs text-gray-500 hover:text-gray-700 underline"
                        >
                            Reset
                        </button>
                    </div>
                </div>
            </div>

            <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Gambar Background</label>
                <div className="flex gap-2">
                    <input 
                        type="text" 
                        value={props.backgroundImage || ''} 
                        onChange={(e) => onChange('backgroundImage', e.target.value)}
                        placeholder="https://..."
                        className="w-full text-sm border-gray-200 rounded-lg focus:ring-[#c8956c] focus:border-[#c8956c]"
                    />
                    <button
                        onClick={() => setIsPickerOpen(true)}
                        className="px-3 py-1.5 bg-[#c8956c] text-white rounded-lg hover:bg-[#8b5e5e] transition-colors text-xs font-medium whitespace-nowrap"
                    >
                        Pilih
                    </button>
                </div>
            </div>

            <div>
                <label className="flex items-center justify-between text-xs font-medium text-gray-700 mb-1">
                    <span>Opasitas Gambar (Gelap)</span>
                    <span>{Math.round((props.overlayOpacity || 0) * 100)}%</span>
                </label>
                <input 
                    type="range" 
                    min="0" max="1" step="0.1"
                    value={props.overlayOpacity || 0} 
                    onChange={(e) => onChange('overlayOpacity', parseFloat(e.target.value))}
                    className="w-full accent-[#c8956c]"
                />
            </div>

            <MediaPicker 
                isOpen={isPickerOpen}
                onClose={() => setIsPickerOpen(false)}
                onSelect={(url) => onChange('backgroundImage', url)}
            />
        </div>
    )
}
