
import './App.css'
import { BrowserRouter } from 'react-router'
import AppRoutes from './routes/AppRoutes'

function App() {

  return (
    <BrowserRouter basename='/administracion'>
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App
