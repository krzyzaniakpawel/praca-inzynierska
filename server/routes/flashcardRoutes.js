import express from "express"
import { deleteFlashcard, updateFlashcard } from "../controllers/flashcardController.js"
import { sm2 } from "../controllers/reviewController.js"

const router = express.Router()

router.delete('/:id', deleteFlashcard)
router.patch('/:id', updateFlashcard)

router.patch('/:id/reviews', sm2)

export default router