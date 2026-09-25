import React from 'react'
import { Plus, Square, Circle, Type, Image, ArrowLeft, Minus, Triangle } from 'lucide-react'
import { useEditorStore } from '../Store'
import { blockRegistry, blockCategories } from '../BlockRegistry'
import type { CanvasElementType } from '@/types'

const ELEMENT_TYPES: { type: CanvasElementType; label: string; icon: React.ElementType }[] = [
    { type: 'rect', label: 'Kotak', icon: Square },
    { type: 'circle', label: 'Lingkaran', icon: Circle },
    { type: 'text', label: 'Teks', icon: Type },
    { type: 'image', label: 'Gambar', icon: Image },
    { type: 'line', label: 'Garis', icon: Minus },
    { type: 'triangle', label: 'Segitiga', icon: Triangle },
]

export default function LeftSidebar() {
    const { design, activeBlockId, addBlock, addElement } = useEditorStore()

    // Detect whether a canvas-container block is currently active
    const activeBlock = activeBlockId ? design.blocks.find((b) => b.id === activeBlockId) : null
    const isCanvasActive = activeBlock?.type === 'canvas-container'

    // ── Element panel (when canvas-container is active) ──────────────────────
    if (isCanvasActive) {
        return (
            <aside className="w-72 bg-white border-r border-gray-200 flex flex-col h-full z-10 shadow-sm shrink-0">
                <div className="p-4 border-b border-gray-100 bg-blue-50/60">
                    <h2 className="font-semibold text-gray-800">Tambahkan Elemen</h2>
                    <p className="text-xs text-gray-500 mt-1">
                        Elemen akan ditambahkan ke <strong>Canvas Bebas</strong> yang aktif.
                    </p>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                    <div className="grid grid-cols-2 gap-3">
                        {ELEMENT_TYPES.map(({ type, label, icon: Icon }) => (
                            <button
                                key={type}
                                onClick={() => addElement(activeBlockId!, type)}
                                className="flex flex-col items-center justify-center p-4 gap-2 rounded-xl border border-gray-100 bg-white hover:border-[#c8956c]/40 hover:bg-rose-50/50 hover:text-[#8b5e5e] transition-all group"
                            >
                                <Icon className="h-7 w-7 text-gray-400 group-hover:text-[#c8956c]" />
                                <span className="text-[11px] font-medium text-gray-600 text-center">{label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Back to block panel */}
                <div className="p-3 border-t border-gray-100">
                    <button
                        onClick={() => useEditorStore.getState().setActiveBlock(null)}
                        className="w-full flex items-center justify-center gap-2 py-2 text-xs text-gray-500 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="h-3.5 w-3.5" />
                        Kembali ke daftar blok
                    </button>
                </div>
            </aside>
        )
    }

    // ── Default block panel ───────────────────────────────────────────────────
    return (
        <aside className="w-72 bg-white border-r border-gray-200 flex flex-col h-full z-10 shadow-sm shrink-0">
            <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                <h2 className="font-semibold text-gray-800">Tambahkan Blok</h2>
                <p className="text-xs text-gray-500 mt-1">Pilih blok untuk ditambahkan ke kanvas</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {blockCategories.map((category) => {
                    const categoryBlocks = Object.values(blockRegistry).filter((b) => b.category === category.id)

                    if (categoryBlocks.length === 0) return null

                    return (
                        <div key={category.id}>
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                                {category.name}
                            </h3>
                            <div className="grid grid-cols-2 gap-2">
                                {categoryBlocks.map((block) => (
                                    <button
                                        key={block.type}
                                        onClick={() => addBlock(block.type)}
                                        className="flex flex-col items-center justify-center p-3 gap-2 rounded-xl border border-gray-100 bg-white hover:border-[#c8956c]/40 hover:bg-rose-50/50 hover:text-[#8b5e5e] transition-all group"
                                    >
                                        <block.icon className="h-6 w-6 text-gray-400 group-hover:text-[#c8956c]" />
                                        <span className="text-[11px] font-medium text-gray-600 text-center leading-tight">
                                            {block.name}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )
                })}
            </div>
        </aside>
    )
}
