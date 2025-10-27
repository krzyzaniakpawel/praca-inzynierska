import { useState, useEffect } from "react"

export default function useAlert({header="", message="", type="success", timeout = 5000}) {
    const [alert, setAlert] = useState({ header: header, message: message, type: type })

    useEffect(() => {
        if (!alert.message)
            return

        const timer = setTimeout(() => setAlert({ header: "", message: "" }), timeout)
        return () => clearTimeout(timer)
    }, [alert, timeout])

    const showAlert = (header, message, type="success") => {
        setAlert({ header: "", message: "", type: "success" });
        setTimeout(() => setAlert({ header, message, type }), 100);
    }
    const closeAlert = () => setAlert({ header: "", message: "", type: "success" })

    return { alert, showAlert, closeAlert }
}