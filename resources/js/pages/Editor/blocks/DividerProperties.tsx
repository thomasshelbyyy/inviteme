import React from 'react'
import type { DividerStyle, DividerBlockProps } from './DividerBlock'

export default function DividerProperties({ props, onChange }: any) {
    const defaultProps: DividerBlockProps = {
        style: 'wave',
        colorTop: 'transparent',
        colorBottom: '#ffffff',
        height: 80,
        flip: false,
        ...props,
    }

    const handleChange = (key: string, value: any) => {
        onChange({ [key]: value })
    }

    const styleOptions: { value: DividerStyle; label: string; desc: string }[] = [
        { value: 'wave', label: 'Gelombang', desc: 'Transisi ombak lembut' },
        { value: 'slant', label: 'Miring', desc: 'Sudut diagonal elegan' },
        { value: 'fade', label: 'Memudar', desc: 'Gradasi warna halus' },
        { value: 'line', label: 'Garis', desc: 'Garis pemisah sederhana' },
    ]

    return (
        <div className="space-y-5">
            <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Gaya Divider</h4>
                <div className="grid grid-cols-2 gap-2">
                    {styleOptions.map((opt) => (
                        <button
                            key={opt.value}
                            onClick={() => handleChange('style', opt.value)}
                            className={`p-3 rounded-xl border-2 text-left transition-all ${
                                defaultProps.style === opt.value
                                    ? 'border-[#c8956c] bg-[#c8956c]/5'
                                    : 'border-gray-100 hover:border-gray-200 bg-white'
                            }`}
                        >
                            <p className="text-xs font-semibold text-gray-800">{opt.label}</p>
                            <p className="text-[10px] text-gray-400 mt-0.5">{opt.desc}</p>
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-4 border-t border-gray-100 pt-4">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Warna</h4>

                <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-gray-700">Warna Atas</label>
                    <div className="flex items-center gap-2">
                        <input
                            type="color"
                            value={defaultProps.colorTop === 'transparent' ? '#ffffff' : defaultProps.colorTop}
                            onChange={(e) => handleChange('colorTop', e.target.value)}
                            className="w-8 h-8 rounded cursor-pointer border border-gray-200 p-0.5"
                        />
                        <button
                            onClick={() => handleChange('colorTop', 'transparent')}
                            className="text-xs text-gray-500 hover:text-gray-700 underline"
                        >
                            Transparan
                        </button>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-gray-700">Warna Bawah</label>
                    <div className="flex items-center gap-2">
                        <input
                            type="color"
                            value={defaultProps.colorBottom === 'transparent' ? '#ffffff' : defaultProps.colorBottom}
                            onChange={(e) => handleChange('colorBottom', e.target.value)}
                            className="w-8 h-8 rounded cursor-pointer border border-gray-200 p-0.5"
                        />
                        <button
                            onClick={() => handleChange('colorBottom', 'transparent')}
                            className="text-xs text-gray-500 hover:text-gray-700 underline"
                        >
                            Transparan
                        </button>
                    </div>
                </div>
            </div>

            <div className="space-y-3 border-t border-gray-100 pt-4">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Ukuran</h4>

                <div>
                    <label className="flex items-center justify-between text-xs font-medium text-gray-700 mb-1">
                        <span>Tinggi</span>
                        <span className="font-mono text-[#c8956c]">{defaultProps.height}px</span>
                    </label>
                    <input
                        type="range"
                        min={20}
                        max={200}
                        step={5}
                        value={defaultProps.height}
                        onChange={(e) => handleChange('height', parseInt(e.target.value))}
                        className="w-full accent-[#c8956c]"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="flip"
                        checked={defaultProps.flip}
                        onChange={(e) => handleChange('flip', e.target.checked)}
                        className="rounded border-gray-300 text-[#c8956c] focus:ring-[#c8956c]"
                    />
                    <label htmlFor="flip" className="text-xs font-medium text-gray-700 cursor-pointer">
                        Balik Arah (Mirror)
                    </label>
                </div>
            </div>
        </div>
    )
}
