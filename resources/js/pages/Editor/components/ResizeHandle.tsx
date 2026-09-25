import React, { useRef, useCallback } from 'react'
import { useEditorStore } from '../Store'

interface ResizeHandleProps {
    blockId: string
    currentMinHeight: number | undefined
}

/**
 * A draggable strip at the bottom of every block that lets the user
 * set a minimum height by dragging vertically. Uses pointer capture so
 * the drag stays smooth even when the cursor leaves the element.
 *
 * Uses patchBlockProps (no history) during drag and commitHistory on
 * pointer-up so the entire resize is a single undo step.
 */
export default function ResizeHandle({ blockId, currentMinHeight }: ResizeHandleProps) {
    const { patchBlockProps, commitHistory } = useEditorStore()

    const isDragging = useRef(false)
    const startY = useRef(0)
    const startHeight = useRef(0)

    const handlePointerDown = useCallback(
        (e: React.PointerEvent<HTMLDivElement>) => {
            e.stopPropagation()
            e.preventDefault()

            isDragging.current = true
            startY.current = e.pageY

            // Measure the actual rendered height of the block container.
            // ResizeHandle sits as a direct child of the SortableBlock root div.
            const blockEl = (e.currentTarget as HTMLElement).parentElement
            startHeight.current = blockEl ? blockEl.offsetHeight : (currentMinHeight ?? 200)
            ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
        },
        [currentMinHeight],
    )

    const handlePointerMove = useCallback(
        (e: React.PointerEvent<HTMLDivElement>) => {
            if (!isDragging.current) return
            e.stopPropagation()

            const delta = e.pageY - startY.current
            const newHeight = Math.max(80, startHeight.current + delta)
            patchBlockProps(blockId, { minHeight: newHeight })
        },
        [blockId, patchBlockProps],
    )

    const handlePointerUp = useCallback(
        (e: React.PointerEvent<HTMLDivElement>) => {
            if (!isDragging.current) return
            isDragging.current = false
            e.stopPropagation()
            // Commit one history entry for the complete resize gesture
            commitHistory()
        },
        [commitHistory],
    )

    return (
        <div
            className="absolute bottom-0 left-0 right-0 h-4 flex items-center justify-center cursor-ns-resize z-40 opacity-0 group-hover:opacity-100 transition-opacity duration-150 select-none"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onClick={(e) => e.stopPropagation()}
            title="Seret untuk mengubah tinggi blok"
        >
            {/* Visual indicator — three dots */}
            <div className="flex gap-1 px-3 py-1 bg-white/80 backdrop-blur-sm rounded-full shadow-sm border border-gray-200">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="w-1 h-1 rounded-full bg-[#c8956c]" />
                ))}
            </div>
        </div>
    )
}
