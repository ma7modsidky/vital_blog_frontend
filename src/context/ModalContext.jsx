import { createContext, useState, useContext } from "react";

const ModalContext = createContext()

export const useModal = () => useContext(ModalContext)

export const ModalProvider = ({children}) => {
    const [modalContent, setModalContent] = useState(null)
    const [modalIsOpen, setModalIsOpen] = useState(false)

    const openModal = (content) => {
        setModalContent(content)
        setModalIsOpen(true)
    }

    const closeModal = () =>{
        setModalIsOpen(false)
        setModalContent(null)
    }

    return (
        <ModalContext.Provider value={{
            modalIsOpen,modalContent,openModal,closeModal 
        }}>
            {children}
        </ModalContext.Provider>
    )
}