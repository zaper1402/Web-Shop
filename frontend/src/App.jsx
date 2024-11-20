import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Homepage from './pages/HomePage'
import Cart from './pages/Cart/Cart'
import DesktopNav from './Navigation/DesktopNavigation'
import Login from './Auth/Login/Login'
import Register from './Auth/Register/Register'
import { Flip, ToastContainer } from 'react-toastify';


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <ToastContainer toastClassName='toastContainerBox' transition={Flip} position='top-center' />
      <h1>Welcome to App Page</h1>
      <BrowserRouter>
        <DesktopNav />
        <Routes>
          <Route path="/" index element={<Homepage />} />
          <Route path="/login" element={< Login />} />
          <Route path='/register' element={<Register />} />
          <Route path="/cart" index element={<Cart />} />
        </Routes>
      </BrowserRouter>
    </>

  )
}

export default App
