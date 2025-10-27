import { useState, useEffect } from 'react'
import useAlert from '../../context/AlertContext'

import axios from 'axios'
import qs from 'qs'

import MainContainer from '../../components/MainContainer'
import Input from '../../components/Input'
import Button from '../../components/Button'
import Deck from './Deck'
import AlertContainer from '../../components/Alert'
import Pagination from '../../components/Pagination'

export default function SearchDecks() {
    const [decks, setDecks] = useState([])

    const [title, setTitle] = useState("")
    const [tags, setTags] = useState("")

    const [userId, setUserId] = useState(0)

    const [refresh, setRefresh] = useState(false)

    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    const { alert, showAlert, closeAlert } = useAlert({})

    const handleClick = async (deckId) => {
        try {
            const res = await axios.post(`/api/decks/${deckId}/copy`)
            setRefresh(!refresh)
            showAlert("Sukces", "Dodano do Twojej listy zestawów.")
        } catch (error) {
            console.log(error)
            showAlert("Błąd", error.response.data.message)
        }
    }

    const handleSearch = async (e=null) => {
        if (e) {
            e.preventDefault()
            setPage(1)
        }

        try {
            const params = {}
            params.title = title || undefined
            params.tags = tags ? tags.split(", ") : undefined

            params.page = page
            params.limit = 2

            const res = await axios.get('/api/decks/public', {
                params,
                paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' })
            })

            setDecks(res.data.rows)
            setTotalPages(res.data.totalPages)
        } catch (error) {
            console.log(error)
            setDecks([])
            setTotalPages(1)
        }
    }

    const fetchDecks = async () => {
        try {
            const res = await axios.get('/api/decks/public', { params: { page, limit: 2 } })
            setDecks(res.data.rows)
            setTotalPages(res.data.totalPages)
        } catch (error) {
            console.error(error)
        }
    }

    const getUserId = async () => {
        try {
            const res = await axios.get("/api/auth/me")
            setUserId(res.data.user.user_id)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        getUserId()
            .then(() => handleSearch())
    }, [refresh, page])

    return (
        <>
            <MainContainer className="w-auto">
                {/* Wyszukiwanie */}
                <form onSubmit={handleSearch} className="overflow-x-auto p-2">
                    <div className="flex gap-2 flex-nowrap lg:flex-wrap w-full">

                        {/* Tytuł */}
                        <div className="flex-1 min-w-[16rem]">
                            <Input
                                id="search-title"
                                text="Tytuł"
                                floating={true}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full"
                            />
                        </div>

                        {/* Tagi */}
                        <div className="flex-1 min-w-[12rem]">
                            <Input
                                id="search-tags"
                                text="Tagi"
                                floating={true}
                                onChange={(e) => setTags(e.target.value)}
                                className="w-full"
                            />
                        </div>

                        {/* Przycisk szukaj */}
                        <div className="flex-shrink-0 flex items-end">
                            <Button>Szukaj</Button>
                        </div>
                    </div>
                </form>

                {/* Wyświetlanie */}
                <div className='mt-8 space-y-4'>
                    {decks.length > 0 ? decks.map((deck) => (
                        <Deck
                            deckId={deck.deck_id}
                            key={deck.deck_id}
                            title={deck.title}
                            description={deck.description}
                            isSaved={deck.is_saved}
                            isAuthor={deck.is_author}
                            authorName={deck.user.username}
                            onClick={() => handleClick(deck.deck_id)}
                        />
                    )) : (
                        <p className="text-center text-gray-500">Brak wyników wyszukiwania.</p>
                    )}
                </div>

                <Pagination currentPage={page} totalPages={totalPages} onChangePage={setPage}/>
            </MainContainer>

            <AlertContainer alert={alert} onClose={closeAlert} />
        </>
    )
}