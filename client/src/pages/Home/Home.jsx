import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router"
import useAlert from "../../context/AlertContext"

import axios from "axios"
import papa from "papaparse"

import Input from "../../components/Input"
import MainContainer from "../../components/MainContainer"
import Button from "../../components/Button"
import Deck from "./Deck"
import Modal from "../../components/Modal"
import Textarea from "../../components/Textarea"
import Pagination from "../../components/Pagination"
import AlertContainer from "../../components/Alert"

function Home() {
    const navigate = useNavigate()
    const location = useLocation()

    const [deckTitle, setDeckTitle] = useState("")
    const [deckDescription, setDeckDescription] = useState("")
    const [deckTags, setDeckTags] = useState("")

    const [term, setTerm] = useState("")
    const [definition, setDefinition] = useState("")

    const [modal, setModal] = useState({ type: null, deck: null })
    const [refresh, setRefresh] = useState(false)

    const [decks, setDecks] = useState([])

    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    const { alert, showAlert, closeAlert } = useAlert({ header: location.state?.header || "", message: location.state?.message || "" })

    const getDecks = async () => {
        try {
            const res = await axios.get('/api/decks', { params: { page, limit: 6 } })
            setDecks(res.data.rows)
            setTotalPages(res.data.totalPages)
        } catch (err) {
            console.log(err)
            showAlert("Błąd", err.response.data.error, "error")
        }
    }

    useEffect(() => {
        getDecks()
    }, [refresh, page])

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const tags = deckTags.split(",")
            if (modal.type === "edit") {
                await axios.patch(`/api/decks/${modal.deck.deck_id}`, {
                    deckTitle,
                    deckDescription,
                    tags
                })
                showAlert("Sukces", "Poprawnie edytowano zestaw.")
            } else {
                await axios.post('/api/decks', { deckTitle, deckDescription, tags })
                showAlert("Sukces", "Dodano nowy zestaw.")
            }
            setRefresh(!refresh)
        } catch (err) {
            console.log(err)
            showAlert("Błąd", err.response.data.error, "error")
        } finally {
            setModal({ type: null, deck: null })
            setDeckTitle("")
            setDeckDescription("")
            setDeckTags("")
        }
    }

    const getTags = async (deckId) => {
        try {
            const res = await axios.get(`/api/decks/${deckId}/tags`)
            const str = res.data.map(tag => tag.name).join(", ")
            return str
        } catch (error) {
            console.error(error)
        }
    }

    const handleConfirmDelete = async () => {
        try {
            await axios.delete(`/api/decks/${modal.deck.deck_id}`)
            setRefresh(!refresh)
            showAlert("Sukces", "Usunięto zestaw fiszek.")
        } catch (err) {
            console.log(err)
            showAlert("Błąd", err.response.data.error, "error")
        } finally {
            setModal({ type: null, deck: null })
        }
    }

    const addFlashcard = async (e) => {
        e.preventDefault()
        try {
            await axios.post(`/api/decks/${modal.deck.deck_id}/flashcards`, { term, definition })
            setRefresh(!refresh)
            showAlert("Sukces", "Dodano nową fiszkę.")
        } catch (err) {
            console.log(err)
            showAlert("Błąd", err.response.data.error, "error")
        } finally {
            setModal({ type: null, deck: null })
        }
    }

    const togglePublishDeck = async () => {
        try {
            await axios.patch(`/api/decks/${modal.deck.deck_id}`, { isPublic: !modal.deck.is_public })
            if (!modal.deck.is_public)
                showAlert("Sukces", "Twój zestaw został upubliczniony.")
            else
                showAlert("Sukces", "Twój zestaw został ustawiony jako prywatny.")
        } catch (error) {
            console.error(error)
            showAlert("Błąd", err.response.data.error, "error")
        } finally {
            setModal({ type: null, deck: null })
        }
    }

    const exportDeck = async (deckId, title) => {
        try {
            const res = await axios.get(`/api/decks/${deckId}/flashcards`, {
                params: { fields: "term,definition" }
            })
            const csv = papa.unparse(res.data, {
                delimiter: ';',
                quotes: true,
            })
            const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            const now = new Date().toISOString().split("T")[0]
            a.href = url;
            a.download = `${title}-${now}.csv`;
            a.click();
            showAlert("Sukces", "Wyeksportowano zestaw fiszek.")
        } catch (error) {
            console.error(error)
            showAlert("Błąd", err.response.data.error, "error")
        }
    }

    return (
        <>
            <MainContainer>
                <div className="justify-center flex mb-10">
                    <Button onClick={() => setModal({ type: "create", deck: null })}>
                        Utwórz zestaw
                    </Button>
                </div>

                {/* Modal tworzenia/edycji zestawu */}
                <Modal
                    title={modal.type === "edit" ? "Edytuj zestaw" : "Stwórz zestaw"}
                    isOpen={modal.type === "create" || modal.type === "edit"}
                    onClose={() => { 
                        setModal({ type: null, deck: null });
                        setDeckTitle(""); 
                        setDeckDescription(""); 
                        setDeckTags("") 
                    }}
                >
                    <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
                        <Input
                            onChange={(e) => setDeckTitle(e.target.value)}
                            text="Tytuł"
                            type="text"
                            id="decktitle"
                            required={true}
                            value={deckTitle}
                        />
                        <Textarea
                            onChange={(e) => setDeckDescription(e.target.value)}
                            text="Opis (opcjonalnie)"
                            id="deckdescription"
                            value={deckDescription}
                        />
                        <div className="mt-5">
                            <Input
                                onChange={(e) => setDeckTags(e.target.value)}
                                text="Tagi (odzielone przecinkiem)"
                                type="text"
                                id="decktags"
                                value={deckTags}
                            />
                        </div>
                        <div className="flex justify-end mt-6">
                            <Button>{modal.type === "edit" ? "Zmień" : "Dodaj"}</Button>
                        </div>
                    </form>
                </Modal>

                {/* Modal usuwania zestawu */}
                <Modal
                    title="Usuń zestaw"
                    isOpen={modal.type === "delete"}
                    onClose={() => setModal({ type: null, deck: null })}
                >
                    <p className="mb-4">Czy na pewno chcesz usunąć zestaw? Tej akcji nie można cofnąć.</p>
                    <div className="flex justify-end space-x-2">
                        <Button color="gray" onClick={() => setModal({ type: null, deck: null })}>Anuluj</Button>
                        <Button color="red" onClick={handleConfirmDelete}>Usuń</Button>
                    </div>
                </Modal>

                {/* Modal dodawania nowej fiszki */}
                <Modal
                    title="Dodaj fiszkę"
                    isOpen={modal.type === "addFlashcard"}
                    onClose={() => setModal({ type: null, deck: null })}
                >
                    <div className="space-x-4">
                        <Textarea value={term} onChange={(e) => setTerm(e.target.value)}text="Termin" type="text" id="term" required={true} />
                        <Textarea value={definition} onChange={(e) => setDefinition(e.target.value)} text="Definicja" id="definition" required={true} />
                        <div className="flex justify-end mt-6">
                            <Button onClick={addFlashcard}>Dodaj</Button>
                        </div>
                    </div>
                </Modal>

                {/* Modal upubliczniania zestawu */}
                <Modal 
                    title={modal.deck?.is_public ? "Ustaw jako prywatny" : "Upublicznij zestaw"}
                    isOpen={modal.type === "publish"}
                    onClose={() => setModal({ type: null, deck: null })}
                >
                    {modal.deck?.is_public ? (
                        <p className="mb-4">Czy na pewno chcesz ustawić ten zestaw jako prywatny?</p>
                    ) : (
                        <p className="mb-4">Czy na pewno chcesz upublicznić ten zestaw fiszek?</p>
                    )}
                    <div className="flex justify-end space-x-2">
                        <Button color="gray" onClick={() => setModal({ type: null, deck: null })}>Anuluj</Button>
                        <Button color="green" onClick={togglePublishDeck}>{modal.deck?.is_public ? "Ukryj" : "Upublicznij"}</Button>
                    </div>
                </Modal>

                {/* Lista zestawów */}
                {decks.length !== 0 ? (
                    <>
                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8 space-y-6">
                            {decks.map((deck) => (
                                <Deck
                                    className="h-full flex flex-col justify-between"
                                    onEdit={async () => {
                                        setDeckTitle(deck.title)
                                        setDeckDescription(deck.description)
                                        setDeckTags(await getTags(deck.deck_id))
                                        setModal({ type: "edit", deck })
                                    }}
                                    onDelete={() => setModal({ type: "delete", deck })}
                                    onPublish={() => setModal({ type: "publish", deck })}
                                    onAddFlashcard={() => setModal({ type: "addFlashcard", deck })}
                                    onViewFlashcards={() => { navigate(`/deck/${deck.deck_id}`) }}
                                    onExport={() => exportDeck(deck.deck_id, deck.title)}
                                    id={deck.deck_id}
                                    key={deck.deck_id}
                                    title={deck.title}
                                    description={deck.description}
                                    isPublic={deck.is_public}

                                    newCount={deck.stats.new}
                                    learningCount={deck.stats.learning}
                                    reviewCount={deck.stats.review}
                                />
                            ))}
                        </div>

                        <Pagination currentPage={page} totalPages={totalPages} onChangePage={setPage}/>
                    </>
                ) : (
                    <div className="justify-center flex m-16">
                        <p className="text-xl text-center text-gray-500 dark:text-gray-400">
                            Nie masz jeszcze żadnych zestawów. Stwórz swój pierwszy zestaw, klikając przycisk "Utwórz zestaw" powyżej.
                        </p>
                    </div>
                )}
            </MainContainer>

            <AlertContainer alert={alert} onClose={closeAlert} />
        </>
    )
}

export default Home
