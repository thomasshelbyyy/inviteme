import React from 'react'

export type DividerStyle = 'wave' | 'slant' | 'fade' | 'line'

export interface DividerBlockProps {
    style: DividerStyle
    colorTop: string
    colorBottom: string
    height: number
    flip: boolean
}

export default function DividerBlock({ props }: any) {
    const {
        style = 'wave',
        colorTop = 'transparent',
        colorBottom = 'transparent',
        height = 80,
        flip = false,
    } = props as DividerBlockProps

    const transform = flip ? 'scaleX(-1)' : undefined

    const renderDivider = () => {
        if (style === 'wave') {
            return (
                <div style={{ height, position: 'relative', overflow: 'hidden', backgroundColor: colorTop }}>
                    <svg
                        viewBox="0 0 1440 80"
                        preserveAspectRatio="none"
                        style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '100%', display: 'block', transform }}
                    >
                        <path
                            d="M0,40 C360,80 720,0 1080,40 C1260,60 1380,50 1440,40 L1440,80 L0,80 Z"
                            fill={colorBottom}
                        />
                    </svg>
                </div>
            )
        }

        if (style === 'slant') {
            return (
                <div style={{ height, position: 'relative', overflow: 'hidden', backgroundColor: colorTop }}>
                    <svg
                        viewBox="0 0 1440 80"
                        preserveAspectRatio="none"
                        style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '100%', display: 'block', transform }}
                    >
                        <polygon points="0,80 1440,0 1440,80" fill={colorBottom} />
                    </svg>
                </div>
            )
        }

        if (style === 'fade') {
            return (
                <div style={{
                    height,
                    background: `linear-gradient(to bottom, ${colorTop}, ${colorBottom})`,
                }} />
            )
        }

        // line
        return (
            <div style={{ height, display: 'flex', alignItems: 'center', backgroundColor: colorTop, padding: '0 40px' }}>
                <div style={{ flex: 1, height: 2, background: colorBottom, borderRadius: 2 }} />
            </div>
        )
    }

    return (
        <div className="w-full">
            {renderDivider()}
        </div>
    )
}
