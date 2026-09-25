import type { Config } from 'ziggy-js'

export interface User {
    id: number
    name: string
    email: string
    role: 'user' | 'admin'
    avatar: string | null
    phone: string | null
    email_verified_at: string | null
}

export interface Invitation {
    id: string
    user_id: number
    title: string
    slug: string
    status: 'draft' | 'published' | 'suspended'
    design: InvitationDesign | null
    theme: InvitationTheme | null
    published_at: string | null
    expires_at: string | null
    created_at: string
    updated_at: string
}

export interface InvitationTheme {
    primaryColor: string
    secondaryColor: string
    backgroundColor: string
    fontHeading: string
    fontBody: string
    accentColor: string
}

export interface InvitationDesign {
    version: number
    meta: {
        title: string
        coupleNames: string
        weddingDate: string
        slug: string
    }
    theme: InvitationTheme
    settings: {
        guestGreeting: string
        musicAutoplay: boolean
        musicUrl: string
        showRsvp: boolean
        language: string
    }
    blocks: InvitationBlock[]
}

export interface InvitationBlock {
    id: string
    type: string
    visible: boolean
    props: Record<string, unknown>
}

export type CanvasElementType = 'rect' | 'circle' | 'text' | 'image' | 'line' | 'triangle'

/**
 * A free-positioned element inside a CanvasContainer block.
 * Coordinates are in pixels relative to the block's referenceWidth canvas.
 * They are scaled visually via CSS transform when rendered on smaller screens.
 */
export interface CanvasElement {
    id: string
    type: CanvasElementType
    /** Pixels from left edge of reference canvas */
    x: number
    /** Pixels from top edge of reference canvas */
    y: number
    width: number
    height: number
    /** Stacking order — higher = on top */
    zIndex: number
    /** CSS background colour */
    fill: string
    /** 0–1 */
    opacity: number
    borderColor: string
    borderWidth: number
    /** 0 = sharp, 50 = pill/circle */
    borderRadius: number
    /** Text element content */
    text: string
    fontSize: number
    fontWeight: 'normal' | 'bold'
    textColor: string
    textAlign: 'left' | 'center' | 'right'
    fontFamily: string
    /** Image element src URL */
    src: string | null
    objectFit: 'cover' | 'contain'
    /** Gradient: if true, use linear-gradient instead of flat fill */
    useGradient: boolean
    /** Second gradient color */
    fill2: string
    /** CSS gradient direction e.g. 'to bottom', 'to right', '135deg' */
    gradientDirection: string
    /** Line/triangle rotation in degrees */
    rotation: number
}

export interface Guest {
    id: string
    invitation_id: string
    name: string
    phone: string | null
    email: string | null
    group: string | null
    address: string | null
    token: string
    rsvp_status: 'pending' | 'confirmed' | 'declined'
    created_at: string
    updated_at: string
    personalized_url?: string
}

export interface InvitationTemplate {
    id: string
    name: string
    slug: string
    description: string | null
    category: string | null
    thumbnail_url: string | null
    design: InvitationDesign | null
    is_premium: boolean
    is_published: boolean
    sort_order: number
}

export interface RsvpResponse {
    id: string
    invitation_id: string
    guest_id: string | null
    attendance: 'yes' | 'no'
    attendee_count: number
    message: string | null
    submitted_at: string
}

export interface InvitationMedia {
    id: string
    user_id: number
    invitation_id: string | null
    filename: string
    storage_path: string
    disk: string
    mime_type: string
    size_bytes: number
    width: number | null
    height: number | null
    alt_text: string | null
    url: string
}

export interface Plan {
    id: string
    key: string
    name: string
    description: string | null
    price: number
    features: string[]
    is_active: boolean
    formatted_price: string
}

export interface Order {
    id: string
    user_id: number
    invitation_id: string
    plan: string
    amount: number
    currency: string
    status: 'pending' | 'paid' | 'failed' | 'refunded'
    payment_gateway: string | null
    paid_at: string | null
    created_at: string
}

export interface PageProps {
    auth: {
        user: User | null
    }
    ziggy: Config & { location: string }
    flash?: {
        success?: string
        error?: string
    }
}

declare global {
    interface Window {
        axios: import('axios').AxiosStatic
    }
}
