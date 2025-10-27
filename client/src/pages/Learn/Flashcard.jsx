function Flashcard({children}) {
    return (
        <div className="block rounded-md border border-gray-300 p-4 shadow-sm
        sm:p-6 flex-1 justify-center items-center flex
        text-[clamp(1rem,2vw,2rem)] overflow-visible whitespace-pre-wrap dark:border-gray-700">
           {children}
        </div>
    )
}

export default Flashcard