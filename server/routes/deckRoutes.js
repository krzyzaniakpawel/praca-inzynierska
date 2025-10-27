import express from 'express'
import { copyPublicDeck, createDeck, deleteDeck, getAllDecks, getPublicDecks, updateDeck, getTags, getDeckById } from '../controllers/deckController.js'
import { createFlashcard, getFlashcardsByDeck, importFlashcards } from '../controllers/flashcardController.js'
import { getReviewsByDeckId } from '../controllers/reviewController.js'
import { verifyToken } from '../middleware/auth.js'
import { Flashcard } from '../models/flashcard.js'

const router = express.Router()

router.use(verifyToken)

router.get('/public', getPublicDecks)

// decks
router.post('/', createDeck)
router.delete('/:id', deleteDeck)
router.patch('/:id', updateDeck)
router.get('/', getAllDecks) 
router.get('/:id', getDeckById) 
router.get('/:id/tags', getTags) 

// public decks
router.post('/:id/copy', copyPublicDeck)

// flashcards
router.post('/:deckId/flashcards', createFlashcard)
router.get('/:deckId/flashcards', getFlashcardsByDeck)
router.post('/:deckId/flashcards/import', importFlashcards)

// reviews
router.get('/:deckId/reviews', getReviewsByDeckId)

export default router