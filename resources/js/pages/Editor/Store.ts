import { create } from 'zustand'
import type { InvitationDesign, InvitationBlock, CanvasElement, CanvasElementType } from '@/types'

/** Default element dimensions when first added to a canvas container. */
const ELEMENT_DEFAULTS: Record<CanvasElementType, { width: number; height: number }> = {
    rect: { width: 200, height: 100 },
    circle: { width: 120, height: 120 },
    text: { width: 200, height: 60 },
    image: { width: 200, height: 200 },
    line: { width: 300, height: 6 },
    triangle: { width: 120, height: 120 },
}

interface EditorState {
    design: InvitationDesign
    history: InvitationDesign[]
    historyIndex: number
    activeBlockId: string | null
    /** ID of the element selected inside a CanvasContainer block. */
    activeElementId: string | null
    isSaving: boolean
    lastSaved: Date | null
    deviceMode: 'desktop' | 'mobile'

    // Design-level actions
    setDesign: (design: InvitationDesign) => void
    updateTheme: (theme: Partial<InvitationDesign['theme']>) => void
    updateSettings: (settings: Partial<InvitationDesign['settings']>) => void

    // Block actions
    addBlock: (type: string) => void
    removeBlock: (id: string) => void
    duplicateBlock: (id: string) => void
    /** Updates props AND commits a history snapshot. Use for discrete user actions. */
    updateBlockProps: (id: string, props: Record<string, unknown>) => void
    /** Updates props WITHOUT committing history. Use for high-frequency updates
     * (e.g. per-keystroke rich text, mid-drag resize). Call commitHistory() manually when done. */
    patchBlockProps: (id: string, props: Record<string, unknown>) => void
    reorderBlocks: (startIndex: number, endIndex: number) => void
    setActiveBlock: (id: string | null) => void

    // Canvas element actions
    setActiveElement: (elementId: string | null) => void
    addElement: (blockId: string, type: CanvasElementType) => void
    /** Updates element props AND commits history. */
    updateElement: (blockId: string, elementId: string, changes: Partial<CanvasElement>) => void
    /** Updates element props WITHOUT committing history (use during drag/resize). */
    patchElement: (blockId: string, elementId: string, changes: Partial<CanvasElement>) => void
    removeElement: (blockId: string, elementId: string) => void
    reorderElementZ: (blockId: string, elementId: string, direction: 'forward' | 'back' | 'front' | 'bottom') => void

    // History
    undo: () => void
    redo: () => void
    commitHistory: () => void

