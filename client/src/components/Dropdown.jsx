import { useState, useRef, useEffect } from "react"
import { createPortal } from "react-dom"

export default function Dropdown({ children }) {
    const [open, setOpen] = useState(false)
    const buttonRef = useRef(null)
    const [pos, setPos] = useState({ top: 0, left: 0, width: 0 })

    const updatePosition = () => {
        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect()
            setPos({
                top: rect.bottom + window.scrollY + 10,
                left: rect.left + window.scrollX - (183)
            })
        }
    }
    useEffect(() => {
        if (open) {
            updatePosition()
            window.addEventListener("resize", updatePosition)
            window.addEventListener("scroll", updatePosition)
            return () => {
                window.removeEventListener("resize", updatePosition)
                window.removeEventListener("scroll", updatePosition)
            }
        }
    }, [open])

    return (
        <div className="relative inline-flex">
            <span
                className="inline-flex divide-x divide-gray-300 overflow-hidden rounded border border-gray-300 bg-white shadow-sm dark:divide-gray-600 dark:border-gray-600 dark:bg-gray-800"
            >
                <button
                    ref={buttonRef}
                    type="button"
                    className="cursor-pointer px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900 focus:relative dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white"
                    aria-label="Menu"
                    onClick={() => setOpen(!open)}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="size-4"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                </button>
            </span>

            {open && createPortal(
                <div
                    role="menu"
                    className="absolute end-0 top-12 z-50 w-56 overflow-hidden rounded border border-gray-300 bg-white shadow-sm dark:divide-gray-600 dark:border-gray-600 dark:bg-gray-800"
                    style={{
                        top: pos.top,
                        left: pos.left,
                        position: "absolute"
                    }}
                >
                        {children}
                </div>,
                document.body
            )}
        </div>
    )
}
