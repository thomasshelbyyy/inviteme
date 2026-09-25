import React from 'react'
import { X } from 'lucide-react'

interface Props {
    isOpen: boolean
    onClose: () => void
    title: string
    description?: React.ReactNode
    confirmText?: string
    cancelText?: string
    onConfirm?: () => void
    icon?: React.ReactNode
    variant?: 'primary' | 'danger'
    isAlert?: boolean // If true, only shows the confirm button (acting as an OK button)
}

export default function DialogModal({
    isOpen,
    onClose,
    title,
    description,
    confirmText = 'Konfirmasi',
    cancelText = 'Batal',
    onConfirm,
    icon,
    variant = 'primary',
    isAlert = false,
}: Props) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity" 
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-fade-in scale-100 transform transition-all">
                <div className="p-6">
                    <div className="flex flex-col items-center text-center">
                        {icon && (
                            <div className={`mb-4 w-12 h-12 rounded-full flex items-center justify-center ${
                                variant === 'danger' ? 'bg-red-50 text-red-500' : 'bg-rose-50 text-[#c8956c]'
                            }`}>
                                {icon}
                            </div>
                        )}
                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                            {title}
                        </h3>
                        {description && (
                            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                                {description}
                            </p>
                        )}
                    </div>

                    <div className={`flex items-center gap-3 ${isAlert ? 'justify-center' : 'justify-end'}`}>
                        {!isAlert && (
                            <button
                                onClick={onClose}
                                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                            >
                                {cancelText}
                            </button>
                        )}
                        <button
                            onClick={() => {
                                onConfirm?.()
                                onClose()
                            }}
                            className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-white transition-all shadow-sm ${
                                variant === 'danger'
                                    ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20'
                                    : 'bg-gradient-to-r from-[#c8956c] to-[#8b5e5e] hover:shadow-md'
                            }`}
                        >
                            {isAlert ? 'Mengerti' : confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
