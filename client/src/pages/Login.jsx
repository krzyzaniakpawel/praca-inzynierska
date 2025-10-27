import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'
import axios from 'axios'

import useAlert from '../context/AlertContext'
import AlertContainer from '../components/Alert'

export default function Login() {
    const navigate = useNavigate()
    const location = useLocation()

    const [ username, setUsername ] = useState("")
    const [ password, setPassword ] = useState("")

    const { alert, showAlert, closeAlert } = useAlert({ header: location.state?.header || "", message: location.state?.message || "" })

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        const url = '/api/auth/login'
        try {
            const res = await axios.post(url, { username, password })
            showAlert("Sukces", "Zalogowano pomyślnie.")
            navigate("/", { state: { header: "Sukces", message: "Zalogowano pomyślnie." } })
        } catch (err) {
            showAlert("Błąd", err.response.data.message, "error")
        }
    }

    return (
        <>
            <div className="flex my-10 min-h-full flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <img src="../../public/navbar.png" alt="Logo" width={40} className="mx-auto h-10 w-auto" />
                    <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900 dark:text-white">
                        Zaloguj się do MemoryBox
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">

                    <form onSubmit={(e) => handleSubmit(e)} className="space-y-6">
                        <div>
                            <label htmlFor="username" className="block text-sm/6 font-medium text-gray-900 dark:text-gray-100">
                                Nazwa użytkownika
                            </label>
                            <div className="mt-2">
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    required
                                    autoComplete="username"
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-green-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-green-500"
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900 dark:text-gray-100">
                                Hasło
                            </label>
                            <div className="mt-2">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    autoComplete="current-password"
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-green-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-green-500"
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-green-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-green-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 dark:bg-green-500 dark:shadow-none dark:hover:bg-green-400 dark:focus-visible:outline-green-500"
                            >
                                Zaloguj się
                            </button>
                        </div>
                    </form>

                    <p className="mt-10 text-center text-sm/6 text-gray-500 dark:text-gray-400">
                        Nie masz konta?{' '}
                        <Link to="/register" className="font-semibold text-green-600 hover:text-green-500 dark:text-green-400 dark:hover:text-green-300">
                            Zarejestruj się teraz!
                        </Link>
                    </p>
                </div>
            </div>

            <AlertContainer alert={alert} onClose={closeAlert} />
        </>
    )
}
