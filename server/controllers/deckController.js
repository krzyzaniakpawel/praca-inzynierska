import { sequelize } from '../config/database.js'
import { User, Deck, Tag, Flashcard, Review } from '../models/index.js'
import { Op, col, fn, literal } from 'sequelize'

export const createDeck = async (req, res) => {
    try {
        const { deckTitle, deckDescription, tags } = req.body
        const user_id = req.user.user_id

        if (!deckTitle || deckTitle.length < 1 || deckTitle.length > 255) {
            return res.status(400).json({ error: 'Niepoprawny tytuł.' })
        }

        const newDeck = await Deck.create({
            user_id,
            title: deckTitle,
            description: deckDescription || null,
        });

        const newTags = tags.map(tag => ({
            "deck_id": newDeck.deck_id,
            "name": tag.trim()
        }))
        await Tag.bulkCreate(newTags)

        res.status(201).json(newDeck)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Wystąpił błąd serwera.' })
    }
}

export const deleteDeck = async (req, res) => {
    try {
        const deckId = req.params.id
        const user_id = req.user.user_id

        const deck = await Deck.findOne({ where: { deck_id: deckId, user_id } })
        console.log('siema', deck)
        if (!deck) {
            return res.status(404).json({ error: 'Zestaw nie został znaleziony.' })
        }

        await deck.destroy()
        res.status(200).json({ message: 'Zestaw został usunięty.' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Wystąpił błąd serwera.' })
    }
}

export const updateDeck = async (req, res) => {
    try {
        const deckId = req.params.id
        const userId = req.user.user_id
        const { deckTitle, deckDescription, tags, isPublic } = req.body

        const deck = await Deck.findOne({ where: { deck_id: deckId, user_id: userId } })
        if (!deck) {
            return res.status(404).json({ error: 'Zestaw nie został znaleziony.' })
        }
        
        if (deckTitle !== undefined) {
            if (deckTitle.length < 1 || deckTitle.length > 255) {
                return res.status(400).json({ error: 'Niepoprawny tytuł.' })
            }
            deck.title = deckTitle
        }
        if (deckDescription !== undefined)
            deck.description = deckDescription
        if (tags !== undefined) {
            await Tag.destroy({ where: { deck_id: deckId }})
            const newTags = tags.map(tag => ({
                "deck_id": deckId,
                "name": tag.trim()
            }))
            await Tag.bulkCreate(newTags)
        }
        if (isPublic !== undefined)
            deck.is_public = isPublic

        await deck.save()

        res.status(200).json(deck)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Wystąpił błąd serwera.' })
    }
}

export const getAllDecks = async (req, res) => {
    try {
        const userId = req.user.user_id

        const decks = await Deck.findAll({
            where: { user_id: userId },
        })
        const deckIds = decks.map((d) => d.deck_id)

        // jeśli brak, zwróć pustą listę
        if (deckIds.length === 0) {
            return res.status(200).json({
                totalPages: 0,
                rows: [],
            })
        }

        // pobierz statystyki fiszek, tj. new, learning, review
        const stats = await Review.findAll({
            attributes: [
                [col("flashcard.deck_id"), "deck_id"],
                "status",
                [fn("COUNT", col("review.status")), "count"],
            ],
            include: [
                {
                    model: Flashcard,
                    as: "flashcard",
                    attributes: [],
                    where: { deck_id: deckIds },
                },
            ],
            where: {
                [Op.or]: [
                    { next_review: { [Op.lte]: fn("CURRENT_DATE") } },
                    { next_review: null },
                ],
            },
            group: ["flashcard.deck_id", "review.status"],
            raw: true,
        })

        // Przekształcenie statystyk do mapy
        const statsMap = {};
        for (const s of stats) {
            const id = s.deck_id;
            if (!statsMap[id]) {
                statsMap[id] = { new: 0, learning: 0, review: 0 };
            }
            statsMap[id][s.status] = parseInt(s.count);
        }

        // Dodanie statystyk do zestawów i obliczenie sumy fiszek do powtórzenia
        const decksWithStats = decks.map((deck) => {
            const stats = statsMap[deck.deck_id] || { new: 0, learning: 0, review: 0 };
            const totalToReview = stats.new + stats.learning + stats.review;
            return {
                ...deck.toJSON(),
                stats,
                totalToReview,
            };
        });

        // Sortowanie zestawów po liczbie fiszek do powtórzenia
        decksWithStats.sort((a, b) => b.totalToReview - a.totalToReview);

        // Zastosowanie stronicowania na posortowanych danych
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const offset = (page - 1) * limit;
        const paginatedDecks = decksWithStats.slice(offset, offset + limit);

        res.status(200).json({
            totalPages: Math.ceil(decksWithStats.length / limit),
            rows: paginatedDecks,
            // decks: decks,
            // stats: stats,
            // decksWithStats: decksWithStats,
            // statsMap: statsMap,
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Wystąpił błąd serwera." });
    }
}

export const getPublicDecks = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const { title, tags } = req.query;

        const tagsArray = Array.isArray(tags) ? tags : tags ? [tags] : [];

        // warunki wyszukiwania
        const titleCondition = title ? { title: { [Op.like]: `%${title}%` } } : {};
        const tagCondition = tagsArray.length > 0 ? { name: { [Op.in]: tagsArray } } : null;

        const decks = await Deck.findAll({
            where: {
                is_public: true,
                ...titleCondition,
            },
            include: [
                {
                    model: User,
                    attributes: ["username"],
                },
                {
                    model: Tag,
                    as: "tag",
                    ...(tagCondition && { where: tagCondition }),
                },
            ],
            attributes: {
                include: [
                    [
                        sequelize.literal(`
                            EXISTS (
                                SELECT 1 FROM decks AS ud
                                WHERE ud.source_id = deck.deck_id
                                AND ud.user_id = ${userId}
                            )
                        `),
                        "is_saved",
                    ],
                    [
                        sequelize.literal(`deck.user_id = ${userId}`),
                        "is_author",
                    ],
                ],
            },
            group: ["deck.deck_id", "user.username", "tag.tag_id"],
            having: tagCondition ? sequelize.literal(`COUNT(tag.name) >= ${tagsArray.length}`) : undefined,
        });

        // stronicowanie
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const offset = (page - 1) * limit;
        const paginatedDecks = decks.slice(offset, offset + limit);
        const totalPages = Math.ceil(decks.length / limit) < 1 ? 1 : Math.ceil(decks.length / limit)

        res.status(200).json({
            totalPages: totalPages,
            rows: paginatedDecks,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Wystąpił błąd serwera." })
    }
}

export const copyPublicDeck = async (req, res) => {
    try {
        const userId = req.user.user_id
        const deckId = req.params.id

        const publicDeck = await Deck.findOne({ where: { "deck_id": deckId, "is_public": true } })
        if (!publicDeck) {
            return res.status(404).json({ message: 'Nie znaleziono szukanego publicznego zestawu.' })
        }

        const newDeck = await Deck.create({
            user_id: userId,
            title: publicDeck.title,
            description: publicDeck.description,
            source_id: publicDeck.deck_id
        })

        const flashcards = await Flashcard.findAll({ where: { "deck_id": deckId }})
        const newFlashcards = flashcards.map(f => ({
            deck_id: newDeck.deck_id,
            term: f.term,
            definition: f.definition
        }))
        await Flashcard.bulkCreate(newFlashcards)

        res.status(201).json({ "newDeck": newDeck, message: "Skopiowano publiczny zestaw fiszek." })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Wystąpił błąd serwera.' })
    }
}

export const getTags = async (req, res) => {
    try {
        // const userId = req.body.user_id
        const deckId = req.params.id

        const tags = await Tag.findAll({ where: { deck_id: deckId } })
        // if (!tags || tags.length === 0) {
        //     return res.status(404).json({ error: 'Nie znaleziono tagów.' })
        // }

        res.status(200).json(tags)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Wystąpił błąd serwera.' })
    }
}

export const getDeckById = async (req, res) => {
    try {
        const deckId = req.params.id;
        const deck = await Deck.findByPk(deckId)
        res.status(200).json(deck)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Wystąpił błąd serwera.' })
    }
}