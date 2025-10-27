import axios from "axios"

import { useState } from "react"
import { Link, useNavigate } from "react-router"

import { X, Sidebar, LogOut } from 'react-feather'

import Button from "../../components/Button"

function AdminSidebarLink({ children, to }) {
    return (
        <li>
            <Link
                to={to}
                className="block rounded-lg bg-gray-100 dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200"
            >
                {children}
            </Link>
        </li>
    )
}

// function AdminSidebarButton({ children, onClick }) {
//     return (
//         <button
//             className="cursor-pointer block rounded-lg bg-gray-100 dark:bg-gray-800 px-4 py-2 text-sm font-medium text-red-600/75 dark:text-red-400"
//             onClick={onClick}
//         >
//             {children}
//         </button>
//     )
// }

export default function AdminSidebar() {
    const navigate = useNavigate()
    const [isOpen, setIsOpen] = useState(true)

    const handleLogout = async () => {
        try {
            await axios.post("/api/auth/logout")
            navigate("/login")
        } catch (err) {
            console.log(err)
        }
    }

    const handleClick = () => setIsOpen(!isOpen)

    return (
        <>
            {isOpen ? (
                <div className="flex w-64 h-screen flex-col justify-between border-e border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-900">

                    <ul className="px-4 py-4">
                        {/* X w prawym górnym rogu */}
                        <div className="flex justify-end mb-4">
                            <button
                                onClick={handleClick}
                                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                            >
                                <X size={16}/>
                            </button>
                        </div>

                        <AdminSidebarLink to="/admin/users">Użytkownicy</AdminSidebarLink>
                    </ul>

                    <div className="px-4 py-6">
                            <Button
                                onClick={handleLogout}
                                color="gray"
                                className="text-red-600 dark:text-red-400"
                            >
                                Wyloguj się
                            </Button>
                    </div>
                </div>
            ) : (
                <button
                    onClick={handleClick}
                    className="fixed top-2 left-2 z-50 p-2 rounded-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 shadow hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                    <Sidebar size={16}/>
                </button>
            )}

            <div className={`flex-shrink-0 h-screen`}>
            </div>
        </>
    )
}