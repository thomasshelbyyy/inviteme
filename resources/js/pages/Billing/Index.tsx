import React, { useState } from 'react'
import { Head, router, usePage } from '@inertiajs/react'
import DashboardLayout from '@/layouts/DashboardLayout'
import { Check, CreditCard, ExternalLink, Loader2, Receipt, AlertCircle, HelpCircle } from 'lucide-react'
import axios from 'axios'
import DialogModal from '@/components/DialogModal'

interface Plan {
    id: string
    key: string
    name: string
    description: string
    price: number
    features: string[]
}

interface Order {
    id: string
    plan: string
    amount: number
    status: string
    paid_at: string
    invitation: {
        id: string
        title: string
    }
}

interface PageProps {
    plans: Plan[]
    orders: Order[]
    invitations: { id: string; title: string }[]
    auth: { user: { id: string } }
}

export default function BillingIndex({ plans, orders, invitations }: PageProps) {
    const [selectedInvitationId, setSelectedInvitationId] = useState('')
    const [processingPlan, setProcessingPlan] = useState<string | null>(null)
    
    // Dialog States
    const [dialogConfig, setDialogConfig] = useState<{
        isOpen: boolean
        title: string
        description?: string
        isAlert?: boolean
        onConfirm?: () => void
        icon?: React.ReactNode
        variant?: 'primary' | 'danger'
        confirmText?: string
    }>({ isOpen: false, title: '' })

    const closeDialog = () => setDialogConfig((prev) => ({ ...prev, isOpen: false }))
    
    const handleBuy = async (planKey: string) => {
        if (!selectedInvitationId) {
            setDialogConfig({
                isOpen: true,
                isAlert: true,
                title: 'Pilih Undangan',
                description: 'Silakan pilih undangan yang ingin di-upgrade terlebih dahulu.',
                icon: <AlertCircle className="w-6 h-6" />,
                variant: 'danger',
            })
            return
        }
        
        setProcessingPlan(planKey)
        
        try {
            const { data } = await axios.post(route('orders.store'), {
                invitation_id: selectedInvitationId,
                plan_key: planKey
            })
            
            // Trigger Midtrans Snap popup
            window.snap.pay(data.snap_token, {
                onSuccess: () => {
                    // Auto reload so order list is refreshed
                    window.location.reload()
                },
                onPending: () => {
                    setDialogConfig({
                        isOpen: true,
                        isAlert: true,
                        title: 'Pembayaran Diproses',
                        description: 'Pembayaran Anda sedang diproses dan akan segera dikonfirmasi.',
                        icon: <HelpCircle className="w-6 h-6 text-amber-500" />,
                        onConfirm: () => window.location.reload(),
                    })
                },
                onError: (result: any) => {
                    setDialogConfig({
                        isOpen: true,
                        isAlert: true,
                        title: 'Pembayaran Gagal',
                        description: 'Pembayaran gagal: ' + (result?.status_message ?? 'Silakan coba lagi.'),
                        icon: <AlertCircle className="w-6 h-6" />,
                        variant: 'danger',
                    })
                    setProcessingPlan(null)
                },
                onClose: () => {
                    setProcessingPlan(null)
                }
            })
        } catch (error: any) {
            setDialogConfig({
                isOpen: true,
                isAlert: true,
                title: 'Terjadi Kesalahan',
                description: error?.response?.data?.error ?? 'Terjadi kesalahan saat memproses pesanan.',
                icon: <AlertCircle className="w-6 h-6" />,
                variant: 'danger',
            })
            setProcessingPlan(null)
        }
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount)
    }

    return (
        <DashboardLayout title="Billing & Paket">
            <Head title="Billing & Paket" />
            
            <div className="p-6 max-w-5xl mx-auto space-y-12">
                {/* Header */}
                <div className="text-center space-y-3">
                    <h1 className="font-display text-3xl font-bold text-[#4a2c2c]">Pilih Paket Terbaik</h1>
                    <p className="text-gray-500 max-w-xl mx-auto">
                        Mulai dengan gratis, bayar hanya ketika Anda siap untuk menyebarkan undangan.
                    </p>
                </div>

                {/* Plans Grid */}
                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {plans.map(plan => (
                        <div 
                            key={plan.id}
                            className={`rounded-3xl p-8 border-2 transition-all ${
                                plan.key === 'premium' 
                                    ? 'border-[#c8956c] bg-gradient-to-b from-white to-[#fdf8f3] shadow-xl relative scale-105' 
                                    : 'border-gray-100 bg-white shadow-sm hover:shadow-md'
                            }`}
                        >
                            {plan.key === 'premium' && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                    <span className="bg-[#c8956c] text-white text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full shadow-md">
                                        Paling Populer
                                    </span>
                                </div>
                            )}

                            <div className="text-center mb-8">
                                <h3 className="font-display text-xl font-bold text-[#4a2c2c]">{plan.name}</h3>
                                <p className="text-sm text-gray-500 mt-2">{plan.description}</p>
                                <div className="mt-6 mb-2">
                                    <span className="text-4xl font-extrabold text-[#4a2c2c]">{formatCurrency(plan.price)}</span>
                                    {plan.price > 0 && <span className="text-gray-500 font-medium">/undangan</span>}
                                </div>
                            </div>

                            <ul className="space-y-4 mb-8">
                                {plan.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-start gap-3">
                                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#c8956c]/20 flex items-center justify-center mt-0.5">
                                            <Check className="w-3 h-3 text-[#c8956c]" />
                                        </div>
                                        <span className="text-gray-600 text-sm">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <div className="space-y-3">
                                {plan.price > 0 ? (
                                    <div className="space-y-3">
                                        <select 
                                            value={selectedInvitationId}
                                            onChange={e => setSelectedInvitationId(e.target.value)}
                                            className="w-full text-sm rounded-xl border-gray-200 focus:ring-[#c8956c] focus:border-[#c8956c]"
                                        >
                                            <option value="" disabled>Pilih Undangan...</option>
                                            {invitations.map((inv: any) => (
                                                <option key={inv.id} value={inv.id}>{inv.title}</option>
                                            ))}
                                        </select>
                                        <button 
                                            onClick={() => handleBuy(plan.key)}
                                            disabled={processingPlan === plan.key || !selectedInvitationId}
                                            className="w-full py-3 px-6 rounded-xl font-semibold transition-all flex justify-center items-center gap-2 bg-[#c8956c] text-white hover:bg-[#8b5e5e] shadow-md hover:shadow-lg disabled:opacity-50"
                                        >
                                            {processingPlan === plan.key ? <Loader2 className="w-5 h-5 animate-spin" /> : <CreditCard className="w-5 h-5" />}
                                            Upgrade Sekarang
                                        </button>
                                    </div>
                                ) : (
                                    <button 
                                        onClick={() => router.get(route('dashboard'))}
                                        className="w-full py-3 px-6 rounded-xl font-semibold transition-all bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    >
                                        Mulai Mendesain
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Orders History */}
                <div className="pt-12">
                    <div className="flex items-center gap-2 mb-6">
                        <Receipt className="w-5 h-5 text-[#8b5e5e]" />
                        <h2 className="font-display text-xl font-bold text-[#4a2c2c]">Riwayat Transaksi</h2>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        {orders.length === 0 ? (
                            <div className="p-8 text-center text-gray-500 text-sm">
                                Belum ada riwayat transaksi.
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-100">
                                        <tr>
                                            <th className="px-6 py-4">ID Transaksi</th>
                                            <th className="px-6 py-4">Undangan</th>
                                            <th className="px-6 py-4">Paket</th>
                                            <th className="px-6 py-4">Tanggal</th>
                                            <th className="px-6 py-4">Total</th>
                                            <th className="px-6 py-4">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {orders.map(order => (
                                            <tr key={order.id} className="hover:bg-gray-50/50">
                                                <td className="px-6 py-4 font-mono text-xs text-gray-500">
                                                    {order.id.slice(-8).toUpperCase()}
                                                </td>
                                                <td className="px-6 py-4 font-medium text-gray-800">
                                                    {order.invitation.title}
                                                </td>
                                                <td className="px-6 py-4 capitalize">
                                                    {order.plan}
                                                </td>
                                                <td className="px-6 py-4 text-gray-500">
                                                    {new Date(order.paid_at || order.created_at).toLocaleDateString('id-ID', {
                                                        day: 'numeric',
                                                        month: 'long',
                                                        year: 'numeric'
                                                    })}
                                                </td>
                                                <td className="px-6 py-4 font-medium">
                                                    {formatCurrency(order.amount)}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                        order.status === 'paid' ? 'bg-green-100 text-green-800' :
                                                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-red-100 text-red-800'
                                                    }`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            <DialogModal {...dialogConfig} onClose={closeDialog} />
        </DashboardLayout>
    )
}
