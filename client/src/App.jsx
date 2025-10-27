import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import axios from 'axios'

import Register from './pages/Register'
import Login from './pages/Login'
import Home from './pages/Home/Home'
import Navbar from './components/Navbar'
import FlashcardsList from './pages/FlashcardsList/FlashcardsList'
import Learn from './pages/Learn/Learn'
import SearchDecks from './pages/SearchDecks/SearchDecks'

import AdminSidebar from './pages/Admin/AdminSidebar'
import AdminUserTable from './pages/Admin/AdminUserTable'

function ProtectedRoute({ children, allowedRole }) {
    const [role, setRole] = useState(null)

    const checkAuth = async () => {
        try {
            const res = await axios.get("/api/auth/me")
            console.log(res.data)
            if (res.data.user.is_admin) {
                setRole("admin")
            } else {
                setRole("user")
            }
        } catch (error) {
            console.log(error)
            setRole(false)
        }
    }

    useEffect(() => {
        checkAuth()
    }, [])

    if (role === null) {
        return null
    } 
    if (role === "admin") {
        if (allowedRole === "admin") {
            return children
        } else {
            return <Navigate to="/admin" />
        }
    }
    if (role === "user") {
        if (allowedRole === "user") {
            return children
        } else {
            return <Navigate to="/" />
        }
    }
    return <Navigate to="/login" />
}

function NavbarWrapper() {
    return (
        <>
            <Navbar />
            <Outlet />
        </>
    )
}

function AdminLayout() {
    return (
        <div className="flex">
            <AdminSidebar /> 
            <div className="h-screen flex-grow overflow-auto p-4">
                <Outlet /> 
            </div>
        </div>
    )
}

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(null)

    const checkAuth = async () => {
        try {
            await axios.get("/api/auth/me")
            setIsAuthenticated(true)
        } catch (error) {
            setIsAuthenticated(false)
        }
    }

    useEffect(() => {
        checkAuth()
    }, [])

    if (isAuthenticated === null) {
        return null // or a loading spinner
    }

    return (
        <BrowserRouter>
            <Routes>
                {/* publiczne */}
                <Route path='/register' element={<Register />} />
                <Route path='/login' element={<Login />} />

                {/* użytkownik */}
                <Route element={<ProtectedRoute allowedRole="user"><NavbarWrapper /></ProtectedRoute>}>
                    <Route path='/' element={<Home /> } />
                    <Route path='/search-decks' element={<SearchDecks />} />
                    <Route path='/deck/:deckId' element={<FlashcardsList />} />
                    <Route path='/learn' element={<Learn />} />
                    <Route path='/learn/:deckId' element={<Learn />} />
                </Route>

                {/* administrator */}
                <Route element={<ProtectedRoute allowedRole="admin"><AdminLayout /></ProtectedRoute>}>
                    <Route path='/admin' element={<AdminUserTable />} />
                    <Route path='/admin/users' element={<AdminUserTable />} />
                </Route>

                {/* fallback */}
                <Route path='*' element={isAuthenticated ? <Navigate to="/" /> : <Navigate to="/login" />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
