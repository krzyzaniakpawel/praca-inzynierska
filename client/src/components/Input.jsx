export default function Input({
    value,
    onChange,
    text,
    type,
    id,
    floating = false,
    required = false,
    readOnly = false
}) {
    if (floating) {
        return (
            <label htmlFor="Email" className="relative">
                <input
                    type={type}
                    id={id}
                    value={value}
                    onChange={onChange}
                    placeholder=""
                    required={required}
                    readOnly={readOnly}
                    className={`${readOnly ? 'caret-transparent' : ""} peer
                    w-full rounded-md bg-white px-3 py-1.5 text-base
                    text-gray-900 outline-1 -outline-offset-1 outline-gray-300
                    placeholder:text-gray-400 focus:outline-2
                    focus:-outline-offset-2 focus:outline-green-600 sm:text-sm/6
                    dark:bg-gray-800 dark:text-white dark:outline-white/10
                    dark:placeholder:text-gray-500
                    dark:focus:outline-green-500`}
                />

                <span
                    className="pointer-events-none absolute inset-y-0 start-3 -translate-y-5 bg-white px-0.5 text-sm font-medium text-gray-700 transition-transform peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-5 dark:bg-gray-800 dark:text-white"
                >
                    {text}
                </span>
            </label>
        )
    } else {
        return (
            <div>
                {text && (
                    <label
                        className="block text-sm/6 font-medium text-gray-900 dark:text-gray-100"
                        htmlFor={id}
                    >
                        {text}
                    </label>
                )}
                <div className="mt-2">
                    <input
                        value={value}
                        onChange={onChange}
                        type={type}
                        id={id}
                        required={required}
                        readOnly={readOnly}
                        className={`${readOnly ? 'caret-transparent' : ""} block
                    w-full rounded-md bg-white px-3 py-1.5 text-base
                    text-gray-900 outline-1 -outline-offset-1 outline-gray-300
                    placeholder:text-gray-400 focus:outline-2
                    focus:-outline-offset-2 focus:outline-green-600 sm:text-sm/6
                    dark:bg-white/5 dark:text-white dark:outline-white/10
                    dark:placeholder:text-gray-500
                    dark:focus:outline-green-500`}
                    />
                </div>
            </div>
        )
    }
}
