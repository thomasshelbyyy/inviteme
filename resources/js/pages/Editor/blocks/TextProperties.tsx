import React from 'react'
import BlockSettingsPanel from '../components/BlockSettingsPanel'

/**
 * Properties panel for TextBlock.
 * Text editing now happens inline in the canvas via Tiptap, so this panel
 * only exposes structural options (quote marks, alignment, background, spacing).
 */
export default function TextProperties({ props, onChange }: any) {
    const handleChange = (key: string, value: any) => {
        onChange({ [key]: value })
    }

    return (
        <div className="space-y-4">
            {/* Inline editing hint */}
            <div className="flex items-start gap-2 px-3 py-2.5 bg-amber-50 border border-amber-100 rounded-lg">
                <span className="text-amber-500 text-sm mt-0.5">✏️</span>
                <p className="text-xs text-amber-700 leading-relaxed">
                    Klik blok teks di kanvas untuk mengedit isi secara langsung. Seleksi teks untuk
                    memunculkan toolbar format (bold, italic, heading, link, gambar).
                </p>
            </div>

            {/* Text alignment */}
            <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Perataan Teks</label>
                <select
                    value={(props.align as string) || 'center'}
                    onChange={(e) => handleChange('align', e.target.value)}
                    className="w-full text-sm border-gray-200 rounded-lg focus:ring-[#c8956c] focus:border-[#c8956c]"
                >
                    <option value="left">Kiri</option>
                    <option value="center">Tengah</option>
                    <option value="right">Kanan</option>
                    <option value="justify">Justify</option>
                </select>
            </div>

            {/* Decorative options */}
            <div className="space-y-2 pt-2 border-t border-gray-100">
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={(props.showQuoteMarks as boolean) || false}
                        onChange={(e) => handleChange('showQuoteMarks', e.target.checked)}
                        className="rounded border-gray-300 text-[#c8956c] focus:ring-[#c8956c]"
                    />
                    <span className="text-sm text-gray-700">Tampilkan Tanda Kutip</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={(props.isHighlight as boolean) || false}
                        onChange={(e) => handleChange('isHighlight', e.target.checked)}
                        className="rounded border-gray-300 text-[#c8956c] focus:ring-[#c8956c]"
                    />
                    <span className="text-sm text-gray-700">Highlight Background</span>
                </label>
            </div>

            {/* Shared background / padding panel */}
            <BlockSettingsPanel props={props} onChange={handleChange} />
        </div>
    )
}
