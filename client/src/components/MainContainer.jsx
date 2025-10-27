import React from 'react'

export default function MainContainer({ children, className }) {
    return (
        <div className={`mx-auto mt-4 max-w-6xl p-4 ${className}`}>
            {children}
        </div>
    )
}
