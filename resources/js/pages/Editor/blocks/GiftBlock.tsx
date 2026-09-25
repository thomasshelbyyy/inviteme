import React, { useState } from 'react'
import { Copy, Download, ChevronDown, ChevronUp, Gift, Wallet, Building2 } from 'lucide-react'
import { clsx } from 'clsx'
import BlockWrapper from './BlockWrapper'

export interface GiftItem {
    id: string;
    type: 'bank' | 'qrcode';
    bankName?: string;
    accountName?: string;
    accountNumber?: string;
    walletName?: string;
    qrImage?: string | null;
}

export interface GiftBlockProps {
    title: string;
    description: string;
    useAccordion: boolean;
    items: GiftItem[];
}

export default function GiftBlock({ props, theme }: any) {
    const { title, description, useAccordion, items } = props as GiftBlockProps;

    const [openItemId, setOpenItemId] = useState<string | null>(null)
    const [copiedId, setCopiedId] = useState<string | null>(null)

    const handleCopy = async (text: string, id: string) => {
        try {
            await navigator.clipboard.writeText(text)
            setCopiedId(id)
            setTimeout(() => setCopiedId(null), 2000)
        } catch (err) {
            console.error('Failed to copy text: ', err)
        }
    }

    const toggleAccordion = (id: string) => {
        if (!useAccordion) return;
        setOpenItemId(openItemId === id ? null : id)
    }

    const renderItemContent = (item: GiftItem) => {
        if (item.type === 'bank') {
            return (
                <div className="p-5 flex flex-col items-center justify-center text-center gap-3 animate-fade-in">
                    <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-1">
                        <Building2 className="w-6 h-6 text-gray-500" />
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 text-lg">{item.bankName}</h4>
                        <p className="text-gray-500 text-sm">{item.accountName}</p>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-2 w-full max-w-[240px]">
                        <div className="flex-1 bg-gray-50 px-4 py-2.5 rounded-xl border border-gray-100 font-mono text-gray-800 tracking-wider">
                            {item.accountNumber}
                        </div>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                if (item.accountNumber) handleCopy(item.accountNumber, item.id);
                            }}
                            className="p-2.5 rounded-xl bg-[#c8956c] text-white hover:bg-[#8b5e5e] transition-colors shrink-0"
                            title="Salin Rekening"
                        >
                            {copiedId === item.id ? <Gift className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                        </button>
                    </div>
                    {copiedId === item.id && (
                        <p className="text-xs text-green-600 font-medium">Nomor rekening berhasil disalin!</p>
                    )}
                </div>
            )
        }

        if (item.type === 'qrcode') {
            return (
                <div className="p-5 flex flex-col items-center justify-center text-center gap-4 animate-fade-in">
                    <div className="flex items-center gap-2 text-gray-800 font-bold text-lg mb-2">
                        <Wallet className="w-5 h-5 text-[#c8956c]" />
                        {item.walletName}
                    </div>
                    
                    {item.qrImage ? (
                        <div className="bg-white p-2 rounded-2xl border-2 border-gray-100 shadow-sm">
                            <img 
                                src={item.qrImage} 
                                alt={`QR Code ${item.walletName}`} 
                                className="w-48 h-48 object-contain rounded-xl"
                            />
                        </div>
                    ) : (
                        <div className="w-48 h-48 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 gap-2">
                            <Wallet className="w-8 h-8 opacity-50" />
                            <span className="text-sm font-medium">Belum ada QR Code</span>
                        </div>
                    )}

                    {item.qrImage && (
                        <a 
                            href={item.qrImage}
                            download={`QR-${item.walletName}.jpg`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#c8956c] text-white text-sm font-semibold hover:bg-[#8b5e5e] transition-colors shadow-sm"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Download className="w-4 h-4" />
                            Simpan QR Code
                        </a>
                    )}
                </div>
            )
        }
        return null;
    }

    return (
        <BlockWrapper props={props} theme={theme} className="w-full">
            <div className="w-full max-w-lg mx-auto px-6 relative z-10">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#f2e4d8] text-[#c8956c] mb-4">
                        <Gift className="w-6 h-6" />
                    </div>
                    <h2 
                        className="font-display text-3xl font-bold text-[#4a2c2c] mb-4"
                        style={{ fontFamily: theme?.fontHeading, color: theme?.primaryColor }}
                    >
                        {title}
                    </h2>
                    <p className="text-gray-600 text-sm leading-relaxed max-w-sm mx-auto"
                       style={{ color: theme?.textColor }}
                    >
                        {description}
                    </p>
                </div>

                {/* Items */}
                <div className="space-y-4">
                    {items?.map((item) => {
                        const isOpen = !useAccordion || openItemId === item.id;
                        const label = item.type === 'bank' ? `Transfer ${item.bankName}` : `Scan ${item.walletName}`;

                        return (
                            <div key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all duration-300">
                                {useAccordion ? (
                                    <button
                                        onClick={() => toggleAccordion(item.id)}
                                        className="w-full px-5 py-4 flex items-center justify-between bg-white hover:bg-gray-50/50 transition-colors focus:outline-none"
                                    >
                                        <span className="font-semibold text-gray-800">{label}</span>
                                        {isOpen ? (
                                            <ChevronUp className="w-5 h-5 text-gray-400" />
                                        ) : (
                                            <ChevronDown className="w-5 h-5 text-gray-400" />
                                        )}
                                    </button>
                                ) : (
                                    <div className="w-full px-5 py-3 border-b border-gray-50 bg-gray-50/30 text-center">
                                        <span className="font-semibold text-gray-800">{label}</span>
                                    </div>
                                )}

                                <div className={clsx(
                                    "transition-all duration-300 ease-in-out origin-top overflow-hidden",
                                    isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
                                )}>
                                    <div className={clsx("w-full bg-white", useAccordion && "border-t border-gray-50")}>
                                        {renderItemContent(item)}
                                    </div>
                                </div>
                            </div>
                        )
                    })}

                    {(!items || items.length === 0) && (
                        <div className="text-center py-8 text-gray-400 text-sm bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                            Belum ada opsi pengiriman kado ditambahkan.
                        </div>
                    )}
                </div>
            </div>
        </BlockWrapper>
    )
}
