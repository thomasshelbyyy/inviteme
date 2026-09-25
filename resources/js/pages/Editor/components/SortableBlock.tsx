import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Trash2, Copy } from 'lucide-react'
import { useEditorStore } from '../Store'
import { blockRegistry } from '../BlockRegistry'
import ResizeHandle from './ResizeHandle'

interface Props {
    id: string
    type: string
    props: Record<string, unknown>
}

export default function SortableBlock({ id, type, props }: Props) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id })

    const { design, activeBlockId, setActiveBlock, removeBlock, duplicateBlock } = useEditorStore()

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 1,
        opacity: isDragging ? 0.5 : 1,
    }

    const isActive = activeBlockId === id
    const blockDef = blockRegistry[type]
    const BlockComponent = blockDef?.component

    if (!BlockComponent) return null

    return (
        <div
            ref={setNodeRef}
            style={style}
            data-block-id={id}
            className="relative group w-full"
            onClick={() => setActiveBlock(id)}
        >
            {/* Editor selection overlay */}
            <div
                className={`absolute inset-0 border-2 pointer-events-none z-20 transition-colors ${
                    isActive
                        ? 'border-[#c8956c]'
                        : 'border-transparent group-hover:border-[#c8956c]/30'
                }`}
            />

            {/* Toolbar — only visible on hover or active */}
            <div
                className={`absolute -top-3 right-2 flex items-center bg-white shadow-md border border-gray-100 rounded-lg p-1 z-30 transition-opacity ${
                    isActive || isDragging ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                }`}
            >
                <button
                    {...attributes}
                    {...listeners}
                    className="p-1.5 text-gray-400 hover:text-gray-700 cursor-grab active:cursor-grabbing rounded hover:bg-gray-50"
                    title="Geser"
                >
                    <GripVertical className="h-4 w-4" />
                </button>
                <div className="w-px h-4 bg-gray-200 mx-1" />
                <button
                    onClick={(e) => { e.stopPropagation(); duplicateBlock(id) }}
                    className="p-1.5 text-gray-400 hover:text-blue-600 rounded hover:bg-blue-50"
                    title="Duplikat"
                >
                    <Copy className="h-4 w-4" />
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); removeBlock(id) }}
                    className="p-1.5 text-gray-400 hover:text-red-600 rounded hover:bg-red-50"
                    title="Hapus"
                >
                    <Trash2 className="h-4 w-4" />
                </button>
            </div>

            {/* Block name badge */}
            <div
                className={`absolute top-2 left-2 px-2 py-1 text-[10px] font-bold text-white bg-black/50 rounded pointer-events-none z-30 transition-opacity ${
                    isActive || isDragging ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                }`}
            >
                {blockDef.name}
            </div>

            {/* Actual Block Component
                - pointer-events-none when not active so clicks select the block.
                - pointer-events-auto when active so rich-text editors (Tiptap) get events. */}
            <div className={`w-full relative ${isActive ? 'pointer-events-auto' : 'pointer-events-none'}`}>
                <BlockComponent props={props} theme={design.theme} blockId={id} />
            </div>

            {/* Drag-to-resize handle — skipped for blocks that manage their own height */}
            {(blockDef.hasResizeHandle ?? true) && (
                <ResizeHandle
                    blockId={id}
                    currentMinHeight={props.minHeight as number | undefined}
                />
            )}
        </div>
    )
}
