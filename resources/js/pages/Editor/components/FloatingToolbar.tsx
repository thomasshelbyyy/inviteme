import React, { useState, useEffect, useCallback, useRef } from 'react'
import { createPortal } from 'react-dom'
import type { Editor } from '@tiptap/react'
import { Bold, Italic, Strikethrough, Link2, List, ListOrdered, Image as ImageIcon } from 'lucide-react'

interface FloatingToolbarProps {
    /** The active Tiptap editor instance. */
    editor: Editor
    /** Called when the user clicks "Insert Image" — parent opens the MediaPicker. */
    onInsertImageRequest: () => void
}

const TOOLBAR_HEIGHT = 44
const TOOLBAR_GAP = 8

/**
 * A floating rich-text toolbar that follows the user's selection.
 * Positioned via `fixed` so it works inside any scrollable container.
 *
 * - Uses native window.getSelection() for positioning (no tippy/BubbleMenu dep).
 * - Prevents deselection via onMouseDown preventDefault.
 * - Image insertion is delegated to the parent (MediaPicker lives outside).
 */
export default function FloatingToolbar({ editor, onInsertImageRequest }: FloatingToolbarProps) {
    const [pos, setPos] = useState<{ top: number; left: number } | null>(null)
    const [showLinkInput, setShowLinkInput] = useState(false)
    const [linkUrl, setLinkUrl] = useState('')
    const toolbarRef = useRef<HTMLDivElement>(null)

    /** Recalculate position whenever the editor selection changes. */
    const recalcPosition = useCallback(() => {
        if (!editor || editor.state.selection.empty) {
            setPos(null)
            return
        }

        const nativeSel = window.getSelection()
        if (!nativeSel || nativeSel.rangeCount === 0) {
            setPos(null)
            return
        }

        const range = nativeSel.getRangeAt(0)
        const rect = range.getBoundingClientRect()

        if (rect.width === 0 && rect.height === 0) {
            setPos(null)
            return
        }

        setPos({
            top: rect.top - TOOLBAR_HEIGHT - TOOLBAR_GAP,
            left: rect.left + rect.width / 2,
        })
    }, [editor])

    useEffect(() => {
        if (!editor) return

        editor.on('selectionUpdate', recalcPosition)
        editor.on('transaction', recalcPosition)

        return () => {
            editor.off('selectionUpdate', recalcPosition)
            editor.off('transaction', recalcPosition)
        }
    }, [editor, recalcPosition])

    // Close link input when selection collapses
    useEffect(() => {
        if (!pos) {
            setShowLinkInput(false)
        }
    }, [pos])

    const applyLink = () => {
        if (linkUrl.trim()) {
            editor.chain().focus().setLink({ href: linkUrl.trim(), target: '_blank' }).run()
        } else {
            editor.chain().focus().unsetLink().run()
        }
        setShowLinkInput(false)
        setLinkUrl('')
    }

    if (!pos) return null

    return createPortal(
        <div
            ref={toolbarRef}
            style={{
                position: 'fixed',
                top: pos.top,
                left: pos.left,
                transform: 'translateX(-50%)',
                zIndex: 9999,
            }}
            // Prevent mousedown from collapsing the text selection
            onMouseDown={(e) => e.preventDefault()}
            className="flex items-center bg-gray-900 text-white rounded-lg shadow-2xl border border-gray-700 overflow-hidden animate-fade-in"
        >
            {showLinkInput ? (
                /* Link URL input mode */
                <div className="flex items-center gap-1 px-2">
                    <input
                        autoFocus
                        type="url"
                        value={linkUrl}
                        onChange={(e) => setLinkUrl(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') { applyLink() }
                            if (e.key === 'Escape') { setShowLinkInput(false) }
                        }}
                        placeholder="https://..."
                        className="text-xs bg-transparent text-white border-0 outline-none w-44 py-2.5 placeholder-gray-500"
                    />
                    <button
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={applyLink}
                        className="text-[#c8956c] text-xs font-semibold px-2 py-1.5 hover:text-white transition-colors"
                    >
                        OK
                    </button>
                    <button
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => setShowLinkInput(false)}
                        className="text-gray-400 text-xs px-2 py-1.5 hover:text-white transition-colors"
                    >
                        ✕
                    </button>
                </div>
            ) : (
                /* Main toolbar mode */
                <>
                    <Btn
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        isActive={editor.isActive('bold')}
                        title="Bold (Ctrl+B)"
                    >
                        <Bold className="h-3.5 w-3.5" />
                    </Btn>
                    <Btn
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        isActive={editor.isActive('italic')}
                        title="Italic (Ctrl+I)"
                    >
                        <Italic className="h-3.5 w-3.5" />
                    </Btn>
                    <Btn
                        onClick={() => editor.chain().focus().toggleStrike().run()}
                        isActive={editor.isActive('strike')}
                        title="Coret"
                    >
                        <Strikethrough className="h-3.5 w-3.5" />
                    </Btn>

                    <Sep />

                    <Btn
                        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                        isActive={editor.isActive('heading', { level: 1 })}
                        title="Judul 1"
                    >
                        <span className="text-[11px] font-black leading-none">H1</span>
                    </Btn>
                    <Btn
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        isActive={editor.isActive('heading', { level: 2 })}
                        title="Judul 2"
                    >
                        <span className="text-[11px] font-black leading-none">H2</span>
                    </Btn>
                    <Btn
                        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                        isActive={editor.isActive('heading', { level: 3 })}
                        title="Judul 3"
                    >
                        <span className="text-[11px] font-black leading-none">H3</span>
                    </Btn>

                    <Sep />

                    <Btn
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        isActive={editor.isActive('bulletList')}
                        title="Bullet List"
                    >
                        <List className="h-3.5 w-3.5" />
                    </Btn>
                    <Btn
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        isActive={editor.isActive('orderedList')}
                        title="Numbered List"
                    >
                        <ListOrdered className="h-3.5 w-3.5" />
                    </Btn>

                    <Sep />

                    <Btn
                        onClick={() => {
                            setLinkUrl(editor.getAttributes('link').href || '')
                            setShowLinkInput(true)
                        }}
                        isActive={editor.isActive('link')}
                        title="Sisipkan Link"
                    >
                        <Link2 className="h-3.5 w-3.5" />
                    </Btn>
                    <Btn
                        onClick={onInsertImageRequest}
                        isActive={false}
                        title="Sisipkan Gambar"
                    >
                        <ImageIcon className="h-3.5 w-3.5" />
                    </Btn>
                </>
            )}
        </div>,
        document.body,
    )
}

/** Small toolbar button. */
function Btn({
    onClick,
    isActive,
    title,
    children,
}: {
    onClick: () => void
    isActive: boolean
    title: string
    children: React.ReactNode
}) {
    return (
        <button
            onClick={onClick}
            title={title}
            className={`px-2.5 py-2.5 text-sm transition-colors ${
                isActive
                    ? 'bg-white/20 text-white'
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
            }`}
        >
            {children}
        </button>
    )
}

/** Vertical separator between groups. */
function Sep() {
    return <div className="w-px h-5 bg-gray-600 mx-0.5 shrink-0" />
}
