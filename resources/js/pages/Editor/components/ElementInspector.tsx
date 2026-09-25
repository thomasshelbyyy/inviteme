import React, { useState } from 'react'
import { ChevronsUp, ChevronsDown, ChevronUp, ChevronDown, Trash2 } from 'lucide-react'
import type { CanvasElement } from '@/types'
import { useEditorStore } from '../Store'
import MediaPicker from './MediaPicker'

interface Props {
    element: CanvasElement
    blockId: string
}

/**
 * Right-sidebar inspector shown when a canvas element is selected.
 * Adapts to element type: shared visual props + type-specific props.
 */
export default function ElementInspector({ element, blockId }: Props) {
    const { updateElement, removeElement, reorderElementZ } = useEditorStore()
    const [isImagePickerOpen, setIsImagePickerOpen] = useState(false)

    const update = (changes: Partial<CanvasElement>) => {
        updateElement(blockId, element.id, changes)
    }

    return (
        <div className="space-y-5 animate-fade-in">
            <div className="pb-3 border-b border-gray-100">
                <h3 className="font-semibold text-gray-800 capitalize">
                    {element.type === 'rect' ? 'Kotak' : element.type === 'circle' ? 'Lingkaran' : element.type === 'text' ? 'Teks' : element.type === 'line' ? 'Garis' : element.type === 'triangle' ? 'Segitiga' : 'Gambar'}
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                    {element.width} × {element.height} px &nbsp;·&nbsp; posisi ({element.x}, {element.y})
                </p>
            </div>

            {/* ── Shared: Fill & Opacity ───────────────────────────────────── */}
            {element.type !== 'image' && (
                <section className="space-y-3">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Warna & Tampilan</h4>

                    {element.type !== 'text' && (
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-gray-700">Warna Isian</label>
                            <input
                                type="color"
                                value={element.fill}
                                onChange={(e) => update({ fill: e.target.value })}
                                className="w-8 h-8 rounded cursor-pointer border border-gray-200 p-0.5"
                            />
                        </div>
                    )}

                    {/* Gradient toggle */}
                    {element.type !== 'text' && (
                        <>
                            <div className="flex items-center gap-2 mt-2">
                                <input
                                    type="checkbox"
                                    id="useGradient"
                                    checked={!!element.useGradient}
                                    onChange={(e) => update({ useGradient: e.target.checked })}
                                    className="rounded border-gray-300 text-[#c8956c] focus:ring-[#c8956c]"
                                />
                                <label htmlFor="useGradient" className="text-xs font-medium text-gray-700 cursor-pointer">Gunakan Gradasi</label>
                            </div>

                            {element.useGradient && (
                                <div className="space-y-2 mt-2">
                                    <div className="flex items-center gap-2">
                                        <label className="text-xs text-gray-600 w-20">Warna Akhir</label>
                                        <input
                                            type="color"
                                            value={element.fill2 ?? '#8b5e5e'}
                                            onChange={(e) => update({ fill2: e.target.value })}
                                            className="w-8 h-8 rounded cursor-pointer border border-gray-200 p-0.5"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-600 block mb-1">Arah Gradasi</label>
                                        <select
                                            value={element.gradientDirection ?? 'to right'}
                                            onChange={(e) => update({ gradientDirection: e.target.value })}
                                            className="w-full text-xs border-gray-200 rounded focus:ring-[#c8956c] focus:border-[#c8956c]"
                                        >
                                            <option value="to right">Kiri ke Kanan ↔</option>
                                            <option value="to bottom">Atas ke Bawah ↕</option>
                                            <option value="to bottom right">Diagonal ↘</option>
                                            <option value="to bottom left">Diagonal ↙</option>
                                            <option value="135deg">Diagonal 135°</option>
                                            <option value="45deg">Diagonal 45°</option>
                                        </select>
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    <div>
                        <label className="flex items-center justify-between text-xs font-medium text-gray-700 mb-1">
                            <span>Opasitas</span>
                            <span>{Math.round(element.opacity * 100)}%</span>
                        </label>
                        <input
                            type="range" min={0} max={1} step={0.05}
                            value={element.opacity}
                            onChange={(e) => update({ opacity: parseFloat(e.target.value) })}
                            className="w-full accent-[#c8956c]"
                        />
                    </div>
                </section>
            )}

            {/* ── Shared: Border ───────────────────────────────────────────── */}
            {element.type !== 'image' && element.type !== 'circle' && (
                <section className="space-y-3">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Border</h4>

                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-700">Warna Border</label>
                        <input
                            type="color"
                            value={element.borderColor || '#8b5e5e'}
                            onChange={(e) => update({ borderColor: e.target.value })}
                            className="w-8 h-8 rounded cursor-pointer border border-gray-200 p-0.5"
                        />
                    </div>

                    <div>
                        <label className="flex items-center justify-between text-xs font-medium text-gray-700 mb-1">
                            <span>Ketebalan Border</span>
                            <span>{element.borderWidth}px</span>
                        </label>
                        <input
                            type="range" min={0} max={20} step={1}
                            value={element.borderWidth}
                            onChange={(e) => update({ borderWidth: parseInt(e.target.value) })}
                            className="w-full accent-[#c8956c]"
                        />
                    </div>

                    {element.type === 'rect' && (
                        <div>
                            <label className="flex items-center justify-between text-xs font-medium text-gray-700 mb-1">
                                <span>Border Radius</span>
                                <span>{element.borderRadius}px</span>
                            </label>
                            <input
                                type="range" min={0} max={100} step={1}
                                value={element.borderRadius}
                                onChange={(e) => update({ borderRadius: parseInt(e.target.value) })}
                                className="w-full accent-[#c8956c]"
                            />
                        </div>
                    )}
                </section>
            )}

            {/* ── Text-specific ─────────────────────────────────────────────── */}
            {element.type === 'text' && (
                <section className="space-y-3">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Teks</h4>

                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-700">Warna Teks</label>
                        <input
                            type="color"
                            value={element.textColor || '#4a2c2c'}
                            onChange={(e) => update({ textColor: e.target.value })}
                            className="w-8 h-8 rounded cursor-pointer border border-gray-200 p-0.5"
                        />
                    </div>

                    <div>
                        <label className="flex items-center justify-between text-xs font-medium text-gray-700 mb-1">
                            <span>Ukuran Font</span>
                            <span>{element.fontSize}px</span>
                        </label>
                        <input
                            type="range" min={8} max={120} step={1}
                            value={element.fontSize}
                            onChange={(e) => update({ fontSize: parseInt(e.target.value) })}
                            className="w-full accent-[#c8956c]"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Perataan</label>
                        <div className="flex gap-1">
                            {(['left', 'center', 'right'] as const).map((align) => (
                                <button
                                    key={align}
                                    onClick={() => update({ textAlign: align })}
                                    className={`flex-1 py-1.5 text-xs rounded-lg border transition-colors ${
                                        element.textAlign === align
                                            ? 'border-[#c8956c] bg-[#c8956c]/10 text-[#8b5e5e] font-medium'
                                            : 'border-gray-200 text-gray-500 hover:border-gray-300'
                                    }`}
                                >
                                    {align === 'left' ? '⬅' : align === 'center' ? '↔' : '➡'}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Ketebalan Font</label>
                        <select
                            value={element.fontWeight}
                            onChange={(e) => update({ fontWeight: e.target.value as 'normal' | 'bold' })}
                            className="w-full text-sm border-gray-200 rounded-lg focus:ring-[#c8956c]"
                        >
                            <option value="normal">Normal</option>
                            <option value="bold">Bold</option>
                        </select>
                    </div>
                </section>
            )}

            {/* ── Image-specific ────────────────────────────────────────────── */}
            {element.type === 'image' && (
                <section className="space-y-3">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Gambar</h4>

                    {element.src && (
                        <img
                            src={element.src}
                            alt="preview"
                            className="w-full h-24 object-cover rounded-lg border border-gray-200"
                        />
                    )}

                    <button
                        onClick={() => setIsImagePickerOpen(true)}
                        className="w-full py-2 text-sm border border-dashed border-[#c8956c] text-[#c8956c] rounded-lg hover:bg-[#c8956c]/5 transition-colors"
                    >
                        {element.src ? 'Ganti Gambar' : 'Pilih Gambar'}
                    </button>

                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Object Fit</label>
                        <div className="flex gap-2">
                            {(['cover', 'contain'] as const).map((fit) => (
                                <button
                                    key={fit}
                                    onClick={() => update({ objectFit: fit })}
                                    className={`flex-1 py-1.5 text-xs rounded-lg border transition-colors ${
                                        element.objectFit === fit
                                            ? 'border-[#c8956c] bg-[#c8956c]/10 text-[#8b5e5e] font-medium'
                                            : 'border-gray-200 text-gray-500 hover:border-gray-300'
                                    }`}
                                >
                                    {fit}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="flex items-center justify-between text-xs font-medium text-gray-700 mb-1">
                            <span>Border Radius</span>
                            <span>{element.borderRadius}px</span>
                        </label>
                        <input
                            type="range" min={0} max={100} step={1}
                            value={element.borderRadius}
                            onChange={(e) => update({ borderRadius: parseInt(e.target.value) })}
                            className="w-full accent-[#c8956c]"
                        />
                    </div>
                </section>
            )}

            {/* ── Rotation ─────────────────────────────────────────────────── */}
            {(element.type === 'line' || element.type === 'triangle' || element.type === 'rect') && (
                <section className="space-y-3 pt-3 border-t border-gray-100">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Transformasi</h4>
                    <div>
                        <label className="flex items-center justify-between text-xs font-medium text-gray-700 mb-1">
                            <span>Rotasi</span>
                            <span className="font-mono text-[#c8956c]">{element.rotation ?? 0}°</span>
                        </label>
                        <input
                            type="range"
                            min={-180}
                            max={180}
                            step={1}
                            value={element.rotation ?? 0}
                            onChange={(e) => update({ rotation: parseInt(e.target.value) })}
                            className="w-full accent-[#c8956c]"
                        />
                    </div>
                </section>
            )}

            {/* ── Layering ─────────────────────────────────────────────────── */}
            <section className="space-y-2 pt-3 border-t border-gray-100">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Lapisan (Z-order)</h4>
                <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => reorderElementZ(blockId, element.id, 'front')}
                        className="flex items-center justify-center gap-1.5 py-2 text-xs border border-gray-200 rounded-lg hover:border-[#c8956c] hover:text-[#8b5e5e] transition-colors">
                        <ChevronsUp className="h-3.5 w-3.5" /> Paling Atas
                    </button>
                    <button onClick={() => reorderElementZ(blockId, element.id, 'bottom')}
                        className="flex items-center justify-center gap-1.5 py-2 text-xs border border-gray-200 rounded-lg hover:border-[#c8956c] hover:text-[#8b5e5e] transition-colors">
                        <ChevronsDown className="h-3.5 w-3.5" /> Paling Bawah
                    </button>
                    <button onClick={() => reorderElementZ(blockId, element.id, 'forward')}
                        className="flex items-center justify-center gap-1.5 py-2 text-xs border border-gray-200 rounded-lg hover:border-[#c8956c] hover:text-[#8b5e5e] transition-colors">
                        <ChevronUp className="h-3.5 w-3.5" /> Naik
                    </button>
                    <button onClick={() => reorderElementZ(blockId, element.id, 'back')}
                        className="flex items-center justify-center gap-1.5 py-2 text-xs border border-gray-200 rounded-lg hover:border-[#c8956c] hover:text-[#8b5e5e] transition-colors">
                        <ChevronDown className="h-3.5 w-3.5" /> Turun
                    </button>
                </div>
            </section>

            {/* ── Delete ───────────────────────────────────────────────────── */}
            <button
                onClick={() => removeElement(blockId, element.id)}
                className="w-full flex items-center justify-center gap-2 py-2.5 text-sm text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
            >
                <Trash2 className="h-4 w-4" /> Hapus Elemen
            </button>

            <MediaPicker
                isOpen={isImagePickerOpen}
                onClose={() => setIsImagePickerOpen(false)}
                onSelect={(url) => { update({ src: url }); setIsImagePickerOpen(false) }}
            />
        </div>
    )
}
