import React from 'react'
import { Type, Image, Calendar, Clock, MapPin, Music, ImageIcon, MessageSquare, List, LayoutTemplate, Gift, Divide } from 'lucide-react'
import HeroBlock from './blocks/HeroBlock'
import HeroProperties from './blocks/HeroProperties'
import CountdownBlock from './blocks/CountdownBlock'
import CountdownProperties from './blocks/CountdownProperties'
import RsvpBlock from './blocks/RsvpBlock'
import RsvpProperties from './blocks/RsvpProperties'
import TextBlock from './blocks/TextBlock'
import TextProperties from './blocks/TextProperties'
import ScheduleBlock from './blocks/ScheduleBlock'
import ScheduleProperties from './blocks/ScheduleProperties'
import GiftBlock from './blocks/GiftBlock'
import GiftProperties from './blocks/GiftProperties'
import DividerBlock from './blocks/DividerBlock'
import DividerProperties from './blocks/DividerProperties'
import CanvasContainerBlock from './blocks/CanvasContainerBlock'
import CanvasContainerProperties from './blocks/CanvasContainerProperties'

export interface BlockDefinition {
    type: string
    name: string
    icon: React.ElementType
    category: 'header' | 'content' | 'media' | 'interactive'
    defaultProps: Record<string, unknown>
    component: React.ComponentType<any>
    propertiesComponent: React.ComponentType<any>
    /**
     * Set to false to hide the generic drag-to-resize handle on this block.
     * Defaults to true. Canvas Container manages its own height via a slider.
     */
    hasResizeHandle?: boolean
}

export const blockRegistry: Record<string, BlockDefinition> = {
    hero: {
        type: 'hero',
        name: 'Hero Cover',
        icon: Image,
        category: 'header',
        defaultProps: {
            title: 'The Wedding Of',
            coupleNames: 'Romeo & Juliet',
            subtitle: 'Kami mengundang Anda untuk hadir di hari bahagia kami.',
            textAlign: 'center',
            overlayOpacity: 0.4,
            backgroundImage: null,
            backgroundColor: 'transparent',
            height: 'screen',
            paddingTop: 'py-20',
            paddingBottom: 'pb-20',
        },
        component: HeroBlock,
        propertiesComponent: HeroProperties,
    },
    countdown: {
        type: 'countdown',
        name: 'Hitung Mundur',
        icon: Clock,
        category: 'interactive',
        defaultProps: {
            targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            label: 'Menuju Hari Bahagia',
            completedText: 'Hari Ini!',
            style: 'boxes',
            backgroundColor: 'transparent',
            backgroundImage: null,
            overlayOpacity: 0,
            paddingTop: 'py-12',
            paddingBottom: 'pb-12',
        },
        component: CountdownBlock,
        propertiesComponent: CountdownProperties,
    },
    rsvp: {
        type: 'rsvp',
        name: 'RSVP Form',
        icon: MessageSquare,
        category: 'interactive',
        defaultProps: {
            title: 'Konfirmasi Kehadiran',
            subtitle: 'Mohon konfirmasi kehadiran Anda',
            deadline: null,
            showGuestCount: true,
            showWishes: true,
            backgroundColor: 'transparent',
            backgroundImage: null,
            overlayOpacity: 0,
            paddingTop: 'py-12',
            paddingBottom: 'pb-12',
        },
        component: RsvpBlock,
        propertiesComponent: RsvpProperties,
    },
    text: {
        type: 'text',
        name: 'Teks / Kutipan',
        icon: Type,
        category: 'content',
        defaultProps: {
            text: 'Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya, dan dijadikan-Nya diantaramu rasa kasih dan sayang.',
            align: 'center',
            showQuoteMarks: true,
            isHighlight: false,
            backgroundColor: 'transparent',
            backgroundImage: null,
            overlayOpacity: 0,
            paddingTop: 'py-12',
            paddingBottom: 'pb-12',
        },
        component: TextBlock,
        propertiesComponent: TextProperties,
    },
    schedule: {
        type: 'schedule',
        name: 'Jadwal Acara',
        icon: Calendar,
        category: 'content',
        defaultProps: {
            title: 'Rangkaian Acara',
            events: [
                { name: 'Akad Nikah', date: 'Minggu, 12 September 2026', time: '08:00 - 10:00 WIB', address: 'Masjid Raya Al-Ikhlas' },
                { name: 'Resepsi', date: 'Minggu, 12 September 2026', time: '11:00 - 15:00 WIB', address: 'Gedung Serbaguna Mawar' },
            ],
            backgroundColor: 'transparent',
            backgroundImage: null,
            overlayOpacity: 0,
            paddingTop: 'py-12',
            paddingBottom: 'pb-12',
        },
        component: ScheduleBlock,
        propertiesComponent: ScheduleProperties,
    },
    gift: {
        type: 'gift',
        name: 'Kado (Amplop)',
        icon: Gift,
        category: 'interactive',
        defaultProps: {
            title: 'Wedding Gift',
            description: 'Tanpa mengurangi rasa hormat, bagi keluarga dan sahabat yang ingin memberikan tanda kasih untuk kami, dapat melalui:',
            useAccordion: true,
            items: [],
            backgroundColor: 'transparent',
            backgroundImage: null,
            overlayOpacity: 0,
            paddingTop: 'py-12',
            paddingBottom: 'pb-12',
        },
        component: GiftBlock,
        propertiesComponent: GiftProperties,
    },
    divider: {
        type: 'divider',
        name: 'Divider / Pemisah',
        icon: Divide,
        category: 'content',
        defaultProps: {
            style: 'wave',
            colorTop: 'transparent',
            colorBottom: '#ffffff',
            height: 80,
            flip: false,
        },
        component: DividerBlock,
        propertiesComponent: DividerProperties,
        hasResizeHandle: false,
    },
    'canvas-container': {
        type: 'canvas-container',
        name: 'Canvas Bebas',
        icon: LayoutTemplate,
        category: 'content',
        defaultProps: {
            referenceWidth: 600,
            containerHeight: 400,
            elements: [],
            backgroundColor: 'transparent',
            backgroundImage: null,
            overlayOpacity: 0,
        },
        component: CanvasContainerBlock,
        propertiesComponent: CanvasContainerProperties,
        // Canvas Container controls its own height via slider — no generic resize handle
        hasResizeHandle: false,
    },
}

export const blockCategories = [
    { id: 'header', name: 'Header & Cover' },
    { id: 'content', name: 'Teks & Konten' },
    { id: 'media', name: 'Media' },
    { id: 'interactive', name: 'Interaktif' },
]
