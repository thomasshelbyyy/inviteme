import React from 'react'
import BlockWrapper from './BlockWrapper'

export default function HeroBlock({ props, theme }: any) {
    const { title, coupleNames, subtitle, textAlign, backgroundImage, height } = props
    
    return (
        <BlockWrapper 
            props={props}
            theme={theme}
            className={`flex flex-col justify-center ${height === 'screen' ? 'min-h-screen' : 'min-h-[500px]'} w-full overflow-hidden`}
        >
            <div 
                className="p-8 flex flex-col gap-6 w-full"
                style={{ textAlign: textAlign as any }}
            >
                {title && (
                    <div 
                        style={{ fontFamily: theme?.fontBody, color: backgroundImage ? 'white' : theme?.primaryColor }} 
                        className="text-sm tracking-widest uppercase opacity-80"
                    >
                        {title}
                    </div>
                )}
                
                {coupleNames && (
                    <h1 
                        style={{ fontFamily: theme?.fontHeading, color: backgroundImage ? 'white' : theme?.primaryColor }} 
                        className="text-5xl sm:text-6xl md:text-7xl font-bold leading-tight"
                    >
                        {coupleNames}
                    </h1>
                )}
                
                {subtitle && (
                    <p 
                        style={{ fontFamily: theme?.fontBody, color: backgroundImage ? 'rgba(255,255,255,0.8)' : theme?.primaryColor }} 
                        className={`mt-4 max-w-lg opacity-80 leading-relaxed ${textAlign === 'center' ? 'mx-auto' : textAlign === 'right' ? 'ml-auto' : ''}`}
                    >
                        {subtitle}
                    </p>
                )}
            </div>
        </BlockWrapper>
    )
}
