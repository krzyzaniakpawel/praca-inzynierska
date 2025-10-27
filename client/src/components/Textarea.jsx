export default function Textarea({id, text, onChange, value=""}) {
    return (
        <label htmlFor={id}>
            <span className="block text-sm/6 font-medium text-gray-900 dark:text-gray-100"> {text} </span>
    
            <div className="mt-2">
                <textarea
                    value={value}
                    onChange={onChange}
                    id={id}
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-green-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-green-500"
                    rows="4"
                ></textarea>
            </div>
        </label>
    )
}