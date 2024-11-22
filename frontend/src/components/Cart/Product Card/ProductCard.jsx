import { Box, Card, CardActionArea, CardActions, Rating, CardContent, Typography, ButtonGroup, Button } from '@mui/material';
import styles from './ProductCard.module.css'
import { ContextFunction } from '../../../Context/Context';
import React, { useEffect, useState, useContext } from 'react'
import { toast } from 'react-toastify'


export default function ProductCard({ prod}) {
    const product = prod.product
    const quantity = prod.quantity
    let authToken = localStorage.getItem('Authorization')
    let setProceed = authToken ? true : false
    const { cart, setCart} = useContext(ContextFunction)
    const [productQuantity, setProductQuantity] = useState(1)
    const addToCart = async (product) => {
        if (setProceed) {
            try {
                const existingProductIndex = cart.findIndex(item => item.id === prod.id);
                if (existingProductIndex !== -1) {
                    const updatedCart = [...cart];
                    if (productQuantity > 0) {
                        updatedCart[existingProductIndex].quantity = productQuantity;
                    } else {
                        updatedCart.splice(existingProductIndex, 1);
                    }
                    setCart(updatedCart);
                } else {
                    if (productQuantity > 0) {
                      setCart([...cart, { ...prod, quantity: productQuantity }]);
                    }
                }
                toast.success("Added To Cart", { autoClose: 500, theme: 'colored' })
            } catch (error) {
                toast.error(error.response.data.msg, { autoClose: 500, theme: 'colored' })
            }
        }
        else {
            setOpenAlert(true);
        }
    }

    const increaseQuantity = () => {
        if (productQuantity < quantity) {
            setProductQuantity((prev) => prev +1)
        }
    }
    const decreaseQuantity = () => {
        if (productQuantity > 1) {
            setProductQuantity((prev) => prev -1)
        }
    }
    return (
        <Card className={styles.main_card}>
            <CardActionArea className={styles.card_action}>
                <Box className={styles.cart_box}>
                    <img alt={product.name} src={product.image} loading='lazy' className={styles.cart_img} />
                </Box>
                <CardContent>
                    <Typography gutterBottom variant="h6" sx={{ textAlign: "center" }}>
                        {product.description.length > 20 ? product.description.slice(0, 20) + '...' : product.description}
                    </Typography>
                </CardContent>
            </CardActionArea>
            <CardActions style={{ display: "flex", justifyContent: "space-between", width: '100%' }}>
                <Typography variant="h6" color="primary">
                    ₹{product.price}
                </Typography>
                <Typography >
                    <Rating precision={0.5} name="read-only" value={product.rating} readOnly />
                </Typography>
                <ButtonGroup variant="outlined" aria-label="outlined button group">
                    <Button onClick={decreaseQuantity}>-</Button>
                    <Button>{productQuantity}</Button>
                    <Button onClick={increaseQuantity}>+</Button>
                </ButtonGroup>

            </CardActions>
            <Button onClick={() => addToCart(prod)} variant="contained" color="primary" fullWidth>Add To Cart</Button>
        </Card >
    );
}