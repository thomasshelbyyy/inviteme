import React, { useEffect, useRef, useState } from 'react'
import { Rnd } from 'react-rnd'
import { Trash2 } from 'lucide-react'
import type { CanvasElement } from '@/types'
import { useEditorStore } from '../Store'
import MediaPicker from '../components/MediaPicker'

// ─── Element Renderers ─────────────────────────────────────────────────────

function ElementContent({
    element,
    isSelected,
    isEditing,
    isTextEditing,
    onDoubleClick,
    onTextChange,
}: {
    element: CanvasElement
    isSelected: boolean
    isEditing: boolean
    isTextEditing: boolean
    onDoubleClick: () => void
    onTextChange: (text: string) => void
}) {
    const textRef = useRef<HTMLDivElement>(null)

    // Focus contenteditable when entering text edit mode
    useEffect(() => {
        if (isTextEditing && textRef.current) {
            textRef.current.focus()
            // Move cursor to end
            const range = document.createRange()
            range.selectNodeContents(textRef.current)
            range.collapse(false)
            const sel = window.getSelection()
            sel?.removeAllRanges()
            sel?.addRange(range)
        }
    }, [isTextEditing])

    const gradientBg = element.useGradient
        ? `linear-gradient(${element.gradientDirection ?? 'to right'}, ${element.fill}, ${element.fill2 ?? '#8b5e5e'})`
        : undefined

    const sharedStyle: React.CSSProperties = {
        width: '100%',
        height: '100%',
        background: gradientBg ?? element.fill,
        opacity: element.opacity,
        borderRadius: element.type === 'circle' ? '50%' : element.type === 'triangle' ? '0' : `${element.borderRadius}px`,
        border: element.borderWidth > 0 ? `${element.borderWidth}px solid ${element.borderColor}` : 'none',
        overflow: element.type === 'triangle' ? 'visible' : 'hidden',
        boxSizing: 'border-box',
        transform: element.rotation ? `rotate(${element.rotation}deg)` : undefined,
        clipPath: element.type === 'triangle' ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : undefined,
    }

    if (element.type === 'image') {
        return (
            <div style={sharedStyle}>
                {element.src ? (
                    <img
                        src={element.src}
                        alt=""
                        style={{ width: '100%', height: '100%', objectFit: element.objectFit, display: 'block' }}
                        draggable={false}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 text-xs">
                        🖼 Pilih Gambar
                    </div>
                )}
            </div>
        )
    }

    if (element.type === 'line') {
        return <div style={sharedStyle} onDoubleClick={onDoubleClick} />
    }

    if (element.type === 'triangle') {
        return <div style={sharedStyle} onDoubleClick={onDoubleClick} />
    }

    if (element.type === 'text') {
        return (
            <div
                style={{
                    ...sharedStyle,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent:
                        element.textAlign === 'left'
                            ? 'flex-start'
                            : element.textAlign === 'right'
                                ? 'flex-end'
                                : 'center',
                    cursor: isEditing ? (isTextEditing ? 'text' : 'move') : 'default',
                }}
                onDoubleClick={isEditing ? onDoubleClick : undefined}
            >
                <div
                    ref={textRef}
                    contentEditable={isTextEditing}
                    suppressContentEditableWarning
                    onBlur={(e) => onTextChange(e.currentTarget.textContent ?? '')}
                    onKeyDown={(e) => {
                        if (e.key === 'Escape') {
                            onTextChange(e.currentTarget.textContent ?? '')
                            e.currentTarget.blur()
                        }
                        e.stopPropagation()
                    }}
                    style={{
                        outline: 'none',
                        width: '100%',
                        textAlign: element.textAlign,
                        fontSize: element.fontSize,
                        fontWeight: element.fontWeight,
                        color: element.textColor,
                        fontFamily: element.fontFamily,
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                        padding: '4px 8px',
                        userSelect: isTextEditing ? 'text' : 'none',
                    }}
                >
                    {element.text}
                </div>
            </div>
        )
    }

    // rect & circle
    return <div style={sharedStyle} onDoubleClick={isEditing ? onDoubleClick : undefined} />
}