    // UI
    setDeviceMode: (mode: 'desktop' | 'mobile') => void
    setSaving: (saving: boolean) => void
    setLastSaved: (date: Date) => void
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Returns updated design blocks with the given block's element array replaced. */
function withUpdatedElements(
    design: InvitationDesign,
    blockId: string,
    updater: (elements: CanvasElement[]) => CanvasElement[],
): InvitationDesign {
    return {
        ...design,
        blocks: design.blocks.map((b) =>
            b.id === blockId
                ? { ...b, props: { ...b.props, elements: updater((b.props.elements as CanvasElement[]) ?? []) } }
                : b,
        ),
    }
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useEditorStore = create<EditorState>((set, get) => ({
    design: {
        version: 1,
        meta: { title: '', coupleNames: '', weddingDate: '', slug: '' },
        theme: { primaryColor: '#8B5E5E', secondaryColor: '#D4B896', backgroundColor: '#FDF8F3', fontHeading: 'Playfair Display', fontBody: 'Inter', accentColor: '#C8956C' },
        settings: { guestGreeting: '', musicAutoplay: true, musicUrl: '', showRsvp: true, language: 'id' },
        blocks: [],
    },
    history: [],
    historyIndex: -1,
    activeBlockId: null,
    activeElementId: null,
    isSaving: false,
    lastSaved: null,
    deviceMode: 'desktop',

    setDesign: (design) => set({ design, history: [design], historyIndex: 0 }),

    updateTheme: (themeUpdate) => {
        const { design, commitHistory } = get()
        set({ design: { ...design, theme: { ...design.theme, ...themeUpdate } } })
        commitHistory()
    },

    updateSettings: (settingsUpdate) => {
        const { design, commitHistory } = get()
        set({ design: { ...design, settings: { ...design.settings, ...settingsUpdate } } })
        commitHistory()
    },

    addBlock: (type) => {
        const { design, commitHistory } = get()
        const newBlock: InvitationBlock = {
            id: crypto.randomUUID(),
            type,
            visible: true,
            props: {},
        }
        set({ design: { ...design, blocks: [...design.blocks, newBlock] }, activeBlockId: newBlock.id })
        commitHistory()
    },

    removeBlock: (id) => {
        const { design, activeBlockId, commitHistory } = get()
        set({
            design: { ...design, blocks: design.blocks.filter((b) => b.id !== id) },
            activeBlockId: activeBlockId === id ? null : activeBlockId,
            activeElementId: null,
        })
        commitHistory()
    },

    duplicateBlock: (id) => {
        const { design, commitHistory } = get()
        const index = design.blocks.findIndex((b) => b.id === id)
        if (index === -1) return

        const blockToCopy = design.blocks[index]
        const newBlock = { ...blockToCopy, id: crypto.randomUUID() }

        const newBlocks = [...design.blocks]
        newBlocks.splice(index + 1, 0, newBlock)

        set({ design: { ...design, blocks: newBlocks }, activeBlockId: newBlock.id })
        commitHistory()
    },

    updateBlockProps: (id, propsUpdate) => {
        const { design, commitHistory } = get()
        set({
            design: {
                ...design,
                blocks: design.blocks.map((b) =>
                    b.id === id ? { ...b, props: { ...b.props, ...propsUpdate } } : b,
                ),
            },
        })
        commitHistory()
    },

    patchBlockProps: (id, propsUpdate) => {
        const { design } = get()
        set({
            design: {
                ...design,
                blocks: design.blocks.map((b) =>
                    b.id === id ? { ...b, props: { ...b.props, ...propsUpdate } } : b,
                ),
            },
        })
        // Intentionally no commitHistory — caller is responsible
    },

    reorderBlocks: (startIndex, endIndex) => {
        const { design, commitHistory } = get()
        const newBlocks = Array.from(design.blocks)
        const [reorderedItem] = newBlocks.splice(startIndex, 1)
        newBlocks.splice(endIndex, 0, reorderedItem)

        set({ design: { ...design, blocks: newBlocks } })
        commitHistory()
    },

    setActiveBlock: (id) => set({ activeBlockId: id, activeElementId: null }),

    // ── Canvas element actions ──────────────────────────────────────────────

    setActiveElement: (elementId) => set({ activeElementId: elementId }),

    addElement: (blockId, elementType) => {
        const { design, commitHistory } = get()
        const block = design.blocks.find((b) => b.id === blockId)
        if (!block) return

        const referenceWidth = (block.props.referenceWidth as number) ?? 600
        const containerHeight = (block.props.containerHeight as number) ?? 400
        const elements = (block.props.elements as CanvasElement[]) ?? []
        const maxZ = elements.length > 0 ? Math.max(...elements.map((e) => e.zIndex)) : 0

        const { width, height } = ELEMENT_DEFAULTS[elementType]

        const newElement: CanvasElement = {
            id: crypto.randomUUID(),
            type: elementType,
            x: Math.round((referenceWidth - width) / 2),
            y: Math.round((containerHeight - height) / 2),
            width,
            height,
            zIndex: maxZ + 1,
            fill: elementType === 'text' ? 'transparent' : '#c8956c',
            opacity: 1,
            borderColor: '#8b5e5e',
            borderWidth: elementType === 'text' ? 0 : 0,
            borderRadius: elementType === 'circle' ? 50 : 8,
            text: elementType === 'text' ? 'Klik dua kali untuk edit' : '',
            fontSize: 18,
            fontWeight: 'normal',
            textColor: '#4a2c2c',
            textAlign: 'center',
            fontFamily: 'Inter',
            src: null,
            objectFit: 'cover',
            useGradient: false,
            fill2: '#8b5e5e',
            gradientDirection: 'to right',
            rotation: 0,
        }

        if (elementType === 'line') {
            newElement.fill = '#4a2c2c'
            newElement.borderWidth = 0
            newElement.borderRadius = 4
        }

        if (elementType === 'triangle') {
            newElement.fill = '#c8956c'
            newElement.borderWidth = 0
            newElement.borderRadius = 0
        }

        set({
            design: withUpdatedElements(design, blockId, (els) => [...els, newElement]),
            activeElementId: newElement.id,
        })
        commitHistory()
    },

    updateElement: (blockId, elementId, changes) => {
        const { design, commitHistory } = get()
        set({
            design: withUpdatedElements(design, blockId, (els) =>
                els.map((e) => (e.id === elementId ? { ...e, ...changes } : e)),
            ),
        })
        commitHistory()
    },

    patchElement: (blockId, elementId, changes) => {
        const { design } = get()
        set({
            design: withUpdatedElements(design, blockId, (els) =>
                els.map((e) => (e.id === elementId ? { ...e, ...changes } : e)),
            ),
        })
        // No commitHistory
    },

    removeElement: (blockId, elementId) => {
        const { commitHistory } = get()
        const { design } = get()
        set({
            design: withUpdatedElements(design, blockId, (els) => els.filter((e) => e.id !== elementId)),
            activeElementId: null,
        })
        commitHistory()
    },

    reorderElementZ: (blockId, elementId, direction) => {
        const { design, commitHistory } = get()
        const block = design.blocks.find((b) => b.id === blockId)
        if (!block) return

        const elements = [...((block.props.elements as CanvasElement[]) ?? [])]
        const sorted = [...elements].sort((a, b) => a.zIndex - b.zIndex)
        const idx = sorted.findIndex((e) => e.id === elementId)

        let updated = elements.map((e) => ({ ...e }))

        if (direction === 'front') {
            const maxZ = Math.max(...elements.map((e) => e.zIndex))
            updated = updated.map((e) => (e.id === elementId ? { ...e, zIndex: maxZ + 1 } : e))
        } else if (direction === 'bottom') {
            const minZ = Math.min(...elements.map((e) => e.zIndex))
            updated = updated.map((e) => (e.id === elementId ? { ...e, zIndex: minZ - 1 } : e))
        } else if (direction === 'forward' && idx < sorted.length - 1) {
            const above = sorted[idx + 1]
            const zCurrent = sorted[idx].zIndex
            const zAbove = above.zIndex
            updated = updated.map((e) => {
                if (e.id === elementId) return { ...e, zIndex: zAbove }
                if (e.id === above.id) return { ...e, zIndex: zCurrent }
                return e
            })
        } else if (direction === 'back' && idx > 0) {
            const below = sorted[idx - 1]
            const zCurrent = sorted[idx].zIndex
            const zBelow = below.zIndex
            updated = updated.map((e) => {
                if (e.id === elementId) return { ...e, zIndex: zBelow }
                if (e.id === below.id) return { ...e, zIndex: zCurrent }
                return e
            })
        }

        set({ design: withUpdatedElements(design, blockId, () => updated) })
        commitHistory()
    },

    // ── History ─────────────────────────────────────────────────────────────

    undo: () => {
        const { history, historyIndex } = get()
        if (historyIndex > 0) {
            set({
                historyIndex: historyIndex - 1,
                design: history[historyIndex - 1],
                activeElementId: null,
            })
        }
    },

    redo: () => {
        const { history, historyIndex } = get()
        if (historyIndex < history.length - 1) {
            set({
                historyIndex: historyIndex + 1,
                design: history[historyIndex + 1],
            })
        }
    },

    commitHistory: () => {
        const { design, history, historyIndex } = get()
        const newHistory = history.slice(0, historyIndex + 1)
        newHistory.push(design)

        if (newHistory.length > 50) {
            newHistory.shift()
        }

        set({ history: newHistory, historyIndex: newHistory.length - 1 })
    },

    // ── UI ───────────────────────────────────────────────────────────────────

    setDeviceMode: (deviceMode) => set({ deviceMode }),
    setSaving: (isSaving) => set({ isSaving }),
    setLastSaved: (lastSaved) => set({ lastSaved }),
}))
