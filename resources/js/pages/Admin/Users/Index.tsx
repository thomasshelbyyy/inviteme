import React from 'react'
import { Head, router } from '@inertiajs/react'
import AdminLayout from '@/layouts/AdminLayout'
import { Search, ShieldAlert, ShieldCheck } from 'lucide-react'

export default function AdminUsers({ users, filters }: any) {
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        router.get(route('admin.users.index'), { search: e.target.value }, { preserveState: true, replace: true })
    }

    const toggleRole = (user: any) => {
        if (confirm(`Ubah role ${user.name} menjadi ${user.role === 'admin' ? 'user' : 'admin'}?`)) {
            router.put(route('admin.users.update', user.id), {
                role: user.role === 'admin' ? 'user' : 'admin'
            }, {
                preserveScroll: true,
                onError: (errors) => {
                    if (errors.role) alert(errors.role)
                }
            })
        }
    }

    return (
        <AdminLayout title="Manajemen Pengguna">
            <Head title="Manajemen Pengguna" />

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                    <div className="relative max-w-sm w-full">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            defaultValue={filters.search}
                            onChange={handleSearch}
                            className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-[#c8956c] focus:border-[#c8956c]"
                            placeholder="Cari nama atau email..."
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4">Nama</th>
                                <th className="px-6 py-4">Email</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Bergabung</th>
                                <th className="px-6 py-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {users.data.length > 0 ? users.data.map((user: any) => (
                                <tr key={user.id} className="hover:bg-gray-50/50">
                                    <td className="px-6 py-4 font-medium text-gray-800">
                                        {user.name}
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">
                                        {user.email}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                                        }`}>
                                            {user.role === 'admin' ? <ShieldCheck className="w-3.5 h-3.5" /> : <ShieldAlert className="w-3.5 h-3.5" />}
                                            {user.role.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">
                                        {new Date(user.created_at).toLocaleDateString('id-ID')}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button 
                                            onClick={() => toggleRole(user)}
                                            className="text-xs font-medium text-[#c8956c] hover:text-[#8b5e5e] hover:underline"
                                        >
                                            Ubah Role
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                        Tidak ada pengguna ditemukan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                
                {users.links && users.links.length > 3 && (
                    <div className="p-4 border-t border-gray-100 flex items-center justify-center">
                        <div className="flex gap-1">
                            {users.links.map((link: any, idx: number) => (
                                <Link 
                                    key={idx}
                                    href={link.url || '#'}
                                    className={`px-3 py-1 text-sm rounded-md border ${
                                        link.active 
                                            ? 'bg-[#c8956c] text-white border-[#c8956c]' 
                                            : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                    } ${!link.url && 'opacity-50 cursor-not-allowed'}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    )
}
