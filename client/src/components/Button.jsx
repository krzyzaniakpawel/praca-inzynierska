export default function Button({ onClick, children, color="green", className="" }) {
    const base = "cursor-pointer flex items-center justify-center rounded-md px-3 py-1.5 text-sm/6 font-semibold shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2"
    const variants = {
        green: "text-white bg-green-600 transition-colors hover:bg-green-500 focus-visible:outline-green-600 dark:bg-green-600 dark:hover:bg-green-600/75 dark:focus-visible:outline-green-500",
        red: "text-white bg-red-600 transition-colors hover:bg-red-500 focus-visible:outline-red-600 dark:bg-red-600 dark:hover:bg-red-600/75 dark:focus-visible:outline-red-500",
        blue: "text-white bg-blue-600 transition-colors hover:bg-blue-500 focus-visible:outline-blue-600 dark:bg-blue-600 dark:hover:bg-blue-600/75 dark:focus-visible:outline-blue-500",
        gray: "text-gray-700 bg-gray-100 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700",
        yellow: "bg-yellow-400 transition-colors hover:bg-yellow-300 dark:bg-yellow-500 dark:hover:bg-yellow-600",
    }

    return (
        <button onClick={onClick} className={`${base} ${variants[color] ?? variants.green} ${className}`}>
            {children}
        </button>
    )
}