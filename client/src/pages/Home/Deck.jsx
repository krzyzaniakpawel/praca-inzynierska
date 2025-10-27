import { useNavigate } from "react-router-dom"
import { useRef } from "react"
import axios from "axios"

import Button from "../../components/Button"
import Dropdown from "../../components/Dropdown"
import DropdownButton from "../../components/DropdownButton"

export default function Deck({ id, title, description, onDelete, onEdit, onPublish, onAddFlashcard, onViewFlashcards, onExport, isPublic, className, newCount, learningCount, reviewCount }) {
    const navigate = useNavigate()
    const fileInputRef = useRef(null)

    const handleImportClick = () => {
        fileInputRef.current.click()
    }

    const handleFileChange = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        const formData = new FormData()
        formData.append("file", file)

        try {
            await axios.post(`/api/decks/${id}/flashcards/import`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            })
            alert("Fiszki zaimportowane")
        } catch (err) {
            console.error(err)
            alert("Błąd przy imporcie")
        } finally {
            e.target.value = "" // reset inputa
        }
    }

    return (
        <div className={"line-clamp-3 block rounded-md border border-gray-300 dark:border-gray-700    p-4 shadow-sm sm:p-6 " + className}>
            <div className="flex gap-4">
                <div className="flex-1 h-35 w-64 p-3 flex flex-col justify-between bg-white dark:bg-gray-900 ">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
                            {title}
                        </h3>
                        <p className="mt-2 text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                            {description}
                        </p>
                    </div>

                    <div className="mt-4 flex flex-wrap sm:flex-nowrap justify-between text-xs text-gray-600 dark:text-gray-400">
                        <span className="text-blue-500">Nowe: {newCount}</span>
                        <span className="text-green-500">Uczone: {learningCount}</span>
                        <span className="text-amber-500">Powtarzane: {reviewCount}</span>
                    </div>
                </div>


                <div className="flex-shrink-0 self-start">
                    <Dropdown>
                        <DropdownButton text="Ucz się" onClick={() => navigate(`/learn/${id}`)} color="green" />
                        <DropdownButton text="Szczegóły zestawu" onClick={onViewFlashcards} />
                        <DropdownButton text="Dodaj fiszkę" onClick={onAddFlashcard} />
                        <DropdownButton text="Edytuj" onClick={onEdit} />
                        <DropdownButton text={isPublic ? "Ustaw jako prywatny" : "Upublicznij"} onClick={onPublish} />
                        <DropdownButton text="Wyeksportuj zestaw" onClick={onExport} />
                        <DropdownButton text="Zaimportuj fiszki" onClick={handleImportClick} />
                        <DropdownButton text="Usuń" color="red" onClick={onDelete} />
                    </Dropdown>
                </div>
            </div>

            {/* ukryty input */}
            <input
                type="file"
                accept=".csv"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
            />
        </div>
    )
}
