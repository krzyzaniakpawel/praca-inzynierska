import ReactDom from 'react-dom'

export default function Portal({ children }) {
    return ReactDom.createPortal(children, document.body)
}