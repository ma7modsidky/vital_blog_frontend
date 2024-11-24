import { useModal } from '../../context/ModalContext'
import './Modal.css'

function Modal() {
  const {modalIsOpen, modalContent, closeModal} = useModal();
  if (!modalIsOpen) return null;
  return (
    <div className='modal-overlay'>
        <div className="modal-content" onClick={(e)=> e.stopPropagation()}>
            {modalContent}
            <button onClick={closeModal} className='close-button'>close</button>
        </div>
    </div>
  )
}

export default Modal