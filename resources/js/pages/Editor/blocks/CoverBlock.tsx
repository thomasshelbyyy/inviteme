import React from 'react'

export default function CoverBlock({ props, isPublic, isOpened, onOpen, theme }: any) {
    const { 
        title, 
        subtitle, 
        bgImage, 
        buttonText, 
        overlayColor = '#000000', 
        overlayOpacity = 50,
        guestName
    } = props

    const opacityStyle = overlayOpacity / 100

    if (!isPublic) {
        return (
            <div className="relative w-full h-[600px] flex flex-col items-center justify-center bg-cover bg-center overflow-hidden" style={{ backgroundImage: `url(${bgImage || ''})` }}>
                <div className="absolute inset-0 z-0" style={{ backgroundColor: overlayColor, opacity: opacityStyle }} />
                <div className="relative z-10 flex flex-col items-center text-center p-8 text-white w-full max-w-2xl mx-auto">
                    {title && <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: theme?.fontHeading, textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>{title}</h1>}
                    {subtitle && <p className="text-lg mb-8" style={{ fontFamily: theme?.fontBody, textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>{subtitle}</p>}
                    {guestName && (
                        <div className="mb-8" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
                            <p className="text-sm">Kepada Yth.</p>
                            <p className="text-xl font-semibold mt-1">{guestName}</p>
                        </div>
                    )}
                    <button className="px-6 py-3 bg-white text-black font-medium rounded-full cursor-pointer pointer-events-none shadow-lg">
                        {buttonText || 'Buka Undangan'}
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div 
            className={`fixed inset-0 z-[100] w-full h-[100dvh] flex flex-col items-center justify-center bg-cover bg-center overflow-hidden transition-transform duration-1000 ease-in-out ${isOpened ? '-translate-y-full' : 'translate-y-0'}`}
            style={{ backgroundImage: `url(${bgImage || ''})` }}
        >
            <div className="absolute inset-0 z-0" style={{ backgroundColor: overlayColor, opacity: opacityStyle }} />
            <div className="relative z-10 flex flex-col items-center text-center p-8 text-white w-full max-w-2xl mx-auto">
                {title && <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4" style={{ fontFamily: theme?.fontHeading, textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>{title}</h1>}
                {subtitle && <p className="text-lg md:text-xl mb-10" style={{ fontFamily: theme?.fontBody, textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>{subtitle}</p>}
                
                {guestName && (
                    <div className="mb-12" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
                        <p className="text-sm md:text-base opacity-90">Kepada Yth.</p>
                        <p className="text-2xl font-semibold mt-2">{guestName}</p>
                    </div>
                )}
                
                <button 
                    onClick={onOpen}
                    className="px-8 py-4 bg-white text-black font-medium rounded-full hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl flex items-center gap-2"
                    style={{ fontFamily: theme?.fontBody }}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
                    </svg>
                    {buttonText || 'Buka Undangan'}
                </button>
            </div>
        </div>
    )
}
