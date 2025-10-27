import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

import axios from "axios"

import Button from "./Button"

function NavbarLink({ children, to, onClick }) {
    return (
        <li>
            <Link
                to={to}
                onClick={onClick}
                className="cursor-pointer select-none transition text-gray-500 hover:text-gray-500/75 dark:text-gray-100 dark:hover:text-gray-400/75"
            >
                {children}
            </Link>
        </li>
    )
}

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false)
    const navigate = useNavigate()

    const handleLogout = async () => {
        try {
            await axios.post("/api/auth/logout")
            navigate("/login")
        } catch (err) {
            console.log(err)
        }
    }

    const toggleMenu = () => setIsOpen(!isOpen)

    return (
        <>
            <header className="border-b dark:border-gray-700 fixed top-0 left-0 w-full z-50 bg-white dark:bg-gray-900">
                <div className="mx-auto flex h-16 max-w-screen-xl items-center justify-between px-4 sm:px-6 lg:px-8 gap-8">
                    <Link to="/" className="text-teal-600 font-bold text-lg">
                        <img src="../../public/navbar.png" alt="Logo" width={28} />
                    </Link>

                    {/* Desktop nav */}
                    <div className="flex flex-1 items-center justify-end md:justify-between">
                        <nav aria-label="Global" className="hidden md:block">
                            <ul className="flex items-center gap-6 text-sm">
                                <NavbarLink to="/">Moje zestawy</NavbarLink>
                                <NavbarLink to="/search-decks">Publiczne zestawy</NavbarLink>
                            </ul>
                        </nav>

                        <div className="flex items-center gap-4 md:visible invisible">
                            <Button
                                onClick={handleLogout}
                                color="gray"
                                className="text-red-600 dark:text-red-400"
                            >
                                Wyloguj się
                            </Button>
                        </div>
                    </div>

                    {/* Mobile hamburger */}
                    <div className="md:hidden flex items-center gap-2">
                        <button
                            onClick={toggleMenu}
                            className="rounded-sm bg-gray-100 p-2.5 text-gray-600 transition hover:text-gray-600/75 dark:border-gray-700 dark:bg-gray-800"
                        >
                            <span className="sr-only">Toggle menu</span>
                            ☰
                        </button>
                    </div>
                </div>

                {/* Mobile menu */}
                {isOpen && (
                    <nav className="md:hidden bg-gray-50 border-t dark:bg-gray-900 dark:border-gray-700">
                        <ul className="flex flex-col p-4 gap-4">
                            <NavbarLink to="/" onClick={toggleMenu}>
                                Moje zestawy
                            </NavbarLink>
                            <NavbarLink to="/search-decks" onClick={toggleMenu}>
                                Publiczne zestawy
                            </NavbarLink>
                            <li>
                                <button
                                    onClick={() => {
                                        handleLogout()
                                        setIsOpen(false)
                                    }}
                                    className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-red-600 transition hover:text-red-600/75 w-full text-left dark:bg-gray-800 dark:text-red-400 dark:hover:text-red-400/75"
                                >
                                    Wyloguj się
                                </button>
                            </li>
                        </ul>
                    </nav>
                )}
            </header>

            <div className="h-16"></div>
        </>
    )
}
