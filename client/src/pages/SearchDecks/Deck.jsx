import { useNavigate } from "react-router"
import Button from "../../components/Button"

export default function Deck({deckId, title, description, authorName, onClick, isSaved, isAuthor}) {
    const navigate = useNavigate()

    return (
        <div className="line-clamp-3 block rounded-md border border-gray-300 dark:border-gray-700  dark:bg-gray-1000 p-4 shadow-sm sm:p-6 ">
            <div className="flex gap-4">
                <div className="flex-1">
                    <h3 className="text-lg font-medium text-pretty text-gray-900 dark:text-gray-100">
                        {title}
                    </h3>
                    <p className="mt-4 line-clamp-2 text-sm text-pretty text-gray-700 dark:text-gray-300">
                        {description}
                    </p>
                    <p className="mt-4 line-clamp-2 text-sm text-pretty text-gray-500 dark:text-gray-300">
                        Autor: {authorName}
                    </p>
                    <div className="flex gap-4 mt-6">
                        {isAuthor ? (
                            <Button onClick={() => navigate(`/deck/${deckId}`)} color="blue">Twój zestaw</Button>
                        ) : isSaved ? (
                            <Button color="gray">Zapisany</Button>
                        ) : (
                            <Button onClick={onClick}>Zapisz</Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}