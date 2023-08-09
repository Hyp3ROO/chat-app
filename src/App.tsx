import { Toaster } from 'react-hot-toast'
import Router from './routes/router'

const App = () => {
  return (
    <div className='relative min-h-screen overflow-hidden bg-primary text-white'>
      <Router />
      <Toaster />
    </div>
  )
}

export default App
