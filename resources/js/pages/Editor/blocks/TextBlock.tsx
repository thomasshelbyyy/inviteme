import React, { useEffect, useRef, useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import ImageExtension from '@tiptap/extension-image'
import LinkExtension from '@tiptap/extension-link'
import { TextStyle } from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import Placeholder from '@tiptap/extension-placeholder'
import BlockWrapper from './BlockWrapper'
import { useEditorStore } from '../Store'
import FloatingToolbar from '../components/FloatingToolbar'
import MediaPicker from '../components/MediaPicker'

const DEFAULT_CONTENT = '<p>Tulis sesuatu di sini…</p>'

/**
 * Rich text block powered by Tiptap.
 *
 * Edit mode  (block is active): full WYSIWYG editor with FloatingToolbar.
 * View mode  (block not active): renders stored HTML statically.
 *
 * Content is stored as HTML in block.props.content.
 * History is managed carefully: patchBlockProps on every keystroke,
 * commitHistory on editor blur — so each editing session = one undo step.
 *
 * blockId is injected by SortableBlock so we can read/write the store.
 */
export default function TextBlock({ props, theme, blockId }: any) {
    const { activeBlockId, patchBlockProps, commitHistory } = useEditorStore()
    const isEditing = activeBlockId === blockId

    const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false)

    // Track internal updates to avoid setContent feedback loops on undo/redo
    const isInternalUpdate = useRef(false)

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                // Disable the history extension — we use Zustand's own history
                history: false,
            }),
            ImageExtension.configure({
                inline: true,
                allowBase64: false,
            }),
            LinkExtension.configure({
                openOnClick: false,
                HTMLAttributes: { class: 'tiptap-link' },
            }),
            TextStyle,
            Color,
            Placeholder.configure({
                placeholder: 'Klik untuk mulai mengetik…',
            }),
        ],
        content: (props.content as string) || DEFAULT_CONTENT,
        editable: isEditing,
        editorProps: {
            attributes: {
                class: 'tiptap-editor outline-none',
            },
        },
        onUpdate: ({ editor }) => {
            isInternalUpdate.current = true
            patchBlockProps(blockId, { content: editor.getHTML() })
            // Reset flag after React re-render cycle
            setTimeout(() => {
                isInternalUpdate.current = false
            }, 0)
        },
        onBlur: () => {
            // Commit one undo history entry when the user leaves the editor
            commitHistory()
        },
    })

    // Sync external content changes (undo / redo from Zustand)
    useEffect(() => {
        if (!editor || isInternalUpdate.current) return
        const stored = (props.content as string) || DEFAULT_CONTENT
        if (stored !== editor.getHTML()) {
            editor.commands.setContent(stored, false)
        }
    }, [props.content, editor])

    // Toggle editable when active state changes
    useEffect(() => {
        if (!editor) return
        editor.setEditable(isEditing)
        if (isEditing) {
            // Small delay so the block selection UI settles first
            setTimeout(() => editor.commands.focus('end'), 50)
        }
    }, [isEditing, editor])

    // Clean up editor on unmount
    useEffect(() => {
        return () => {
            editor?.destroy()
        }
    }, [editor])

    const handleImageSelect = (url: string) => {
        editor?.chain().focus().setImage({ src: url }).run()
        setIsMediaPickerOpen(false)
    }

    return (
        <BlockWrapper props={props} theme={theme}>
            <div
                className="w-full px-6 max-w-3xl"
                style={{ textAlign: (props.align as any) || 'center' }}
            >
                {/* Quote marks (view mode only) */}
                {props.showQuoteMarks && !isEditing && (
                    <span
                        className="block text-6xl opacity-10 leading-none mb-2"
                        style={{ color: theme?.primaryColor, fontFamily: theme?.fontHeading }}
                    >
                        "
                    </span>
                )}

                {/* Tiptap editor — always mounted, editable toggled by isEditing */}
                <div
                    style={{
                        fontFamily: theme?.fontBody,
                        color: theme?.primaryColor,
                        textAlign: (props.align as any) || 'center',
                    }}
                    className={isEditing ? 'tiptap-editing' : ''}
                >
                    {editor && isEditing && (
                        <FloatingToolbar
                            editor={editor}
                            onInsertImageRequest={() => setIsMediaPickerOpen(true)}
                        />
                    )}
                    <EditorContent editor={editor} />
                </div>

                {/* Closing quote marks (view mode only) */}
                {props.showQuoteMarks && !isEditing && (
                    <span
                        className="block text-6xl opacity-10 leading-none mt-2 text-right"
                        style={{ color: theme?.primaryColor, fontFamily: theme?.fontHeading }}
                    >
                        "
                    </span>
                )}
            </div>

            {/* MediaPicker for inserting inline images */}
            <MediaPicker
                isOpen={isMediaPickerOpen}
                onClose={() => setIsMediaPickerOpen(false)}
                onSelect={handleImageSelect}
            />
        </BlockWrapper>
    )
}
