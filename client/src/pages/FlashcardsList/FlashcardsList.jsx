import { useParams, useNavigate } from "react-router"
import { useEffect, useState } from "react"
import useAlert from "../../context/AlertContext"
import AlertContainer from "../../components/Alert"

import axios from "axios"

import MainContainer from "../../components/MainContainer"
import Ul from "../../components/Ul"
import Button from "../../components/Button"
import FlashcardListElement from "./FlashcardListElement"
import Modal from "../../components/Modal"
import Textarea from "../../components/Textarea"

function FlashcardsList() {
    const params = useParams()
    const navigate = useNavigate()

    const [ loading , setLoading ] = useState(true)
    const [ flashcards, setFlashcards ] = useState([])

    const [title, setTitle] = useState("")    
    const [description, setDescription] = useState("")

    const [addFlashcardModal, setAddFlashcardModal] = useState(false)
    const [term, setTerm] = useState("")
    const [definition, setDefinition] = useState("")

    const [modal, setModal] = useState(null)

    const { alert, showAlert, closeAlert } = useAlert({})

    const [refresh, setRefresh] = useState(false)

    const getFlashcards = async () => {
        try {
            const res = await axios.get(`/api/decks/${params.deckId}/flashcards`)
            setFlashcards(res.data)
        } catch (err) {
            console.log(err)
        }
    }

    const addFlashcard = async (e) => {
        e.preventDefault()
        try {
            await axios.post(`/api/decks/${params.deckId}/flashcards`, { term, definition })
            setRefresh(!refresh)
            showAlert("Sukces", "Dodano nową fiszkę.")
        } catch (err) {
            console.log(err)
            showAlert("Błąd", err.response.data.error, "error")
        } finally {
            setTerm("")
            setDefinition("")
        }
    }

    const getDeckInfo = async () => {
        try {
            const res = await axios.get(`/api/decks/${params.deckId}`)
            setTitle(res.data.title)
            setDescription(res.data.description)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        getFlashcards()
        getDeckInfo()
    }, [refresh])

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/api/flashcards/${id}`)
            setRefresh(!refresh)
            showAlert("Sukces", "Usunięto fiszkę.")
        } catch (err) {
            console.log(err)
            showAlert("Błąd", err.response.data.error, "error")
        } finally {
            setModal(null)
        }
    }

    const handleEdit = async (id, term, definition) => {
        try {
            await axios.patch(`/api/flashcards/${id}`, {"term": term, "definition": definition})
            // getFlashcards()
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <>
            <MainContainer>
                <div className="flex gap-4">
                    <Button onClick={() => navigate(-1)}>Wróć</Button>
                    <Button onClick={() => setAddFlashcardModal(true)}>Dodaj fiszki</Button>
                </div>

                {/* Wyświetl tytuł i opis */}
                <div className="my-4 space-y-4">
                    <p className="text-xl">{title}</p>
                    {description && <p>{description}</p>}
                </div>

                {/* Wyświetlanie fiszek w danym zestawie */}
                <div className="my-4 space-y-4">
                    {flashcards.length !== 0 ? (
                        flashcards.map((card, index) => (
                            <FlashcardListElement
                                key={card.flashcard_id}
                                number={index + 1}
                                id={card.flashcard_id}
                                term={card.term}
                                definition={card.definition}
                                onDelete={() => setModal(card.flashcard_id)}
                                onEdit={handleEdit}
                            />
                        ))
                    ) : <p>Brak fiszek w tym zestawie.</p>
                    }
                </div>

                {/* Modal dodawania nowej fiszki */}
                <Modal
                    title="Dodaj fiszki"
                    isOpen={addFlashcardModal}
                    onClose={() => setAddFlashcardModal(false)}
                >
                    <div className="space-x-4">
                        <Textarea value={term} onChange={(e) => setTerm(e.target.value)} text="Termin" type="text" id="term" required={true} />
                        <Textarea value={definition} onChange={(e) => setDefinition(e.target.value)} text="Definicja" id="definition" required={true} />
                        <div className="flex justify-end mt-6">
                            <Button onClick={(e) => addFlashcard(e)}>Dodaj</Button>
                        </div>
                    </div>
                </Modal>

                {/* Modal usuwania zestawu */}
                <Modal
                    title="Usuń zestaw"
                    isOpen={modal}
                    onClose={() => setModal(null)}
                >
                    <p className="mb-4">Czy na pewno chcesz usunąć tę fiszkę? Tej akcji nie można cofnąć.</p>
                    <div className="flex justify-end space-x-2">
                        <Button color="gray" onClick={() => setModal(null)}>Anuluj</Button>
                        <Button color="red" onClick={() => handleDelete(modal)}>Usuń</Button>
                    </div>
                </Modal>
            </MainContainer>

            <AlertContainer alert={alert} onClose={closeAlert} />
        </>
    )
}

export default FlashcardsList