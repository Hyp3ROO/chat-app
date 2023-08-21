import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

type MessageImageProps = {
  image: string
  [key: string]: unknown
}

const MessageImage = ({ image, ...rest }: MessageImageProps) => {
  return (
    <Zoom zoomMargin={4} classDialog='custom-zoom'>
      <img
        src={image}
        alt=''
        className='rounded-lg object-cover'
        loading='lazy'
        {...rest}
      />
    </Zoom>
  )
}
export default MessageImage
