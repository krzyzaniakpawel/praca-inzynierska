import { Review, Deck, Flashcard } from '../models/index.js'

import { Op } from "sequelize"
const { or, lte } = Op

export const getReviewsByDeckId = async (req, res) => {
    try {
        const { deckId } = req.params

        const today = new Date().toISOString().split("T")[0]

        const flashcards = await Flashcard.findAll({
            where: { deck_id: deckId },
            include: [
                {
                    model: Review,
                    as: "review",
                    where: {
                        [or]: [
                            { next_review: { [lte]: today } },
                            { next_review: null },
                        ],
                    },
                },
            ],
            order: [
                [{ model: Review, as: "review" }, "status", "ASC"],      
                [{ model: Review, as: "review" }, "next_review", "ASC"], 
            ],
        })

        res.json(flashcards)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: err.message })
    }
}

const ReviewStatus = {
    NEW: "new",
    LEARNING: "learning",
    REVIEW: "review",
}

export const sm2 = async (req, res) => {
    try {
        const flashcardId = req.params.id
        const { quality } = req.body

        const flashcard = await Flashcard.findByPk(flashcardId, {
            include: [{ model: Review, as: "review" }],
        })
        if (!flashcard) {
            return res.status(404).json({ error: "Nie znaleziono fiszki." })
        }

        const review = flashcard.review
        if (!review) {
            return res.status(404).json({ error: "Nie znaleziono informacji o powtórce" })
        }

        // ----- start algorytmu SM-2 -----
        if (typeof quality !== "number" || quality < 0 || quality > 5) {
            return res.status(400).json({ error: "Ocena musi być liczbą między 0 a 5." });
        }

        const nextReviewDate = new Date()
        review.last_review = review.next_review

        if (review.status === ReviewStatus.NEW) {
            if (quality === 5) {
                review.status = ReviewStatus.REVIEW
                nextReviewDate.setDate(nextReviewDate.getDate() + 1)
            } else if (quality >= 3) {
                review.status = ReviewStatus.LEARNING
                nextReviewDate.setDate(nextReviewDate.getDate())
            }
            review.next_review = nextReviewDate.toISOString().split("T")[0]
        } else if (review.status === ReviewStatus.LEARNING) {
            if (quality >= 4) {
                review.status = ReviewStatus.REVIEW
                nextReviewDate.setDate(nextReviewDate.getDate() + 1)
            } else {
                nextReviewDate.setDate(nextReviewDate.getDate())
            }
            review.next_review = nextReviewDate.toISOString().split("T")[0]
        } else if (review.status === ReviewStatus.REVIEW) {
            if (quality < 3) {
                review.repetition = 0
                review.interval_days = 1
                review.status = ReviewStatus.LEARNING
                nextReviewDate.setDate(nextReviewDate.getDate())
            } else {
                review.repetition += 1

                if (review.repetition === 1) {
                    review.interval_days = 1
                } else if (review.repetition === 2) {
                    review.interval_days = 6
                } else {
                    review.interval_days = Math.round(review.interval_days * review.efactor)
                }

                const ef = Math.max(1.3, review.efactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)))
                review.efactor = ef

                nextReviewDate.setDate(nextReviewDate.getDate() + review.interval_days)
                review.next_review = nextReviewDate.toISOString().split("T")[0]
            }
        }

        await review.save()
        res.json(review)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: err.message })
    }
}