import React, { useEffect, useState } from 'react'
import { Head, Link, router } from '@inertiajs/react'
import { ArrowLeft, Monitor, Smartphone, Save, Undo, Redo, CheckCircle2, ExternalLink } from 'lucide-react'
import { useEditorStore } from './Store'
import LeftSidebar from './components/LeftSidebar'
import RightSidebar from './components/RightSidebar'
import Canvas from './components/Canvas'
import PublishModal from './components/PublishModal'
import DialogModal from '@/components/DialogModal'
import { AlertCircle, HelpCircle, Rocket } from 'lucide-react'
import type { Invitation } from '@/types'

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
    invitation: Invitation
    hasActiveOrder: boolean
    plans: Plan[]
}

export default function EditorIndex({ invitation, hasActiveOrder, plans }: Props) {
    const {
        design,
        setDesign,
        deviceMode,
        setDeviceMode,
        historyIndex,
        history,
        undo,
        redo,
        isSaving,
        setSaving,
        lastSaved,
        setLastSaved,
    } = useEditorStore()

    const [isPublishModalOpen, setIsPublishModalOpen] = useState(false)
    const [isPublished, setIsPublished] = useState(invitation.status === 'published')

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

    // Initialize store from server-provided design
    useEffect(() => {
        if (invitation.design) {
            setDesign(invitation.design as any)
        }
    }, [invitation, setDesign])

    const handleSave = () => {
        setSaving(true)
        router.put(
            route('invitations.design.save', invitation.id),
            { design },
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => setLastSaved(new Date()),
                onError: (errors) => {
                    console.error('Failed to save design', errors)
                    setDialogConfig({
                        isOpen: true,
                        isAlert: true,
                        title: 'Gagal Menyimpan',
                        description: 'Gagal menyimpan desain. Silakan periksa kembali koneksi atau data yang dimasukkan.',
                        icon: <AlertCircle className="w-6 h-6" />,
                        variant: 'danger',
                    })
                },
                onFinish: () => setSaving(false),
            },
        )
    }

    /**
     * Called when user has already paid — confirm before publishing directly.
     */
    const handleDirectPublish = () => {
        setDialogConfig({
            isOpen: true,
            isAlert: false,
            title: 'Publikasikan Undangan?',
            description: 'Undangan ini sudah dibayar dan siap untuk disebarkan. Ingin mempublikasikannya sekarang agar bisa diakses oleh tamu?',
            icon: <HelpCircle className="w-6 h-6" />,
            confirmText: 'Ya, Publikasikan',
            onConfirm: () => {
                router.post(
                    route('invitations.publish', invitation.id),
                    {},
                    {
                        preserveScroll: true,
                        onSuccess: () => setIsPublished(true),
                    },
                )
            },
        })
    }

    /**
     * Called from PublishModal's onSuccess after Snap payment — same as direct publish.
     */
    const handlePublishClick = () => {
        if (hasActiveOrder || isPublished) {
            // Already paid — publish straight away
            if (!isPublished) {
                handleDirectPublish()
            }
            return
        }
        // No paid order yet — open the payment modal
        setIsPublishModalOpen(true)
    }

    const canUndo = historyIndex > 0
    const canRedo = historyIndex < history.length - 1

    return (
        <div className="flex flex-col h-screen w-full bg-gray-50 overflow-hidden font-body">
            <Head title={`Editor - ${invitation.title}`} />

            {/* Top Toolbar */}
            <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 shrink-0 z-20">
                <div className="flex items-center gap-4">
                    <Link
                        href={route('invitations.index')}
                        className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Kembali"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <div className="h-5 w-px bg-gray-200" />
                    <div className="flex flex-col">
                        <h1 className="text-sm font-bold text-gray-900 leading-tight">
                            {invitation.title}
                        </h1>
                        <span className="text-[10px] text-gray-500">
                            {lastSaved
                                ? `Tersimpan: ${lastSaved.toLocaleTimeString()}`
                                : 'Belum ada perubahan'}
                        </span>
                    </div>
                </div>

                {/* Center — Device Toggle */}
                <div className="flex items-center bg-gray-100 p-1 rounded-lg">
                    <button
                        onClick={() => setDeviceMode('desktop')}
                        className={`p-1.5 rounded-md transition-colors ${
                            deviceMode === 'desktop'
                                ? 'bg-white shadow-sm text-gray-900'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                        title="Tampilan Desktop"
                    >
                        <Monitor className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => setDeviceMode('mobile')}
                        className={`p-1.5 rounded-md transition-colors ${
                            deviceMode === 'mobile'
                                ? 'bg-white shadow-sm text-gray-900'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                        title="Tampilan HP"
                    >
                        <Smartphone className="h-4 w-4" />
                    </button>
                </div>

                {/* Right — Actions */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={undo}
                        disabled={!canUndo}
                        className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                        title="Batal (Undo)"
                    >
                        <Undo className="h-4 w-4" />
                    </button>
                    <button
                        onClick={redo}
                        disabled={!canRedo}
                        className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                        title="Ulangi (Redo)"
                    >
                        <Redo className="h-4 w-4" />
                    </button>

                    <div className="h-5 w-px bg-gray-200 mx-1" />

                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 disabled:opacity-70 transition-colors shadow-sm"
                    >
                        {isSaving ? (
                            <div className="h-4 w-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <Save className="h-4 w-4" />
                        )}
                        Simpan
                    </button>

                    {isPublished ? (
                        /* Already published — show "Lihat Live" link */
                        <a
                            href={route('public.invitation', invitation.slug)}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-2 px-4 py-1.5 rounded-lg border border-[#c8956c] text-[#c8956c] text-sm font-medium hover:bg-[#c8956c]/10 transition-colors"
                        >
                            <ExternalLink className="h-4 w-4" />
                            Lihat Live
                        </a>
                    ) : (
                        /* Not yet published */
                        <button
                            onClick={handlePublishClick}
                            className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-gradient-to-r from-[#c8956c] to-[#8b5e5e] text-white text-sm font-medium hover:shadow-md transition-all"
                        >
                            Publikasikan
                        </button>
                    )}
                </div>
            </header>

            {/* Main Editor Area */}
            <main className="flex-1 flex overflow-hidden">
                <LeftSidebar />
                <Canvas />
                <RightSidebar />
            </main>

            {/* Publish / Payment Modal */}
            <PublishModal
                isOpen={isPublishModalOpen}
                onClose={() => setIsPublishModalOpen(false)}
                invitationId={invitation.id}
                invitationTitle={invitation.title}
                invitationSlug={invitation.slug}
                plans={plans}
            />

            {/* Custom Dialog for Confirmations & Alerts */}
            <DialogModal
                {...dialogConfig}
                onClose={closeDialog}
            />
        </div>
    )
}
