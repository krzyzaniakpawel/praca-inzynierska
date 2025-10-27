export default function DropdownButton({text, color="gray", onClick}) {
    const variants = {
        gray: "block px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white",
        red: "block w-full px-3 py-2 text-left text-sm font-medium text-red-700 transition-colors hover:bg-red-50 dark:text-red-500 dark:hover:bg-red-950",
        blue: "block w-full px-3 py-2 text-left text-sm font-medium text-blue-700 transition-colors hover:bg-blue-50",
        green: "block w-full px-3 py-2 text-left text-sm font-medium text-green-700 transition-colors hover:bg-green-50 dark:text-green-500 dark:hover:bg-green-900"
    }

    return (
        <div
            className={`cursor-pointer select-none ${variants[color] ?? variants.gray}`}
            role="menuitem"
            onClick={onClick}
        >
            {text}
        </div>
    )
}