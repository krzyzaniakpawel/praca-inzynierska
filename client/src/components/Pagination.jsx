export default function Pagination({ currentPage, totalPages, onChangePage }) {
    const baseStyle = "cursor-pointer grid size-8 place-content-center rounded border border-gray-200 transition-colors hover:bg-gray-100/75 rtl:rotate-180 dark:border-gray-700 dark:hover:bg-gray-800"
    const currentPageStyle = "grid size-8 place-content-center rounded border border-green-600 bg-green-600 text-white dark:border-green-600 dark:bg-green-600"
    return (
        <ul className="flex justify-center gap-1 text-gray-900 m-16 dark:text-white">
            <li>
                <button
                    onClick={() => onChangePage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={baseStyle}
                    aria-label="Previous page"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="size-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                            clipRule="evenodd"
                        />
                    </svg>
                </button>
            </li>
            {Array.from({ length: totalPages }, (_, i) => (
                <li key={i}>
                    <button
                        onClick={() => onChangePage(i + 1)}
                        // className={`block size-8 rounded border text-center text-sm/8 font-medium transition-colors ${currentPage === i + 1 ? "border-green-600 bg-green-600 hover:border-green-500 hover:bg-green-500 text-white dark:border-green-600 dark:bg-green-600 dark:hover:border-green-600/75 dark:hover:bg-green-600/75" : "border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"} `}
                        className={`text-sm/8 font-medium ${currentPage === i + 1 ? currentPageStyle : baseStyle}`}
                    >
                        {i + 1}
                    </button>
                </li>
            ))}

            <li>
                <button
                    onClick={() => onChangePage(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    className={baseStyle}
                    aria-label="Next page"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="size-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                            clipRule="evenodd"
                        />
                    </svg>
                </button>
            </li>
        </ul>

    )
}