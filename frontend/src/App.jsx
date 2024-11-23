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
import { Button, Typography } from '@mui/material'
import axios from 'axios'
import { baseUrl, populate_db } from './Constants/urls'
import { toast } from 'react-toastify'



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

  const populateDB = async () => {
    try {
        console.log(`loading product data `);
        const { data } = await axios.get(`${baseUrl}${populate_db}`,
            {
                headers: {
                    'Authorization': localStorage.getItem('Authorization')
                }
            }
        );
        toast.success('Database Populated', {autoClose: 2000, theme: 'colored' })
    } catch (error) {
        setIsLoading(false)
        console.log(error);
    }
  }


  return (
    <>
      <ToastContainer toastClassName="toastContainerBox" transition={Flip} position="top-right" />
      <DesktopNav />
      <div className='margin'></div>
      {!setProceed && 
                <Button variant='contained' className='nav-icon-span' sx={{ marginBottom: 1, marginInlineStart: 10 }} onClick={() => populateDB()} >
                    <Typography variant='button'> Populate DB</Typography>
                </Button>
            }
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
