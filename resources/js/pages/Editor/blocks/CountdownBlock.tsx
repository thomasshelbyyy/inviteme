import React, { useState, useEffect } from 'react'
import BlockWrapper from './BlockWrapper'

export default function CountdownBlock({ props, theme }: any) {
    const { targetDate, label, completedText, style } = props
    
    const [timeLeft, setTimeLeft] = useState({
        days: 0, hours: 0, minutes: 0, seconds: 0
    })
    const [isCompleted, setIsCompleted] = useState(false)

    useEffect(() => {
        if (!targetDate) return

        const timer = setInterval(() => {
            const now = new Date().getTime()
            const target = new Date(targetDate).getTime()
            const distance = target - now

            if (distance < 0) {
                clearInterval(timer)
                setIsCompleted(true)
                return
            }

            setTimeLeft({
                days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((distance % (1000 * 60)) / 1000)
            })
            setIsCompleted(false)
        }, 1000)

        return () => clearInterval(timer)
    }, [targetDate])

    const labels = ['Hari', 'Jam', 'Menit', 'Detik']
    const values = [timeLeft.days, timeLeft.hours, timeLeft.minutes, timeLeft.seconds]

    return (
        <BlockWrapper props={props} theme={theme} className="px-4">
            {label && (
                <h3 
                    style={{ fontFamily: theme?.fontHeading, color: theme?.primaryColor }} 
                    className="text-3xl font-medium mb-8 text-center"
                >
                    {label}
                </h3>
            )}

            {isCompleted ? (
                <div 
                    style={{ fontFamily: theme?.fontBody, color: theme?.accentColor }}
                    className="text-xl font-medium text-center"
                >
                    {completedText}
                </div>
            ) : (
                <div className="grid grid-cols-4 gap-3 sm:gap-6 w-full max-w-lg mx-auto">
                    {values.map((val, i) => (
                        <div 
                            key={i} 
                            className={style === 'boxes' 
                                ? "flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl shadow-sm bg-white border border-gray-100" 
                                : "flex flex-col items-center justify-center"
                            }
                        >
                            <span 
                                style={{ fontFamily: theme?.fontHeading, color: theme?.primaryColor }}
                                className="text-3xl sm:text-5xl font-bold"
                            >
                                {String(val).padStart(2, '0')}
                            </span>
                            <span 
                                style={{ fontFamily: theme?.fontBody }}
                                className="text-xs sm:text-sm text-gray-500 mt-1 uppercase tracking-wider"
                            >
                                {labels[i]}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </BlockWrapper>
    )
}