// ─── Main Component ────────────────────────────────────────────────────────

export default function CanvasContainerBlock({ props, theme, blockId }: any) {
    const {
        containerHeight = 400,
        referenceWidth = 600,
        elements = [] as CanvasElement[],
        backgroundColor = 'transparent',
        backgroundImage = null,
        overlayOpacity = 0,
    } = props as {
        containerHeight: number
        referenceWidth: number
        elements: CanvasElement[]
        backgroundColor: string
        backgroundImage: string | null
        overlayOpacity: number
    }

    const { activeBlockId, activeElementId, setActiveElement, patchElement, updateElement, removeElement } =
        useEditorStore()

    const isBlockActive = activeBlockId === blockId
    const isEditorMode = !!blockId

    // Measure actual rendered width for CSS scale calculation
    const outerRef = useRef<HTMLDivElement>(null)
    const [containerWidth, setContainerWidth] = useState(referenceWidth as number)

    useEffect(() => {
        const el = outerRef.current
        if (!el) return
        const observer = new ResizeObserver((entries) => {
            const w = entries[0]?.contentRect.width
            if (w) setContainerWidth(w)
        })
        observer.observe(el)
        return () => observer.disconnect()
    }, [])

    const scale = Math.min(1, containerWidth / (referenceWidth as number))
    const scaledHeight = (containerHeight as number) * scale

    // Track which text element is being edited inline
    const [textEditingId, setTextEditingId] = useState<string | null>(null)

    // Image picker state
    const [imagePickerElementId, setImagePickerElementId] = useState<string | null>(null)

    // When block becomes inactive, exit text editing
    useEffect(() => {
        if (!isBlockActive) {
            setTextEditingId(null)
        }
    }, [isBlockActive])

    const sorted = [...(elements as CanvasElement[])].sort((a, b) => a.zIndex - b.zIndex)

    return (
        <>
            {/* Outer wrapper — true rendered width, height = canvas × scale */}
            <div
                ref={outerRef}
                className="w-full overflow-hidden"
                style={{ height: scaledHeight }}
                onClick={() => {
                    if (isBlockActive) {
                        setActiveElement(null)
                        setTextEditingId(null)
                    }
                }}
            >
                {/* Inner design canvas — always at referenceWidth, then CSS-scaled */}
                <div
                    style={{
                        width: referenceWidth as number,
                        height: containerHeight as number,
                        transform: `scale(${scale})`,
                        transformOrigin: 'top left',
                        position: 'relative',
                        backgroundColor: backgroundColor !== 'transparent' ? (backgroundColor as string) : undefined,
                        overflow: 'hidden',
                    }}
                >
                    {/* Background image */}
                    {backgroundImage && (
                        <div
                            style={{
                                position: 'absolute',
                                inset: 0,
                                backgroundImage: `url(${backgroundImage})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                zIndex: 0,
                            }}
                        />
                    )}
                    {/* Overlay */}
                    {backgroundImage && (overlayOpacity as number) > 0 && (
                        <div
                            style={{ position: 'absolute', inset: 0, backgroundColor: 'black', opacity: overlayOpacity as number, zIndex: 0 }}
                        />
                    )}

                    {/* Elements */}
                    {sorted.map((element) => {
                        const isSelected = isBlockActive && activeElementId === element.id
                        const isTextEditing = textEditingId === element.id

                        return (
                            <Rnd
                                key={element.id}
                                position={{ x: element.x, y: element.y }}
                                size={{ width: element.width, height: element.height }}
                                bounds="parent"
                                disableDragging={!isBlockActive || isTextEditing}
                                enableResizing={isBlockActive && isSelected && !isTextEditing}
                                style={{ zIndex: element.zIndex }}
                                onDragStop={(_e, d) => {
                                    updateElement(blockId, element.id, { x: Math.round(d.x), y: Math.round(d.y) })
                                }}
                                onResizeStop={(_e, _dir, ref, _delta, position) => {
                                    updateElement(blockId, element.id, {
                                        width: Math.round(parseFloat(ref.style.width)),
                                        height: Math.round(parseFloat(ref.style.height)),
                                        x: Math.round(position.x),
                                        y: Math.round(position.y),
                                    })
                                }}
                                resizeHandleStyles={{
                                    bottomRight: { width: 12, height: 12, right: -4, bottom: -4, borderRadius: 2, background: '#c8956c', border: '2px solid white' },
                                    bottomLeft: { width: 12, height: 12, left: -4, bottom: -4, borderRadius: 2, background: '#c8956c', border: '2px solid white' },
                                    topRight: { width: 12, height: 12, right: -4, top: -4, borderRadius: 2, background: '#c8956c', border: '2px solid white' },
                                    topLeft: { width: 12, height: 12, left: -4, top: -4, borderRadius: 2, background: '#c8956c', border: '2px solid white' },
                                    right: { width: 8, height: 24, right: -4, top: '50%', transform: 'translateY(-50%)', borderRadius: 4, background: '#c8956c' },
                                    left: { width: 8, height: 24, left: -4, top: '50%', transform: 'translateY(-50%)', borderRadius: 4, background: '#c8956c' },
                                    top: { width: 24, height: 8, top: -4, left: '50%', transform: 'translateX(-50%)', borderRadius: 4, background: '#c8956c' },
                                    bottom: { width: 24, height: 8, bottom: -4, left: '50%', transform: 'translateX(-50%)', borderRadius: 4, background: '#c8956c' },
                                }}
                                onClick={(e) => {
                                    e.stopPropagation()
                                    if (isBlockActive) {
                                        setActiveElement(element.id)
                                        setTextEditingId(null)
                                    }
                                }}
                            >
                                {/* Selection outline */}
                                {isSelected && (
                                    <div
                                        style={{
                                            position: 'absolute', inset: -2, border: '2px solid #c8956c',
                                            borderRadius: element.type === 'circle' ? '50%' : element.type === 'triangle' ? '0' : `${element.borderRadius}px`,
                                            pointerEvents: 'none', zIndex: 9999,
                                        }}
                                    />
                                )}

                                {/* Delete button */}
                                {isSelected && !isTextEditing && (
                                    <button
                                        onMouseDown={(e) => e.stopPropagation()}
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            removeElement(blockId, element.id)
                                        }}
                                        style={{
                                            position: 'absolute', top: -28, right: 0,
                                            background: '#ef4444', color: 'white', border: 'none',
                                            borderRadius: 6, padding: '2px 6px', cursor: 'pointer',
                                            fontSize: 11, display: 'flex', alignItems: 'center', gap: 3,
                                            zIndex: 10000,
                                        }}
                                    >
                                        <Trash2 style={{ width: 10, height: 10 }} /> Hapus
                                    </button>
                                )}

                                <ElementContent
                                    element={element}
                                    isSelected={isSelected}
                                    isEditing={isBlockActive}
                                    isTextEditing={isTextEditing}
                                    onDoubleClick={() => {
                                        if (element.type === 'text') {
                                            setTextEditingId(element.id)
                                        }
                                        if (element.type === 'image') {
                                            setImagePickerElementId(element.id)
                                        }
                                    }}
                                    onTextChange={(text) => {
                                        updateElement(blockId, element.id, { text })
                                        setTextEditingId(null)
                                    }}
                                />
                            </Rnd>
                        )
                    })}

                    {/* Empty state hint */}
                    {isEditorMode && isBlockActive && (elements as CanvasElement[]).length === 0 && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <p className="text-sm text-gray-400 text-center">
                                Tambahkan elemen dari panel kiri ←
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Reference width indicator (editor only) */}
            {isEditorMode && isBlockActive && scale < 1 && (
                <div className="text-center text-[10px] text-gray-400 mt-1">
                    Design canvas {referenceWidth}px · ditampilkan {Math.round(scale * 100)}%
                </div>
            )}

            {/* Image picker for image elements */}
            <MediaPicker
                isOpen={imagePickerElementId !== null}
                onClose={() => setImagePickerElementId(null)}
                onSelect={(url) => {
                    if (imagePickerElementId) {
                        updateElement(blockId, imagePickerElementId, { src: url })
                    }
                    setImagePickerElementId(null)
                }}
            />
        </>
    )
}
