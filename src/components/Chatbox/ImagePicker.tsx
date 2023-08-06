import { FcAddImage } from 'react-icons/fc'

type ImagePickerProps = {
  image: File | null
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  isImageAdding: boolean
}

const ImagePicker = ({
  image,
  handleImageChange,
  isImageAdding,
}: ImagePickerProps) => {
  return (
    <label
      htmlFor='image'
      className='group flex cursor-pointer flex-col items-center absolute right-3'>
      <input
        type='file'
        id='image'
        name='image'
        className='hidden'
        accept='image/*'
        onChange={handleImageChange}
      />
      <FcAddImage className='text-3xl transition-transform group-hover:scale-105 md:text-4xl' />
      {image && (
        <span className='text-[.65rem] md:text-xs text-green-500'>Added</span>
      )}
      {isImageAdding && (
        <span className='text-[.65rem] md:text-xs text-gray-400'>
          Adding...
        </span>
      )}
    </label>
  )
}
export default ImagePicker
