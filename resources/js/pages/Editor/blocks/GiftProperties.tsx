import React, { useState } from 'react'
import { Plus, Trash2, Wallet, Building2, ChevronDown, ChevronUp } from 'lucide-react'
import MediaPicker from '../components/MediaPicker'
import { GiftItem, GiftBlockProps } from './GiftBlock'
import BlockSettingsPanel from '../components/BlockSettingsPanel'

export default function GiftProperties({ props, onChange }: any) {
    const defaultProps: GiftBlockProps = {
        title: 'Wedding Gift',
        description: 'Tanpa mengurangi rasa hormat, bagi keluarga dan sahabat yang ingin memberikan tanda kasih untuk kami, dapat melalui:',
        useAccordion: true,
        items: [],
        ...props
    }

    const [pickerOpen, setPickerOpen] = useState(false)
    const [activeItemIndex, setActiveItemIndex] = useState<number | null>(null)

    const handleChange = (key: string, value: any) => {
        onChange({ [key]: value })
    }

    const handleItemChange = (index: number, key: keyof GiftItem, value: any) => {
        const newItems = [...(defaultProps.items || [])]
        newItems[index] = { ...newItems[index], [key]: value }
        handleChange('items', newItems)
    }

    const handleAddItem = (type: 'bank' | 'qrcode') => {
        const newItem: GiftItem = {
            id: 'item-' + Date.now(),
            type,
            bankName: type === 'bank' ? 'BCA' : undefined,
            accountName: type === 'bank' ? '' : undefined,
            accountNumber: type === 'bank' ? '' : undefined,
            walletName: type === 'qrcode' ? 'GoPay' : undefined,
            qrImage: type === 'qrcode' ? '' : undefined,
        }
        handleChange('items', [...(defaultProps.items || []), newItem])
    }

    const handleRemoveItem = (index: number) => {
        const newItems = [...(defaultProps.items || [])]
        newItems.splice(index, 1)
        handleChange('items', newItems)
    }

    const openQrPicker = (index: number) => {
        setActiveItemIndex(index)
        setPickerOpen(true)
    }

    const moveItem = (index: number, direction: 'up' | 'down') => {
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === (defaultProps.items?.length || 0) - 1) return;
        
        const newItems = [...(defaultProps.items || [])];
        const swapIndex = direction === 'up' ? index - 1 : index + 1;
        
        [newItems[index], newItems[swapIndex]] = [newItems[swapIndex], newItems[index]];
        handleChange('items', newItems);
    }

    return (
        <div className="space-y-6">
            <div className="space-y-4">
                <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Judul Seksi</label>
                    <input 
                        type="text" 
                        value={defaultProps.title} 
                        onChange={(e) => handleChange('title', e.target.value)}
                        className="w-full text-sm border-gray-200 rounded-lg focus:ring-[#c8956c] focus:border-[#c8956c]"
                    />
                </div>
                
                <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Teks Pengantar</label>
                    <textarea 
                        value={defaultProps.description} 
                        onChange={(e) => handleChange('description', e.target.value)}
                        rows={3}
                        className="w-full text-sm border-gray-200 rounded-lg focus:ring-[#c8956c] focus:border-[#c8956c]"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <input 
                        type="checkbox"
                        id="useAccordion"
                        checked={defaultProps.useAccordion}
                        onChange={(e) => handleChange('useAccordion', e.target.checked)}
                        className="rounded border-gray-300 text-[#c8956c] focus:ring-[#c8956c]"
                    />
                    <label htmlFor="useAccordion" className="text-sm text-gray-700 font-medium cursor-pointer">
                        Gunakan desain lipat (Accordion)
                    </label>
                </div>
            </div>

            <div className="border-t border-gray-100 pt-4 space-y-4">
                <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-gray-900">Daftar Rekening / QR</label>
                </div>

                <div className="space-y-3">
                    {defaultProps.items?.map((item: GiftItem, index: number) => (
                        <div key={item.id} className="border border-gray-200 rounded-xl p-4 bg-gray-50/50 space-y-3 relative group">
                            
                            <div className="flex items-center justify-between mb-2">
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-gray-200 text-xs font-bold text-gray-700 shadow-sm">
                                    {item.type === 'bank' ? <Building2 className="w-3.5 h-3.5" /> : <Wallet className="w-3.5 h-3.5" />}
                                    {item.type === 'bank' ? 'Transfer Bank' : 'QR Code'}
                                </span>
                                
                                <div className="flex items-center gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => moveItem(index, 'up')} disabled={index === 0} className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30">
                                        <ChevronUp className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => moveItem(index, 'down')} disabled={index === defaultProps.items.length - 1} className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30">
                                        <ChevronDown className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => handleRemoveItem(index)} className="p-1 text-red-400 hover:text-red-600 ml-1">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {item.type === 'bank' ? (
                                <div className="space-y-3">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-[11px] font-medium text-gray-500 mb-1">Nama Bank</label>
                                            <input 
                                                type="text" 
                                                value={item.bankName || ''} 
                                                onChange={(e) => handleItemChange(index, 'bankName', e.target.value)}
                                                placeholder="BCA / Mandiri"
                                                className="w-full text-xs border-gray-200 rounded-md focus:ring-[#c8956c] focus:border-[#c8956c]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-medium text-gray-500 mb-1">Nomor Rekening</label>
                                            <input 
                                                type="text" 
                                                value={item.accountNumber || ''} 
                                                onChange={(e) => handleItemChange(index, 'accountNumber', e.target.value)}
                                                className="w-full text-xs font-mono border-gray-200 rounded-md focus:ring-[#c8956c] focus:border-[#c8956c]"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-medium text-gray-500 mb-1">Atas Nama</label>
                                        <input 
                                            type="text" 
                                            value={item.accountName || ''} 
                                            onChange={(e) => handleItemChange(index, 'accountName', e.target.value)}
                                            className="w-full text-xs border-gray-200 rounded-md focus:ring-[#c8956c] focus:border-[#c8956c]"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-[11px] font-medium text-gray-500 mb-1">Nama Dompet (OVO/Dana/QRIS)</label>
                                        <input 
                                            type="text" 
                                            value={item.walletName || ''} 
                                            onChange={(e) => handleItemChange(index, 'walletName', e.target.value)}
                                            className="w-full text-xs border-gray-200 rounded-md focus:ring-[#c8956c] focus:border-[#c8956c]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-medium text-gray-500 mb-1">Gambar QR Code</label>
                                        {item.qrImage ? (
                                            <div className="relative rounded-lg overflow-hidden border border-gray-200 group/img">
                                                <img src={item.qrImage} className="w-full h-32 object-contain bg-white" alt="QR" />
                                                <button 
                                                    onClick={() => openQrPicker(index)}
                                                    className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity text-white text-xs font-medium"
                                                >
                                                    Ubah Gambar
                                                </button>
                                            </div>
                                        ) : (
                                            <button 
                                                onClick={() => openQrPicker(index)}
                                                className="w-full h-24 rounded-lg border-2 border-dashed border-gray-300 hover:border-[#c8956c] hover:bg-[#c8956c]/5 text-gray-500 flex flex-col items-center justify-center gap-1 transition-colors"
                                            >
                                                <Plus className="w-5 h-5 text-gray-400" />
                                                <span className="text-xs font-medium">Pilih Gambar QR</span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}

                        </div>
                    ))}

                    {defaultProps.items?.length === 0 && (
                        <p className="text-xs text-center text-gray-400 py-4">Belum ada rekening/QR yang ditambahkan.</p>
                    )}
                </div>

                <div className="flex gap-2">
                    <button 
                        onClick={() => handleAddItem('bank')}
                        className="flex-1 py-2 px-3 rounded-xl border border-[#c8956c]/30 bg-[#c8956c]/5 text-[#c8956c] hover:bg-[#c8956c]/10 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                    >
                        <Plus className="w-4 h-4" /> Bank
                    </button>
                    <button 
                        onClick={() => handleAddItem('qrcode')}
                        className="flex-1 py-2 px-3 rounded-xl border border-[#c8956c]/30 bg-[#c8956c]/5 text-[#c8956c] hover:bg-[#c8956c]/10 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                    >
                        <Plus className="w-4 h-4" /> QR Code
                    </button>
                </div>
            </div>

            <BlockSettingsPanel props={props} onChange={handleChange} />

            <MediaPicker 
                isOpen={pickerOpen}
                onClose={() => {
                    setPickerOpen(false)
                    setActiveItemIndex(null)
                }}
                onSelect={(url) => {
                    if (activeItemIndex !== null) {
                        handleItemChange(activeItemIndex, 'qrImage', url)
                    }
                }}
            />
        </div>
    )
}
