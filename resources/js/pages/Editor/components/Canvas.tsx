import React from 'react'
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core'
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { useEditorStore } from '../Store'
import SortableBlock from './SortableBlock'

export default function Canvas() {
    const { design, reorderBlocks, deviceMode } = useEditorStore()

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5, // 5px drag threshold before activating (allows clicking)
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event

        if (over && active.id !== over.id) {
            const oldIndex = design.blocks.findIndex((block) => block.id === active.id)
            const newIndex = design.blocks.findIndex((block) => block.id === over.id)
            reorderBlocks(oldIndex, newIndex)
        }
    }

    return (
        <div className="flex-1 bg-gray-100 flex items-center justify-center overflow-hidden relative">
            {/* Scrollable Container */}
            <div className="absolute inset-0 overflow-y-auto overflow-x-hidden flex justify-center p-4 sm:p-8">
                {/* Canvas Area */}
                <div 
                    className={`bg-white shadow-2xl relative transition-all duration-300 ${
                        deviceMode === 'mobile' 
                            ? 'w-full max-w-[414px] min-h-[896px] rounded-3xl overflow-hidden border-8 border-gray-900 shadow-gray-400/50' 
                            : 'w-full max-w-4xl min-h-screen'
                    }`}
                    style={{ backgroundColor: design.theme?.backgroundColor || '#FDF8F3' }}
                >
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={design.blocks.map(b => b.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            <div className="flex flex-col w-full min-h-full">
                                {design.blocks.length === 0 ? (
                                    <div className="flex-1 flex flex-col items-center justify-center text-center p-12 opacity-50">
                                        <p className="font-medium text-gray-500">Kanvas Kosong</p>
                                        <p className="text-sm text-gray-400 mt-2">Tambahkan blok dari panel kiri untuk mulai mendesain.</p>
                                    </div>
                                ) : (
                                    design.blocks.map((block) => (
                                        block.visible && (
                                            <SortableBlock 
                                                key={block.id} 
                                                id={block.id} 
                                                type={block.type} 
                                                props={block.props} 
                                            />
                                        )
                                    ))
                                )}
                            </div>
                        </SortableContext>
                    </DndContext>
                </div>
            </div>
        </div>
    )
}
