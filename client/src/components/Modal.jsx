import Portal from "./Portal"

export default function Modal({ title, children, isOpen, onClose }) {
    if (!isOpen) 
        return null

    return (
        <Portal>
            <div
                className="fixed inset-0 z-50 grid place-content-center bg-black/50 p-4"
                role="dialog"
                aria-modal="true"
                aria-labelledby="modalTitle"
            >
                <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg min-w-80 dark:bg-gray-900">
                    <div className="flex items-start justify-between">
                        <h2 id="modalTitle" className="text-xl font-bold text-gray-900 sm:text-2xl dark:text-gray-200">{title}</h2>

                        <button
                            type="button"
                            className="-me-4 -mt-4 rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-600 focus:outline-none dark:hover:bg-gray-700 dark:hover:text-white"
                            aria-label="Close"
                            onClick={onClose}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="size-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>

                    <div className="mt-4 dark:text-gray-200">
                        {children}
                    </div>
                </div>
            </div>
        </Portal>
    )
}