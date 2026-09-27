import React, { useState } from 'react'
import MediaPicker from '../components/MediaPicker'

export default function CoverProperties({ props, onChange }: any) {
    const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false)

    const handleChange = (key: string, value: any) => {
        onChange({ [key]: value })
    }

    return (
        <div className="space-y-4">
            <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Judul (Title)</label>
                <input 
                    type="text" 
                    value={props.title || ''} 
                    onChange={(e) => handleChange('title', e.target.value)}
                    className="w-full text-sm border-gray-200 rounded-lg focus:ring-[#c8956c] focus:border-[#c8956c]"
                />
            </div>
            
            <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Subjudul</label>
                <textarea 
                    value={props.subtitle || ''} 
                    onChange={(e) => handleChange('subtitle', e.target.value)}
                    rows={2}
                    className="w-full text-sm border-gray-200 rounded-lg focus:ring-[#c8956c] focus:border-[#c8956c]"
                />
            </div>

            <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Teks Tombol</label>
                <input 
                    type="text" 
                    value={props.buttonText || ''} 
                    onChange={(e) => handleChange('buttonText', e.target.value)}
                    className="w-full text-sm border-gray-200 rounded-lg focus:ring-[#c8956c] focus:border-[#c8956c]"
                />
            </div>

            <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Gambar Background</label>
                <div className="flex gap-2">
                    <input 
                        type="text" 
                        value={props.bgImage || ''} 
                        onChange={(e) => handleChange('bgImage', e.target.value)}
                        placeholder="https://..."
                        className="w-full text-sm border-gray-200 rounded-lg focus:ring-[#c8956c] focus:border-[#c8956c]"
                    />
                    <button
                        onClick={() => setIsMediaPickerOpen(true)}
                        className="px-3 py-1.5 bg-[#c8956c] text-white rounded-lg hover:bg-[#8b5e5e] transition-colors text-xs font-medium whitespace-nowrap"
                    >
                        Pilih
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Warna Overlay</label>
                    <div className="flex items-center gap-2">
                        <input 
                            type="color" 
                            value={props.overlayColor || '#000000'} 
                            onChange={(e) => handleChange('overlayColor', e.target.value)}
                            className="w-8 h-8 rounded cursor-pointer border border-gray-200 p-0.5"
                        />
                    </div>
                </div>
            </div>

            <div>
                <label className="flex items-center justify-between text-xs font-medium text-gray-700 mb-1">
                    <span>Opasitas Overlay</span>
                    <span>{props.overlayOpacity !== undefined ? props.overlayOpacity : 50}%</span>
                </label>
                <input 
                    type="range" 
                    min="0" max="100" step="1"
                    value={props.overlayOpacity !== undefined ? props.overlayOpacity : 50} 
                    onChange={(e) => handleChange('overlayOpacity', parseInt(e.target.value))}
                    className="w-full accent-[#c8956c]"
                />
            </div>

            <MediaPicker
                isOpen={isMediaPickerOpen}
                onClose={() => setIsMediaPickerOpen(false)}
                onSelect={(url) => handleChange('bgImage', url)}
            />
        </div>
    )
}
