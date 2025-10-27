import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import validator from 'validator'

export default function Register() {
    const navigate = useNavigate()

    const [ username, setUsername ] = useState("")
    const [ email, setEmail ] = useState("")
    const [ password, setPassword ] = useState("")
    const [ confirmPassword, setConfirmPassword ] = useState("")

    const [ errorUsername, setErrorUsername ] = useState("")
    const [ errorEmail, setErrorEmail ] = useState("")
    const [ errorPassword, setErrorPassword ] = useState("")
    const [ errorConfirmPassword, setErrorConfirmPassword ] = useState("")

    const validateUsername = () => {
        if (username.length < 3) {
            setErrorUsername("Nazwa użytkownika musi mieć conajmniej 3 znaki.")
            return false
        } else if (username.length > 25) {
            setErrorUsername("Nazwa użytkownika może mieć maksymalnie 25 znaków.")
            return false
        } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            setErrorUsername("Nazwa użytkownika może składać się tylko z liter, cyfr i podkreślników.")
            return false
        }
        setErrorUsername("")
        return true
    }

    const validateEmail = () => {
        if (!validator.isEmail(email)) {
            setErrorEmail("Niepoprawny format email.")
            return false
        }
        setErrorEmail("")
        return true
    }

    const validatePassword = () => {
        if (password.length < 8) {
            setErrorPassword("Hasło musi mieć conajmniej 8 znaków.")
            return false
        } else if (password.length > 72) {
            setErrorPassword("Hasło może mieć maksymalnie 72 znaki.")
            return false
        }         
        setErrorPassword("")
        return true
    }

    const validateConfirmPassword = () => {
        if (password !== confirmPassword) {
            setErrorConfirmPassword("Podane hasła nie są identyczne.")
            return false
        }
        setErrorConfirmPassword("")
        return true
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const usernameValid = validateUsername()
        const emailValid = validateEmail()
        const passwordValid = validatePassword()
        const confirmPasswordValid = validateConfirmPassword()

        if (!usernameValid || !emailValid || !passwordValid || !confirmPasswordValid) {
            return
        }

        const url = '/api/users/'
        try {
            const res = await axios.post(url, { username, email, password })
            navigate("/login", { state: { header: "Sukces", message: "Rejestracja zakończona sukcesem. Możesz się teraz zalogować." } })
        } catch (error) {
            if (error.response && error.response.data) {
                setErrorUsername(error.response.data.errorUsername || "")
                setErrorEmail(error.response.data.errorEmail || "")
                setErrorPassword(error.response.data.errorPassword || "")
            } else {
                console.log(error)
            }
        }
    } 

    return (
        <>
            <div className="flex min-h-full my-10 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <img src="../../public/navbar.png" alt="Logo" width={40} className="mx-auto h-10 w-auto" />
                    <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900 dark:text-white">
                        Zarejestruj się do MemoryBox
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form className="space-y-6" onSubmit={(e) => handleSubmit(e)}>
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
                            <span className="text-red-600 block text-sm/6 font-medium">{errorUsername}</span>
                        </div>


                        <div>
                            <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900 dark:text-gray-100">
                                E-mail
                            </label>
                            <div className="mt-2">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    autoComplete="email"
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-green-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-green-500"
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <span className="text-red-600 block text-sm/6 font-medium">{errorEmail}</span>
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
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-green-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-green-500"
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <span className="text-red-600 block text-sm/6 font-medium">{errorPassword}</span>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900 dark:text-gray-100">
                                Potwierdź hasło
                            </label>
                            <div className="mt-2">
                                <input
                                    id="confirmpassword"
                                    name="confirmpassword"
                                    type="password"
                                    required
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-green-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-green-500"
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </div>
                            <span className="text-red-600 block text-sm/6 font-medium">{errorConfirmPassword}</span>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-green-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-green-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 dark:bg-green-500 dark:shadow-none dark:hover:bg-green-400 dark:focus-visible:outline-green-500"
                            >
                                Zarejestruj się
                            </button>
                        </div>
                    </form>


                    <p className="mt-10 text-center text-sm/6 text-gray-500 dark:text-gray-400">
                        Masz już konto?{' '}
                        <Link to="/login" className="font-semibold text-green-600 hover:text-green-500 dark:text-green-400 dark:hover:text-green-300">
                            Zaloguj się!
                        </Link>
                    </p>
                </div>
            </div>
        </>
    )
}
