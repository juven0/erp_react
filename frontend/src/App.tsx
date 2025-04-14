import './App.css'
import { ToasterProvider } from './components/ToasterProvider'
import Router from './router/router'

function App() {

  return (
    <div className='w-full h-full relative '>
      <Router/>
      <ToasterProvider />
    </div>
  )
}

export default App
