import { Head } from '@inertiajs/react'
import { useState, useRef, useEffect } from 'react'
import { blockRegistry } from '@/pages/Editor/BlockRegistry'
import PublicRsvpBlock from './PublicRsvpBlock'
import type { InvitationDesign } from '@/types'
import { Music, Pause, Play } from 'lucide-react'

interface Props {
    invitation: {
        id: string
        title: string
        slug: string
        design: InvitationDesign | null
    }
    guest: {
        id: string
        name: string
        token: string
        rsvp_status: string
    } | null
}

export default function PublicInvitation({ invitation, guest }: Props) {
    const design = invitation.design
    const [isPlaying, setIsPlaying] = useState(false)
    const [hasInteracted, setHasInteracted] = useState(false)
    const audioRef = useRef<HTMLAudioElement>(null)

    useEffect(() => {
        const handleInteraction = () => {
            if (!hasInteracted && design?.settings?.musicAutoplay && audioRef.current) {
                audioRef.current.play().then(() => {
                    setIsPlaying(true)
                }).catch(() => {})
                setHasInteracted(true)
            }
        }
        
        document.addEventListener('click', handleInteraction, { once: true })
        document.addEventListener('scroll', handleInteraction, { once: true })
        document.addEventListener('touchstart', handleInteraction, { once: true })
        
        return () => {
            document.removeEventListener('click', handleInteraction)
            document.removeEventListener('scroll', handleInteraction)
            document.removeEventListener('touchstart', handleInteraction)
        }
    }, [hasInteracted, design?.settings?.musicAutoplay])

    const toggleMusic = () => {
        if (!audioRef.current) return
        
        if (isPlaying) {
            audioRef.current.pause()
        } else {
            audioRef.current.play()
        }
        setIsPlaying(!isPlaying)
        setHasInteracted(true)
    }

    if (!design) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <p className="text-gray-500">Undangan ini belum memiliki desain.</p>
            </div>
        )
    }

    return (
        <div
            className="min-h-screen w-full relative overflow-x-hidden font-body"
            style={{
                backgroundColor: design.theme?.backgroundColor ?? '#FDF8F3',
            }}
        >
            <Head>
                <title>{invitation.title}</title>
                <meta name="description" content={`Undangan pernikahan digital — ${invitation.title}`} />
                <style>{`
                    :root {
                        --font-heading: ${design.theme?.fontHeading ?? 'Playfair Display'};
                        --font-body: ${design.theme?.fontBody ?? 'Inter'};
                    }
                `}</style>
            </Head>

            {/* Audio Element */}
            {design.settings?.musicUrl && (
                <>
                    <audio 
                        ref={audioRef} 
                        src={design.settings.musicUrl} 
                        loop 
                        preload="auto" 
                    />
                    
                    {/* Floating Music Button */}
                    <button 
                        onClick={toggleMusic}
                        className="fixed bottom-6 right-6 z-50 p-3 rounded-full shadow-lg text-white transition-transform hover:scale-110 flex items-center justify-center animate-bounce"
                        style={{ backgroundColor: design.theme?.accentColor || '#C8956C' }}
                    >
                        {isPlaying ? <Pause className="h-5 w-5" /> : <Music className="h-5 w-5" />}
                    </button>
                </>
            )}

            {/* Guest greeting fixed header */}
            {guest && (
                <div 
                    className="fixed top-0 left-0 right-0 z-50 py-3 px-4 text-center shadow-sm backdrop-blur-md"
                    style={{ backgroundColor: `${design.theme?.primaryColor}E6` || 'rgba(139, 94, 94, 0.9)' }}
                >
                    <p className="text-white text-sm font-medium tracking-wide">
                        Kepada Yth. <strong>{guest.name}</strong>
                    </p>
                </div>
            )}

            {/* Render all blocks in order */}
            <div className={`mx-auto max-w-[500px] bg-white shadow-2xl min-h-screen pb-12 ${guest ? 'pt-12' : ''}`}
                 style={{ backgroundColor: design.theme?.backgroundColor ?? '#FDF8F3' }}>
                
                {design.blocks.map((block) => {
                    if (!block.visible) return null

                    if (block.type === 'rsvp') {
                        return (
                            <PublicRsvpBlock 
                                key={block.id}
                                props={block.props}
                                theme={design.theme}
                                slug={invitation.slug}
                                guest={guest}
                            />
                        )
                    }

                    const blockDef = blockRegistry[block.type]
                    if (!blockDef) return null
                    
                    const BlockComponent = blockDef.component
                    
                    return (
                        <BlockComponent 
                            key={block.id} 
                            props={block.props} 
                            theme={design.theme} 
                        />
                    )
                })}
            </div>
        </div>
    )
}
