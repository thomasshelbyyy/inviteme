import React from 'react'
import { Settings2, Palette } from 'lucide-react'
import { useEditorStore } from '../Store'
import { blockRegistry } from '../BlockRegistry'
import ElementInspector from './ElementInspector'
import type { CanvasElement } from '@/types'

export default function RightSidebar() {
    const { design, activeBlockId, activeElementId, updateBlockProps, updateTheme } = useEditorStore()
    const [activeTab, setActiveTab] = React.useState<'block' | 'theme'>('block')

    const activeBlock = activeBlockId
        ? design.blocks.find((b) => b.id === activeBlockId)
        : null

    // If a canvas element is selected, show the element inspector
    const activeElement = activeBlock?.type === 'canvas-container' && activeElementId
        ? ((activeBlock.props.elements as CanvasElement[]) ?? []).find((e) => e.id === activeElementId)
        : null

    const BlockPropertiesComponent = activeBlock
        ? blockRegistry[activeBlock.type]?.propertiesComponent
        : null

    const handleThemeChange = (key: keyof typeof design.theme, value: string) => {
        updateTheme({ [key]: value })
    }

    return (
        <aside className="w-80 bg-white border-l border-gray-200 flex flex-col h-full z-10 shadow-sm shrink-0">
            {/* Tabs */}
            <div className="flex border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('block')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === 'block' 
                            ? 'border-[#c8956c] text-[#4a2c2c]' 
                            : 'border-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                    }`}
                >
                    <Settings2 className="h-4 w-4" />
                    Properti Blok
                </button>
                <button
                    onClick={() => setActiveTab('theme')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === 'theme' 
                            ? 'border-[#c8956c] text-[#4a2c2c]' 
                            : 'border-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                    }`}
                >
                    <Palette className="h-4 w-4" />
                    Tema Global
                </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-5">
                {activeTab === 'block' ? (
                    activeElement ? (
                        /* ── Element Inspector ── */
                        <div className="animate-fade-in">
                            <div className="mb-4 pb-3 border-b border-gray-100">
                                <p className="text-xs text-gray-400">Element dipilih dalam</p>
                                <h3 className="font-semibold text-gray-800">{blockRegistry[activeBlock!.type]?.name}</h3>
                            </div>
                            <ElementInspector element={activeElement} blockId={activeBlockId!} />
                        </div>
                    ) : activeBlock && BlockPropertiesComponent ? (
                        <div className="animate-fade-in">
                            <div className="mb-6 pb-4 border-b border-gray-100">
                                <h3 className="font-semibold text-gray-800">
                                    {blockRegistry[activeBlock.type]?.name || 'Properti'}
                                </h3>
                                <p className="text-xs text-gray-500 mt-1">Ubah tampilan blok yang dipilih.</p>
                            </div>
                            <BlockPropertiesComponent 
                                props={activeBlock.props}
                                onChange={(updates: any) => updateBlockProps(activeBlock.id, updates)}
                            />
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center opacity-50 space-y-3">
                            <Settings2 className="h-8 w-8 text-gray-400" />
                            <div>
                                <p className="text-sm font-medium text-gray-600">Tidak ada blok dipilih</p>
                                <p className="text-xs text-gray-400 mt-1">Klik blok di kanvas untuk mengeditnya.</p>
                            </div>
                        </div>
                    )
                ) : (
                    <div className="animate-fade-in space-y-6">
                        <div className="mb-2">
                            <h3 className="font-semibold text-gray-800">Pengaturan Tema</h3>
                            <p className="text-xs text-gray-500 mt-1">Berlaku untuk seluruh undangan.</p>
                        </div>

                        {/* Colors */}
                        <div className="space-y-4">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Warna</h4>
                            
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium text-gray-700">Warna Teks Utama</label>
                                <input 
                                    type="color" 
                                    value={design.theme?.primaryColor || '#8B5E5E'}
                                    onChange={(e) => handleThemeChange('primaryColor', e.target.value)}
                                    className="h-8 w-8 rounded cursor-pointer border-0 p-0"
                                />
                            </div>
                            
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium text-gray-700">Warna Aksen</label>
                                <input 
                                    type="color" 
                                    value={design.theme?.accentColor || '#C8956C'}
                                    onChange={(e) => handleThemeChange('accentColor', e.target.value)}
                                    className="h-8 w-8 rounded cursor-pointer border-0 p-0"
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium text-gray-700">Warna Latar (Background)</label>
                                <input 
                                    type="color" 
                                    value={design.theme?.backgroundColor || '#FDF8F3'}
                                    onChange={(e) => handleThemeChange('backgroundColor', e.target.value)}
                                    className="h-8 w-8 rounded cursor-pointer border-0 p-0"
                                />
                            </div>
                        </div>

                        <hr className="border-gray-100" />

                        {/* Typography */}
                        <div className="space-y-4">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tipografi</h4>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Font Judul Utama</label>
                                <select 
                                    value={design.theme?.fontHeading || "'Playfair Display', Georgia, serif"}
                                    onChange={(e) => handleThemeChange('fontHeading', e.target.value)}
                                    className="w-full text-sm border-gray-200 rounded-lg focus:ring-[#c8956c]"
                                >
                                    <option value="'Playfair Display', Georgia, serif">Playfair Display</option>
                                    <option value="'Cormorant Garamond', Georgia, serif">Cormorant Garamond</option>
                                    <option value="'Inter', sans-serif">Inter</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Font Teks Paragraf</label>
                                <select 
                                    value={design.theme?.fontBody || "'Inter', sans-serif"}
                                    onChange={(e) => handleThemeChange('fontBody', e.target.value)}
                                    className="w-full text-sm border-gray-200 rounded-lg focus:ring-[#c8956c]"
                                >
                                    <option value="'Inter', sans-serif">Inter</option>
                                    <option value="'Playfair Display', Georgia, serif">Playfair Display</option>
                                </select>
                            </div>
                        </div>

                        <hr className="border-gray-100" />

                        {/* Additional Settings */}
                        <div className="space-y-4">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Pengaturan Lainnya</h4>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Musik Latar (URL MP3)</label>
                                <input 
                                    type="text" 
                                    placeholder="https://..."
                                    value={design.settings?.musicUrl || ''}
                                    onChange={(e) => useEditorStore.getState().updateSettings({ musicUrl: e.target.value })}
                                    className="w-full text-sm border-gray-200 rounded-lg focus:ring-[#c8956c]"
                                />
                                <p className="text-xs text-gray-400 mt-1">Gunakan URL file MP3 untuk musik latar.</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </aside>
    )
}
