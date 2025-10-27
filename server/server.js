import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { connectDB } from './config/database.js'

import userRoutes from './routes/userRoutes.js'
import authRoutes from './routes/authRoutes.js'
import deckRoutes from './routes/deckRoutes.js'
import flashcardRoutes from './routes/flashcardRoutes.js'

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors({ origin: [ "http://localhost:5173" ] }))
app.use(express.json())
app.use(cookieParser())

app.use('/api/users', userRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/decks', deckRoutes)
app.use('/api/flashcards', flashcardRoutes)

connectDB()

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))