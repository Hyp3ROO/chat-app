import { useRef } from 'react'

type ModalProps = {
  showModal: boolean
  setShowModal: (showModal: boolean) => void
  handleDeleteClick: () => void
  modalMessage: string
  size?: string
}

const Modal = ({
  showModal,
  setShowModal,
  handleDeleteClick,
  modalMessage,
  size,
}: ModalProps) => {
  const modalRef = useRef<HTMLDivElement | null>(null)
  return (
    showModal && (
      <>
        <div
          className={`${size} fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2 md:gap-4 p-5 rounded-lg bg-primary-bg text-center md:text-lg lg:text-xl md:p-7 z-50`}
          ref={modalRef}>
          <p>{modalMessage}</p>
          <div className='flex items-center gap-4 md:gap-6'>
            <button
              className='rounded-lg bg-secondary px-4 py-2 font-bold transition-colors hover:bg-hover md:px-6 md:py-3'
              onClick={() => setShowModal(false)}>
              Cancel
            </button>
            <button
              className='rounded-lg bg-red-700 px-4 py-2 font-bold transition-colors hover:bg-red-500 md:px-6 md:py-3'
              onClick={handleDeleteClick}>
              Delete
            </button>
          </div>
        </div>
        <div
          className='fixed inset-0 bg-black/80 h-full w-full z-40'
          onClick={() => setShowModal(false)}
        />
      </>
    )
  )
}
export default Modal
