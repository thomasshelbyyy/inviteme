import React from 'react'
import BlockWrapper from './BlockWrapper'

export default function ScheduleBlock({ props, theme }: any) {
    const { title, events } = props
    
    const eventList = events || []

    return (
        <BlockWrapper props={props} theme={theme} className="px-4 w-full">
            <div className="max-w-2xl mx-auto text-center w-full relative z-10">
                {title && (
                    <h3 
                        style={{ fontFamily: theme?.fontHeading, color: theme?.primaryColor }} 
                        className="text-3xl font-medium mb-12"
                    >
                        {title}
                    </h3>
                )}
                
                <div className="space-y-12">
                    {eventList.map((event: any, index: number) => (
                        <div key={index} className="flex flex-col items-center">
                            <div className="bg-white rounded-full p-3 shadow-sm border border-gray-100 mb-4 text-[#8b5e5e]">
                                {/* Icon placeholder */}
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                            </div>
                            
                            <h4 
                                style={{ fontFamily: theme?.fontHeading, color: theme?.primaryColor }} 
                                className="text-2xl font-medium mb-2"
                            >
                                {event.name}
                            </h4>
                            
                            <div 
                                style={{ fontFamily: theme?.fontBody }} 
                                className="text-gray-500 text-sm space-y-1"
                            >
                                {event.date && <p className="font-semibold text-gray-700">{event.date}</p>}
                                {event.time && <p>{event.time}</p>}
                            </div>
                            
                            {event.address && (
                                <p 
                                    style={{ fontFamily: theme?.fontBody }} 
                                    className="mt-3 text-sm text-gray-500 max-w-sm"
                                >
                                    {event.address}
                                </p>
                            )}
                        </div>
                    ))}

                    {eventList.length === 0 && (
                        <div className="p-6 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 text-sm">
                            Belum ada jadwal ditambahkan. Tambahkan acara di panel properti.
                        </div>
                    )}
                </div>
            </div>
        </BlockWrapper>
    )
}
