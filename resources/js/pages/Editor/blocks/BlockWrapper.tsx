import React from 'react'

export default function BlockWrapper({ props, children, className = '', theme }: any) {
    const {
        paddingTop = 'pt-12',
        paddingBottom = 'pb-12',
        backgroundColor = 'transparent',
        backgroundImage,
        overlayOpacity = 0,
        minHeight,
    } = props

    const hasBgImage = !!backgroundImage

    /**
     * When a block has no explicit background ('transparent'), fall back to the
     * global theme background colour so all blocks share the same canvas colour
     * by default. This prevents visually jarring white gaps between coloured blocks.
     */
    const effectiveBgColor =
        backgroundColor === 'transparent'
            ? (theme?.backgroundColor ?? undefined)
            : backgroundColor

    return (
        <div
            className={`relative w-full ${paddingTop} ${paddingBottom} ${className}`}
            style={{
                backgroundColor: effectiveBgColor,
                minHeight: minHeight ? `${minHeight}px` : undefined,
            }}
        >
            {/* Background Image Layer */}
            {hasBgImage && (
                <div
                    className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: `url(${backgroundImage})` }}
                />
            )}

            {/* Overlay Layer */}
            {hasBgImage && overlayOpacity > 0 && (
                <div
                    className="absolute inset-0 z-0 bg-black"
                    style={{ opacity: overlayOpacity }}
                />
            )}

            {/* Content Layer */}
            <div className="relative z-10 w-full h-full flex flex-col items-center">
                {children}
            </div>
        </div>
    )
}
