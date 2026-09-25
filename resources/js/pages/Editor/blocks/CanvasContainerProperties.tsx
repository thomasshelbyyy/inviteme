import React, { useState } from 'react'
import BlockSettingsPanel from '../components/BlockSettingsPanel'
import MediaPicker from '../components/MediaPicker'

/**
 * Properties panel for CanvasContainerBlock.
 * Controls the canvas dimensions (referenceWidth + containerHeight)
 * and shared background/overlay settings.
 */
export default function CanvasContainerProperties({ props, onChange }: any) {
    const [isBgPickerOpen, setIsBgPickerOpen] = useState(false)

    const handleChange = (key: string, value: any) => {
        onChange({ [key]: value })
    }

    return (
        <div className="space-y-5">
            {/* Hint */}
            <div className="flex items-start gap-2 px-3 py-2.5 bg-blue-50 border border-blue-100 rounded-lg">
                <span className="text-blue-500 text-sm mt-0.5">🎨</span>
                <p className="text-xs text-blue-700 leading-relaxed">
                    Tambahkan elemen (kotak, lingkaran, teks, gambar) dari panel kiri. Klik elemen di
                    canvas untuk memilih & mengaturnya.
                </p>
            </div>

            {/* Canvas dimensions */}
            <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Ukuran Canvas</h4>

                <div className="space-y-3">
                    <div>
                        <label className="flex items-center justify-between text-xs font-medium text-gray-700 mb-1">
                            <span>Lebar Referensi (design width)</span>
                            <span className="font-mono text-[#c8956c]">{props.referenceWidth ?? 600}px</span>
                        </label>
                        <input
                            type="range"
                            min={320}
                            max={1200}
                            step={10}
                            value={(props.referenceWidth as number) ?? 600}
                            onChange={(e) => handleChange('referenceWidth', parseInt(e.target.value))}
                            className="w-full accent-[#c8956c]"
                        />
                        <p className="text-[10px] text-gray-400 mt-1">
                            Canvas ini akan otomatis menyusut proporsional di layar yang lebih kecil.
                        </p>
                    </div>

                    <div>
                        <label className="flex items-center justify-between text-xs font-medium text-gray-700 mb-1">
                            <span>Tinggi Canvas</span>
                            <span className="font-mono text-[#c8956c]">{props.containerHeight ?? 400}px</span>
                        </label>
                        <input
                            type="range"
                            min={100}
                            max={1200}
                            step={10}
                            value={(props.containerHeight as number) ?? 400}
                            onChange={(e) => handleChange('containerHeight', parseInt(e.target.value))}
                            className="w-full accent-[#c8956c]"
                        />
                    </div>
                </div>
            </div>

            {/* Background */}
            <div className="space-y-3 pt-3 border-t border-gray-100">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Background Canvas</h4>

                <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Warna Background</label>
                    <div className="flex items-center gap-2">
                        <input
                            type="color"
                            value={
                                props.backgroundColor && props.backgroundColor !== 'transparent'
                                    ? (props.backgroundColor as string)
                                    : '#ffffff'
                            }
                            onChange={(e) => handleChange('backgroundColor', e.target.value)}
                            className="w-8 h-8 rounded cursor-pointer border border-gray-200 p-0.5"
                        />
                        <button
                            onClick={() => handleChange('backgroundColor', 'transparent')}
                            className="text-xs text-gray-500 hover:text-gray-700 underline"
                        >
                            Transparan
                        </button>
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Gambar Background</label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={(props.backgroundImage as string) || ''}
                            onChange={(e) => handleChange('backgroundImage', e.target.value)}
                            placeholder="https://..."
                            className="w-full text-sm border-gray-200 rounded-lg focus:ring-[#c8956c] focus:border-[#c8956c]"
                        />
                        <button
                            onClick={() => setIsBgPickerOpen(true)}
                            className="px-3 py-1.5 bg-[#c8956c] text-white rounded-lg hover:bg-[#8b5e5e] text-xs font-medium whitespace-nowrap"
                        >
                            Pilih
                        </button>
                    </div>
                </div>

                {props.backgroundImage && (
                    <div>
                        <label className="flex items-center justify-between text-xs font-medium text-gray-700 mb-1">
                            <span>Overlay Gelap</span>
                            <span>{Math.round(((props.overlayOpacity as number) || 0) * 100)}%</span>
                        </label>
                        <input
                            type="range"
                            min={0}
                            max={1}
                            step={0.05}
                            value={(props.overlayOpacity as number) || 0}
                            onChange={(e) => handleChange('overlayOpacity', parseFloat(e.target.value))}
                            className="w-full accent-[#c8956c]"
                        />
                    </div>
                )}
            </div>

            <MediaPicker
                isOpen={isBgPickerOpen}
                onClose={() => setIsBgPickerOpen(false)}
                onSelect={(url) => { handleChange('backgroundImage', url); setIsBgPickerOpen(false) }}
            />
        </div>
    )
}
