import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import Homepage from './pages/HomePage'
import Cart from './pages/Cart/Cart'
import DesktopNav from './Navigation/DesktopNavigation'
import Login from './Auth/Login/Login'
import Register from './Auth/Register/Register'
import { Flip, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useNavigate} from 'react-router-dom'
import AddItems from './pages/AddItems'



function App() {
  const [count, setCount] = useState(0)
  let authToken = localStorage.getItem('Authorization')
  let setProceed = authToken ? true : false
  const navigate = useNavigate();
  useEffect(() => {
    // show login if not register or login route

    if (!setProceed && window.location.pathname !== '/login' && window.location.pathname !== '/register') {
      navigate('/login');
    }
  }, [setProceed, navigate]);

  return (
    <>
      <ToastContainer toastClassName="toastContainerBox" transition={Flip} position="top-right" />
      <DesktopNav />
      <div className='margin'></div>
      <Routes>
        <Route path="/" index element={<Homepage />} />
        <Route path="/login" element={< Login />} />
        <Route path='/register' element={<Register />} />
        <Route path="/cart" index element={<Cart />} />
        <Route path="/add-items" element={<AddItems />} />
      </Routes>
    </>

  )
}

export default App
