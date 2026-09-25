import React, { useState } from 'react'
import { router } from '@inertiajs/react'
import { X, CheckCircle2, Loader2, AlertCircle, Rocket } from 'lucide-react'
import axios from 'axios'

interface Plan {
    id: string
    key: string
    name: string
    description: string | null
    price: number
    features: string[]
    formatted_price: string
}

interface Props {
    isOpen: boolean
    onClose: () => void
    invitationId: string
    invitationTitle: string
    invitationSlug: string
    plans: Plan[]
}

type ModalState = 'selecting' | 'processing' | 'pending' | 'error'

declare global {
    interface Window {
        snap: {
            pay: (
                token: string,
                options: {
                    onSuccess: (result: any) => void
                    onPending: (result: any) => void
                    onError: (result: any) => void
                    onClose: () => void
                },
            ) => void
        }
    }
}

/**
 * Modal muncul saat user klik "Publish" tapi belum punya paid order.
 * Flow:
 *   1. User pilih plan
 *   2. POST /orders → dapat snap_token
 *   3. window.snap.pay(token) → Midtrans popup
 *   4. onSuccess → publish invitation → redirect ke URL publik
 */
export default function PublishModal({
    isOpen,
    onClose,
    invitationId,
    invitationTitle,
    invitationSlug,
    plans,
}: Props) {
    const [selectedPlanKey, setSelectedPlanKey] = useState<string>(plans[0]?.key ?? '')
    const [state, setState] = useState<ModalState>('selecting')
    const [errorMessage, setErrorMessage] = useState('')

    if (!isOpen) return null

    const selectedPlan = plans.find((p) => p.key === selectedPlanKey)

    const handlePay = async () => {
        if (!selectedPlan) return

        setState('processing')
        setErrorMessage('')

        try {
            const { data } = await axios.post(route('orders.store'), {
                invitation_id: invitationId,
                plan_key: selectedPlan.key,
            })

            // Trigger Midtrans Snap popup
            window.snap.pay(data.snap_token, {
                onSuccess: (_result) => {
                    // Payment confirmed — publish the invitation
                    router.post(
                        route('invitations.publish', invitationId),
                        {},
                        {
                            onSuccess: () => {
                                // Redirect to the live invitation URL
                                window.location.href = route('public.invitation', invitationSlug)
                            },
                            onError: () => {
                                // Auto-publish may have already happened via webhook
                                window.location.href = route('public.invitation', invitationSlug)
                            },
                        },
                    )
                },
                onPending: (_result) => {
                    setState('pending')
                },
                onError: (result) => {
                    setState('error')
                    setErrorMessage(
                        result?.status_message ?? 'Pembayaran gagal. Silakan coba lagi.',
                    )
                },
                onClose: () => {
                    // User closed Snap popup without paying — go back to selecting
                    setState('selecting')
                },
            })
        } catch (err: any) {
            setState('error')
            setErrorMessage(
                err?.response?.data?.error ??
                    err?.response?.data?.message ??
                    'Terjadi kesalahan. Silakan coba lagi.',
            )
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={state === 'selecting' ? onClose : undefined}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#c8956c] to-[#8b5e5e] px-6 py-5 text-white">
                    <div className="flex items-start justify-between">
                        <div>
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <Rocket className="h-5 w-5" />
                                Publikasikan Undangan
                            </h2>
                            <p className="text-white/80 text-sm mt-1 truncate max-w-xs">
                                {invitationTitle}
                            </p>
                        </div>
                        {state === 'selecting' && (
                            <button
                                onClick={onClose}
                                className="p-1 text-white/70 hover:text-white transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        )}
                    </div>
                </div>

                <div className="p-6">
                    {/* ── State: Selecting plan ─────────────────────────── */}
                    {state === 'selecting' && (
                        <>
                            <p className="text-sm text-gray-600 mb-4">
                                Pilih paket untuk mengaktifkan undangan Anda dan membagikannya ke tamu.
                            </p>

                            <div className="space-y-3 mb-6">
                                {plans.map((plan) => (
                                    <button
                                        key={plan.key}
                                        onClick={() => setSelectedPlanKey(plan.key)}
                                        className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                                            selectedPlanKey === plan.key
                                                ? 'border-[#c8956c] bg-rose-50/60'
                                                : 'border-gray-100 hover:border-gray-200'
                                        }`}
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                                                            selectedPlanKey === plan.key
                                                                ? 'border-[#c8956c] bg-[#c8956c]'
                                                                : 'border-gray-300'
                                                        }`}
                                                    >
                                                        {selectedPlanKey === plan.key && (
                                                            <div className="w-2 h-2 bg-white rounded-full" />
                                                        )}
                                                    </div>
                                                    <span className="font-semibold text-gray-900">
                                                        Paket {plan.name}
                                                    </span>
                                                </div>

                                                {plan.features && plan.features.length > 0 && (
                                                    <ul className="mt-2 ml-6 space-y-1">
                                                        {plan.features.slice(0, 4).map((feature, i) => (
                                                            <li
                                                                key={i}
                                                                className="text-xs text-gray-500 flex items-center gap-1.5"
                                                            >
                                                                <CheckCircle2 className="h-3 w-3 text-green-500 shrink-0" />
                                                                {feature}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>

                                            <div className="text-right shrink-0">
                                                <span className="text-lg font-bold text-[#8b5e5e]">
                                                    {plan.formatted_price}
                                                </span>
                                                <span className="text-xs text-gray-400 block">
                                                    sekali bayar
                                                </span>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={handlePay}
                                disabled={!selectedPlan}
                                className="w-full py-3 bg-gradient-to-r from-[#c8956c] to-[#8b5e5e] text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-[#c8956c]/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                Bayar & Publikasikan →
                            </button>

                            <p className="text-center text-xs text-gray-400 mt-3">
                                Pembayaran aman via Midtrans · QRIS · Transfer Bank · Kartu Kredit
                            </p>
                        </>
                    )}

                    {/* ── State: Processing (waiting for Snap token) ────── */}
                    {state === 'processing' && (
                        <div className="py-10 flex flex-col items-center gap-4">
                            <Loader2 className="h-10 w-10 text-[#c8956c] animate-spin" />
                            <p className="text-gray-600 font-medium">Menyiapkan pembayaran…</p>
                        </div>
                    )}

                    {/* ── State: Pending payment ────────────────────────── */}
                    {state === 'pending' && (
                        <div className="py-8 flex flex-col items-center gap-4 text-center">
                            <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center">
                                <AlertCircle className="h-7 w-7 text-amber-500" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 text-lg">Pembayaran Diproses</h3>
                                <p className="text-sm text-gray-500 mt-2 max-w-sm">
                                    Pembayaran Anda sedang diverifikasi. Undangan akan otomatis live
                                    setelah konfirmasi diterima (biasanya &lt;5 menit untuk transfer
                                    bank).
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="px-6 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                            >
                                Tutup & Lanjutkan Edit
                            </button>
                        </div>
                    )}

                    {/* ── State: Error ──────────────────────────────────── */}
                    {state === 'error' && (
                        <div className="py-8 flex flex-col items-center gap-4 text-center">
                            <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
                                <AlertCircle className="h-7 w-7 text-red-500" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 text-lg">Pembayaran Gagal</h3>
                                <p className="text-sm text-gray-500 mt-2">{errorMessage}</p>
                            </div>
                            <button
                                onClick={() => setState('selecting')}
                                className="px-6 py-2.5 bg-[#c8956c] text-white rounded-xl text-sm font-medium hover:bg-[#8b5e5e] transition-colors"
                            >
                                Coba Lagi
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
