import React from 'react'
import { Plus, Trash2 } from 'lucide-react'
import BlockSettingsPanel from '../components/BlockSettingsPanel'

export default function ScheduleProperties({ props, onChange }: any) {
    const handleChange = (key: string, value: any) => {
        onChange({ [key]: value })
    }

    const handleEventChange = (index: number, key: string, value: any) => {
        const newEvents = [...(props.events || [])]
        newEvents[index] = { ...newEvents[index], [key]: value }
        handleChange('events', newEvents)
    }

    const addEvent = () => {
        const newEvents = [...(props.events || [])]
        newEvents.push({ name: 'Nama Acara', date: '', time: '', address: '' })
        handleChange('events', newEvents)
    }

    const removeEvent = (index: number) => {
        const newEvents = [...(props.events || [])]
        newEvents.splice(index, 1)
        handleChange('events', newEvents)
    }

    const events = props.events || []

    return (
        <div className="space-y-4">
            <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Judul Seksi</label>
                <input 
                    type="text" 
                    value={props.title || ''} 
                    onChange={(e) => handleChange('title', e.target.value)}
                    className="w-full text-sm border-gray-200 rounded-lg focus:ring-[#c8956c] focus:border-[#c8956c]"
                />
            </div>

            <div className="pt-2 border-t border-gray-100">
                <div className="flex items-center justify-between mb-3">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Daftar Acara</label>
                    <button 
                        onClick={addEvent}
                        className="text-xs text-[#c8956c] font-medium flex items-center hover:text-[#8b5e5e]"
                    >
                        <Plus className="h-3 w-3 mr-1" /> Tambah
                    </button>
                </div>

                <div className="space-y-4">
                    {events.map((event: any, index: number) => (
                        <div key={index} className="bg-gray-50 border border-gray-200 p-3 rounded-xl relative">
                            <button 
                                onClick={() => removeEvent(index)}
                                className="absolute top-3 right-3 text-gray-400 hover:text-red-500"
                            >
                                <Trash2 className="h-3.5 w-3.5" />
                            </button>
                            
                            <div className="space-y-3 mt-2">
                                <div>
                                    <label className="block text-[10px] font-medium text-gray-500 mb-1">Nama Acara</label>
                                    <input 
                                        type="text" 
                                        value={event.name || ''} 
                                        onChange={(e) => handleEventChange(index, 'name', e.target.value)}
                                        className="w-full text-xs border-gray-200 rounded-lg focus:ring-[#c8956c] focus:border-[#c8956c]"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="block text-[10px] font-medium text-gray-500 mb-1">Tanggal</label>
                                        <input 
                                            type="text" 
                                            placeholder="Cth: Minggu, 12 Sept"
                                            value={event.date || ''} 
                                            onChange={(e) => handleEventChange(index, 'date', e.target.value)}
                                            className="w-full text-xs border-gray-200 rounded-lg focus:ring-[#c8956c] focus:border-[#c8956c]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-medium text-gray-500 mb-1">Waktu</label>
                                        <input 
                                            type="text" 
                                            placeholder="Cth: 08:00 - Selesai"
                                            value={event.time || ''} 
                                            onChange={(e) => handleEventChange(index, 'time', e.target.value)}
                                            className="w-full text-xs border-gray-200 rounded-lg focus:ring-[#c8956c] focus:border-[#c8956c]"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-medium text-gray-500 mb-1">Alamat Singkat</label>
                                    <textarea 
                                        rows={2}
                                        value={event.address || ''} 
                                        onChange={(e) => handleEventChange(index, 'address', e.target.value)}
                                        className="w-full text-xs border-gray-200 rounded-lg focus:ring-[#c8956c] focus:border-[#c8956c]"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <BlockSettingsPanel props={props} onChange={handleChange} />
        </div>
    )
}
