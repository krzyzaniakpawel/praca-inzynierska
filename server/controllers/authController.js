import { User } from '../models/index.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

export const login = async (req, res) => {
    try {
        const {username, password} = req.body
        const user = await User.findOne({ attributes: [ 'user_id', 'username', 'password', 'is_admin' ], where: { username } })

        if (!user || user.username !== username || await bcrypt.compare(password, user.password) === false) {
            return res.status(401).json({ message: "Błędny login lub hasło." })
        }
    
        const userData = user.get({ plain: true })
        delete userData.password

        const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN })
        res.cookie("token", token, { httpOnly: false, maxAge: 3600000 })
        res.status(200).json({ message: "Zalogowano pomyślnie.", 'user': user})
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Wystąpił błąd serwera.' })
    }
}

export const logout = (req, res) => {
    res.clearCookie("token", { httpOnly: true })
    res.status(200).json({ message: "Wylogowano pomyślnie." })
}

export const checkAuth = (req, res) => {
    res.status(200).json({ message: "Użytkownik zalogowany.", user: req.user })
}