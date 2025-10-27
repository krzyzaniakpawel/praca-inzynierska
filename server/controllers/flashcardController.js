import { Flashcard } from '../models/index.js'
import multer from "multer"
import Papa from "papaparse"

export const createFlashcard = async (req, res) => {
    try {
        const { term, definition } = req.body
        const deckId = req.params.deckId

        if (!term || term.length < 1) {
            return res.status(400).json({ error: 'Niepoprawna nazwa terminu.' })
        }
        if (!definition || definition.length < 1) {
            return res.status(400).json({ error: 'Niepoprawna nazwa definicji.' })
        }

        const newFlashcard = await Flashcard.create({
            deck_id: deckId,
            term,
            definition,
        });

        res.status(201).json(newFlashcard)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Wystąpił błąd serwera.' })
    }
}

export const deleteFlashcard = async (req, res) => {
    try {
        const flashcardId = req.params.id

        const flashcard = await Flashcard.findByPk(flashcardId)
        if (!flashcard) {
            return res.status(404).json({ error: 'Fiszka nie została znaleziona.' })
        }

        await flashcard.destroy()
        res.status(200).json({ message: 'Fiszka została usunięta.' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Wystąpił błąd serwera.' })
    }
}

export const updateFlashcard = async (req, res) => {
    try {
        const flashcardId = req.params.id
        const { term, definition } = req.body

        if (!term || term.length < 1) {
            return res.status(400).json({ error: 'Niepoprawna nazwa terminu.' })
        }
        if (!definition || definition.length < 1) {
            return res.status(400).json({ error: 'Niepoprawna nazwa definicji.' })
        }

        const flashcard = await Flashcard.findByPk(flashcardId)
        if (!flashcard) {
            return res.status(404).json({ error: 'Fiszka nie została znaleziona.' })
        }
        
        flashcard.term = term
        flashcard.definition = definition

        await flashcard.save()
        res.status(200).json(flashcard)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Wystąpił błąd serwera.' })
    }
}

export const getFlashcardsByDeck = async (req, res) => {
    try {
        const deckId = req.params.deckId

        let options = { where: { deck_id: deckId } };

        if (req.query.fields) {
            const fields = req.query.fields.split(",").map(f => f.trim());
            options.attributes = fields;
        }

        const flashcards = await Flashcard.findAll(options)
        res.status(200).json(flashcards)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Wystąpił błąd serwera.' })
    }
}

export const getFlashcardById = async (req, res) => {
    try {
        const flashcardId = req.params.id

        const flashcard = await Flashcard.findOne({ where: { flashcard_id: flashcardId } })
        if (!flashcard) {
            return res.status(404).json({ error: 'Fiszka nie została znaleziona.' })
        }

        res.status(200).json(flashcard)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Wystąpił błąd serwera.' })
    }
}

const upload = multer({ storage: multer.memoryStorage() })

export const importFlashcards = [
    upload.single("file"),
    async (req, res) => {
        try {
            const deckId = req.params.deckId

            if (!req.file) {
                return res.status(400).json({ error: "Brak pliku CSV." })
            }

            const csv = req.file.buffer.toString("utf8")
            const result = Papa.parse(csv, {
                header: true,
                delimiter: ";",   // dopasuj do swojego eksportu
                skipEmptyLines: true
            })

            const validRows = result.data.filter(
                r => r.term && r.term.trim() && r.definition && r.definition.trim()
            )

            if (!validRows.length) {
                return res.status(400).json({ error: "Brak poprawnych fiszek w pliku." })
            }

            const created = await Flashcard.bulkCreate(
                validRows.map(r => ({
                    deck_id: deckId,
                    term: r.term.trim(),
                    definition: r.definition.trim()
                }))
            )

            res.status(201).json({
                message: `Zaimportowano ${created.length} fiszek.`
            })
        } catch (err) {
            console.error(err)
            res.status(500).json({ error: "Błąd serwera podczas importu." })
        }
    }
]