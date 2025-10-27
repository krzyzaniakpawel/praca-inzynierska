import express from 'express'
import { createUser, getAllUsers, getUserAndItsDecks } from '../controllers/userController.js'
import { verifyToken } from '../middleware/auth.js'

const router = express.Router()

router.post('/', createUser)

router.get('/', verifyToken, getAllUsers)
router.get('/get-user-and-decks/:id', getUserAndItsDecks)

export default router