import { useNavigate, useParams } from "react-router-dom"
import { useState, useEffect } from "react"

import axios from "axios"

import MainContainer from "../../components/MainContainer"
import Flashcard from "./Flashcard"
import Button from "../../components/Button"

const LearningStates = {
    SHOW_QUESTION: "SHOW_QUESTION",
    SHOW_ANSWER: "SHOW_ANSWER",
    DONE: "DONE",
    NO_CARDS: "NO_CARDS",
    PREPARE: "PREPARE"
}

const LearningMode = {
    NORMAL: "NORMAL",
    REVERSED: "REVERSED",
    BOTH: "BOTH"
}

function Learn() {
    const params = useParams()

    const [queue, setQueue] = useState([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [hidden, setHidden] = useState(true)
    const [done, setDone] = useState(false)
    const [noCards, setNoCards] = useState(false)

    const [learningState, setLearningState] = useState(LearningStates.PREPARE)

    let currentFlashcard = queue[currentIndex]

    const navigate = useNavigate()

    const fetchFlashcards = async (learningMode) => {
        try {
            const res = await axios.get(`/api/decks/${params.deckId}/reviews`)
            if (res.data.length === 0) {
                setLearningState(LearningStates.NO_CARDS)
                return false
            } else {
                if (learningMode === LearningMode.NORMAL) {
                    setQueue(res.data)
                } else if (learningMode === LearningMode.REVERSED) {
                    const reversed = res.data.map(card => ({
                        ...card,
                        term: card.definition,
                        definition: card.term
                    }))
                    setQueue(reversed)
                } else if (learningMode === LearningMode.BOTH) {
                    const both = [...res.data]
                    res.data.forEach(card => {
                        both.push({
                            ...card,
                            term: card.definition,
                            definition: card.term
                        })
                    })
                    setQueue(both)
                } 

                return true
            }
        } catch (err) {
            console.error(err)
        }
    }

    const next = () => {
        if (currentIndex >= queue.length - 1)
            return false

        setCurrentIndex(currentIndex + 1)

        currentFlashcard = queue[currentIndex]
        return true
    }

    const submitAnswer = async (quality) => {
        try {
            await axios.patch(`/api/flashcards/${currentFlashcard.flashcard_id}/reviews`, { quality })

            if (next()) {
                setLearningState(LearningStates.SHOW_QUESTION)
            } else if (fetchFlashcards()){         // po zakończeniu pierwszej sesji, pobierz jeszcze raz
                setLearningState(LearningStates.SHOW_QUESTION)
                setCurrentIndex(0)
            } else {                                // jeśli kolejnych fiszek nie ma, zmień stan na 'done'
                setLearningState(LearningStates.DONE)
            }
        } catch (err) {
            console.error(err)
        }
    }

    const prepareSession = async (mode) => {
        await fetchFlashcards(mode)
        setLearningState(LearningStates.SHOW_QUESTION)
    }

    const PrepareView = () => {
        return (
            <div className="flex flex-col justify-center items-center h-2/3 gap-16">
                <div className="flex flex-col justify-center items-center gap-4">
                    <p>Termin &#8594; definicja</p>
                    <Button onClick={() => prepareSession(LearningMode.NORMAL)}>Normalny</Button>
                </div>
                <div className="flex flex-col justify-center items-center gap-4">
                    <p>Definicja &#8594; Termin</p>
                    <Button onClick={() => prepareSession(LearningMode.REVERSED)}>Odwrócony</Button>
                </div>
                <div className="flex flex-col justify-center items-center gap-4">
                    <p>Oba kierunki w jednej sesji</p>
                    <Button onClick={() => prepareSession(LearningMode.BOTH)}>Oba</Button>
                </div>
            </div>
        )
    }

    const LearnView = () => {
        return (
            <>
                <Flashcard>{currentFlashcard?.term ?? ""}</Flashcard>
                <Flashcard>{learningState === LearningStates.SHOW_ANSWER && (currentFlashcard?.definition ?? "")}</Flashcard>
                {learningState === LearningStates.SHOW_QUESTION ? (
                    <div className="flex gap-4 justify-center">
                        <Button color="blue" onClick={() => setLearningState(LearningStates.SHOW_ANSWER)}>Pokaż odpowiedź</Button>
                    </div>
                ) : (
                    <div className="flex gap-4 justify-center">
                        <Button onClick={() => submitAnswer(0)} color="gray">Nie umiem</Button>
                        <Button onClick={() => submitAnswer(3)} color="red">Trudne</Button>
                        <Button onClick={() => submitAnswer(4)} color="yellow">Średnie</Button>
                        <Button onClick={() => submitAnswer(5)} color="green">Łatwe</Button>
                    </div>
                )}
            </>
        )
    }

    let content

    if (learningState === LearningStates.PREPARE)
        content = <PrepareView />
    else if (learningState === LearningStates.DONE)
        content = <p>Koniec nauki na dzisiaj</p>
    else if (learningState === LearningStates.NO_CARDS)
        content = <p>Nie ma żadnych fiszek na teraz! Przyjdź jutro!</p>
    else
        content = <LearnView />

    return (
        <MainContainer className="flex-col flex flex-1 gap-8 w-full min-h-0 lg:my-8 h-[90dvh] md:h-[85dvh]">
            <div className="flex gap-4">
                <Button onClick={() => navigate(-1)}>Wróć</Button>
            </div>

            {content}
        </MainContainer>
    )
}

export default Learn