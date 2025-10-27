import axios from 'axios'

import { useState, useEffect } from 'react'
import MainContainer from '../../components/MainContainer'

export default function AdminUserTable() {
    const [users, setUsers] = useState([])

    const fetchUsers = async () => {
        try {
            const res = await axios.get('/api/users')
            setUsers(res.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    return (
        <>
            <div className="overflow-x-auto rounded border border-gray-300 shadow-sm dark:border-gray-600">
                <table className="min-w-full divide-y-2 divide-gray-200 dark:divide-gray-700">
                    <thead className="ltr:text-left rtl:text-right">
                        <tr className="*:font-medium *:text-gray-900 dark:*:text-white">
                            <th className="px-3 py-2 whitespace-nowrap">id</th>
                            <th className="px-3 py-2 whitespace-nowrap">username</th>
                            <th className="px-3 py-2 whitespace-nowrap">email</th>
                            <th className="px-3 py-2 whitespace-nowrap">created_at</th>
                            <th className="px-3 py-2 whitespace-nowrap">created_by</th>
                            <th className="px-3 py-2 whitespace-nowrap">is_admin</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {users.map((user) => (
                            <tr key={user.user_id} className="*:text-gray-900 *:first:font-medium dark:*:text-white">
                                <td className="px-3 py-2 whitespace-nowrap">{user.user_id}</td>
                                <td className="px-3 py-2 whitespace-nowrap">{user.username}</td>
                                <td className="px-3 py-2 whitespace-nowrap">{user.email}</td>
                                <td className="px-3 py-2 whitespace-nowrap">{user.created_at}</td>
                                <td className="px-3 py-2 whitespace-nowrap">{user.created_by}</td>
                                <td className="px-3 py-2 whitespace-nowrap">{user.is_admin}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}