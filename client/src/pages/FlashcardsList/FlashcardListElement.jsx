import { useState } from "react"
import Input from "../../components/Input"
import Button from "../../components/Button"

function FlashcardListElement({id, term, definition, number, onDelete, onEdit}) {
    const [ isEditing, setIsEditing ] = useState(false)

    const [ localTerm, setLocalTerm ] = useState(term)
    const [ localDefinition, setLocalDefinition ] = useState(definition)

    const handleClick = () => {
        if (isEditing) {
            onEdit(id, localTerm, localDefinition)
            setIsEditing(false)
        } else {
            setIsEditing(true)
        }
    }

    const cancelEdit = () => {
        setIsEditing(false)
        setLocalTerm(term)
        setLocalDefinition(definition)
    }

    return (
        <div className="block rounded-md border border-gray-300 dark:border-gray-700 p-4 shadow-sm sm:p-6">
            <h5 className="mb-4">{number}</h5>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8">
                <Input onChange={(e) => setLocalTerm(e.target.value)} text="Termin" type="text" id={id} value={localTerm} readOnly={!isEditing} />        
                <Input onChange={(e) => setLocalDefinition(e.target.value)} text="Definicja" type="text" id={id} value={localDefinition} readOnly={!isEditing} />
            </div>
            <div className="flex gap-4 mt-6">
                <Button color="red" onClick={onDelete}>Usuń</Button>
                {isEditing && (<Button color="gray" onClick={() => cancelEdit()}>Cofnij</Button>)}
                <Button onClick={handleClick} color={isEditing ? "blue" : "green"}>{isEditing ? "Zapisz zmiany" : "Edytuj"}</Button>
            </div>
        </div>
    )
}

export default FlashcardListElement