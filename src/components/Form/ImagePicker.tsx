import { useState } from 'react'
import imageCompression from 'browser-image-compression'
import toast from 'react-hot-toast'
import { FcAddImage } from 'react-icons/fc'
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

type ImagePickerProps = {
  image: File | null
  setImage: (image: File | null) => void
}

const ImagePicker = ({ image, setImage }: ImagePickerProps) => {
  const [isImageAdding, setIsImageAdding] = useState(false)
  const [imagePreview, setImagePreview] = useState('')

  const handleImagePreview = (file: File) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setImagePreview(reader.result)
      }
    }
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsImageAdding(true)
    const imageFile = e.target.files?.[0]
    const options = {
      maxSizeMB: 0.5,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      fileType: 'image/webp',
    }
    try {
      if (imageFile) {
        const compressedImageFile = await imageCompression(imageFile, options)
        setImage(compressedImageFile)
        handleImagePreview(compressedImageFile)
      }
    } catch (error) {
      toast.error('An error occurred while adding an image')
    }
    setIsImageAdding(false)
  }

  return (
    <div className='flex flex-col items-center justify-center gap-2'>
      <input
        type='file'
        id='image'
        name='image'
        className='hidden'
        accept='image/*'
        onChange={handleImageChange}
      />
      <label
        htmlFor='image'
        className='group flex cursor-pointer items-center gap-2'>
        <FcAddImage className='text-2xl' />
        {image ? (
          <span className='text-green-500'>Added</span>
        ) : isImageAdding ? (
          <span className='text-gray-400'>Adding...</span>
        ) : (
          <span className='transition-colors group-hover:text-hover'>
            Add an Image
          </span>
        )}
      </label>
      <Zoom zoomMargin={4} classDialog='custom-zoom'>
        <img
          src={imagePreview}
          alt='Your added profile picture'
          className={`${
            imagePreview === '' ? 'hidden' : 'block'
          } rounded-full object-cover h-14 w-14`}
          loading='lazy'
        />
      </Zoom>
    </div>
  )
}
export default ImagePicker
