import React, { useContext, useEffect, useState } from 'react'
import { ContextFunction } from '../../Context/Context';
import {
    Button,
    Typography,
    Dialog,
    DialogActions,
    DialogContent,
    Container,
    CssBaseline,
    Box,
} from '@mui/material'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { AiFillCloseCircle, AiOutlineLogin } from 'react-icons/ai'
import CartCard from '../../components/Cart/CartCard/CartCard';
import ProductCard from '../../components/Cart/Product Card/ProductCard';
import './Cart.css'
import OrderSummary from './OrderSummary';
import { EmptyCart } from '../../assets/Image';
import { Slide } from "@mui/material";
import { baseUrl,  orderUrl,get_cart, set_cart } from '../../Constants/urls'



const Cart = () => {
    const { cart, setCart } = useContext(ContextFunction)
    const [total, setTotal] = useState(0)
    const [openAlert, setOpenAlert] = useState(false);
    const [previousOrder, setPreviousOrder] = useState([]);


    const navigate = useNavigate()
    let authToken = localStorage.getItem('Authorization')
    let setProceed = authToken ? true : false

    useEffect(() => {
        if (setProceed) {
            getCart()
        }
        else {
            setOpenAlert(true)
        }
        window.scroll(0, 0)

    }, [])

    useEffect(() => {
        if (setProceed) {
            setTotal(cart.reduce((acc, curr) => (acc + ((curr.product?.price * curr.quantity))), 0))
        }

    }, [cart])

    const getCart = async () => {
        if (setProceed) {
            const formData = new FormData();
            formData.append('user_id', localStorage.getItem('user_id'));
            const { data } = await axios.get(`${baseUrl}${get_cart}?user_id=${localStorage.getItem('user_id')}`,
                {
                    headers: {
                        'Authorization': authToken
                    }
                })
                console.log(`Get cart:${data}`);
            setCart(data.inventory);
        }

    }
    const handleClose = () => {
        setOpenAlert(false);
        navigate('/')
    };
    const handleToLogin = () => {
        navigate('/login')
    };

    const removeFromCart = async (product) => {
        if (setProceed) {
            try {
                updateCartToServer(cart.filter(item => item.id !== product.id))
            } catch (error) {
                toast.error("Something went wrong", { autoClose: 500, theme: 'colored' })

            }
        }
    }

    const updateCartToServer = async (cart) => {
        try {
            const response = await axios.post(`${baseUrl}${set_cart}`, { cart, user_id:localStorage.getItem('user_id') }, {
                headers: {
                    'Authorization': authToken
                }
            });
            console.log(`updated cart data: ${response.data}`);
            setCart(cart)
        } catch (error) {
            toast.error(`Something went wrong ${error}`, { autoClose: 500, theme: 'colored' })
        }
    }

    const clearCart = () => {
        updateCartToServer([])
    }

    const proceedToCheckout = async () => {
        console.log(`proceeding to checkout ${cart}`);
        if (cart.length <= 0) {
            toast.error("Please add items in cart to proceed", { autoClose: 500, theme: 'colored' })
        }
        else {
            try {
                console.log("placing order "); 
                cart.forEach((product) => {
                    product.buyer_id = localStorage.getItem('user_id')
                })
                const { data } = await axios.post(`${baseUrl}${orderUrl}`, cart,
                
                    {
                        headers: {
                            'user_id': localStorage.getItem('userId'),
                            'Authorization': localStorage.getItem('Authorization')
                            
                        }
                    }
                );
                console.log(data);
                clearCart()
                toast.success("order placed", { autoClose: 500, theme: 'colored' })
            } catch (error) {
                console.log(error);
                if(error.response.data.errorCode === 40401){
                    toast.error(`Product no longer exists: ${error.response.data.productName}`, { autoClose: 1000, theme: 'colored' })
                    setOpenAlert(true)
                }else if(error.response.data.errorCode === 40402){
                    toast.error(`Not enough stock: ${error.response.data.productName}`, { autoClose: 1000, theme: 'colored' })
                }else if(error.response.data.errorCode === 40403){
                    toast.error(`Price mismatch: ${error.response.data.productName}`, { autoClose: 1000, theme: 'colored' })
                    getCart()
                }
                console.log(error);
            }
        }
    }

    return (
        <>
            <CssBaseline />
            <Container fixed maxWidth >

                <Typography variant='h3' sx={{ textAlign: 'center', marginTop: 10, color: '#1976d2', fontWeight: 'bold' }}>Cart</Typography>
                {
                    setProceed &&
                    cart.length <= 0 &&
                    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <div className="main-card">
                            <img src={EmptyCart} alt="Empty_cart" className="empty-cart-img" />
                            <Typography variant='h6' sx={{ textAlign: 'center', color: '#1976d2', fontWeight: 'bold' }}>Your Cart is Empty</Typography>
                        </div>
                    </Box>

                }
                <Container sx={{ display: 'flex', flexDirection: "column", mb: 10 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
                        {
                            cart.length > 0 &&
                            cart.map(product =>
                                <CartCard product={product} removeFromCart={removeFromCart} key={product.id} />

                            )}
                    </Box>

                    {
                        cart.length > 0 &&
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <OrderSummary proceedToCheckout={proceedToCheckout} total={total} />
                        </Box>
                    }

                </Container>
            </Container>
            {setProceed && previousOrder.length > 0 && <Typography variant='h6' sx={{ textAlign: 'center', margin: "5px 0" }}>Previous Orders</Typography>}
            <Container maxWidth='xl' style={{ marginTop: 10, display: "flex", justifyContent: 'center', flexWrap: "wrap", paddingBottom: 20 }}>
                {
                    previousOrder.map(product => (
                        product.productData.map(prod => <Link to={`/Detail/type/${prod.productId.type}/${prod.productId._id}`} key={prod._id}>
                            <ProductCard prod={prod.productId} />
                        </Link>
                        )
                    )
                    )}
            </Container>
            <Dialog
                open={openAlert}
                keepMounted
                onClose={handleClose}
                TransitionComponent={ Slide}
                aria-describedby="alert-dialog-slide-description">
                <DialogContent sx={{ width: { xs: 280, md: 350, xl: 400 }, display: 'flex', justifyContent: 'center' }}>
                    <Typography variant='h5'> Please Login To Proceed</Typography>
                </DialogContent>
                <DialogActions sx={{ display: 'flex', justifyContent: 'space-evenly' }}>
                    <Button variant='contained' onClick={handleToLogin} endIcon={<AiOutlineLogin />} color='primary'>Login</Button>
                    <Button variant='contained' color='error' endIcon={<AiFillCloseCircle />} onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default Cart