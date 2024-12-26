import { Box, Card, CardActionArea, CardActions, CardContent, Typography, ButtonGroup, Button } from '@mui/material';
import styles from './ProductCard.module.css'
import { ContextFunction } from '../../../Context/Context';
import React, { useState, useContext } from 'react'
import { toast } from 'react-toastify'
import { baseUrl, update_product,set_cart} from '../../../Constants/urls';
import axios from 'axios';


export default function ProductCard({ prod, isUserProduct}) {
    const product = prod.product
    const quantity = prod.quantity
    let authToken = localStorage.getItem('Authorization')
    let user_id = localStorage.getItem('user_id')
    let setProceed = authToken ? true : false
    const { cart, setCart} = useContext(ContextFunction)
    const [productQuantity, setProductQuantity] = useState(Math.min(quantity,1))
    const [updatedPrice, setUpdatedPrice] = useState(1)
    const [editProduct, setEditProduct] = useState(false)
    const [productPrice, setProductPrice] = useState(product.price)
    const addToCart = async (product) => {
        if (setProceed) {
            try {
                const existingProductIndex = cart.findIndex(item => 
                    item.product.id === prod.product.id);
                if (existingProductIndex !== -1) {
                    console.log(`existing product index: ${existingProductIndex}`);
                    const updatedCart = [...cart];
                    if (productQuantity > 0 && (updatedCart[existingProductIndex].quantity+productQuantity) > quantity) {
                        toast.error("Added quantity + Quantity in cart exceeds stock", { autoClose: 500, theme: 'colored' })
                    }else if (productQuantity > 0) {
                        updatedCart[existingProductIndex].quantity += productQuantity;
                        updateCartToServer(updatedCart);
                    } else {
                        updatedCart.splice(existingProductIndex, 1);
                        updateCartToServer(updatedCart);
                    }
                } else {
                    if(productQuantity === 0){
                        toast.error("Quantity cannot be zero", { autoClose: 500, theme: 'colored' })
                    }else if (productQuantity > quantity) {
                        toast.error("Quantityexceeds stock", { autoClose: 500, theme: 'colored' })
                    }else if (productQuantity > 0) {
                        const updatedCart = [...cart, { ...prod, quantity: productQuantity }];
                        updateCartToServer(updatedCart);
                    }
                }
            } catch (error) {
                toast.error(error.response.data.msg, { autoClose: 500, theme: 'colored' })
            }
        }
        else {
            setOpenAlert(true);
        }
    }

    const updateProduct = async () => {
        try {
            const response = await axios.post(`${baseUrl}${update_product}`, { 
                product_id: product.id,
                price: updatedPrice
             }, {
                headers: {
                    'Authorization': authToken
                }
            });
            const data = response.data;
            toast.success(data.msg, { autoClose: 500, theme: 'colored' })
            setProductPrice(updatedPrice)
            setEditProduct(false)
        } catch (error) {
            toast.error(error.response.data.msg, { autoClose: 500, theme: 'colored' })
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
            toast.success("Cart updated successfully", { autoClose: 500, theme: 'colored' })
        } catch (error) {
            toast.error(`Something went wrong ${error}`, { autoClose: 500, theme: 'colored' })
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

    const decodeImage = (image) => {
        return `data:image/jpg;base64,${image}`;
    };
    const imageSrc = React.useMemo(() => decodeImage(product.image), [product.image]);
    return (
        <Card className={styles.main_card}>
            <div style={{ marginTop:'10px', display: "flex", direction:'row', justifyContent: "center" }}>
                <Typography gutterBottom variant="h5" sx={{ textAlign: "center" }}>
                            {product.name}
                </Typography>
                {quantity===0 && <Typography className={styles.cart_sold_out} variant="h6" sx={{ textAlign: "center" }}>
                            (Sold Out)
                </Typography>}
            </div>
            <CardActionArea className={styles.card_action}>
                <Box className={styles.cart_box}>
                    <img alt={product.name} src={imageSrc} loading='lazy' className={styles.cart_img} />
                </Box>
                <CardContent>
                    <Typography gutterBottom variant="h6" sx={{ textAlign: "center" }}>
                        {product.description.length > 20 ? product.description.slice(0, 20) + '...' : product.description}
                    </Typography>
                </CardContent>
            </CardActionArea>
            <CardActions style={{ display: "flex", justifyContent: "space-between", width: '100%' }}>
                {editProduct ? 
                    (<>
                        <input style={{width:"40px", height:"30px"}} type="number" value={updatedPrice} onChange={(e) => setUpdatedPrice(e.target.value)} />
                        <Button variant="outlined" aria-label="outlined button group" onClick={updateProduct}>Save</Button>
                    </>)
                    :
                    <Typography variant="h6" color="primary">
                        €{productPrice}
                    </Typography>
                }
                {!isUserProduct && setProceed && prod.user.id != user_id && prod.category != 'Sold' && <ButtonGroup variant="outlined" aria-label="outlined button group">
                    <Button onClick={decreaseQuantity}>-</Button>
                    <Button>{productQuantity}</Button>
                    <Button onClick={increaseQuantity}>+</Button>
                </ButtonGroup>}
            </CardActions>
            <Typography sx={{ textAlign: "center", width: '100%'}} variant="h6" color={quantity==0?"red":"primary"}>
                {quantity} in stock
            </Typography>
            <Typography gutterBottom variant="h8" sx={{ textAlign: "center" }}>
                Date Added : {product.date_added.slice(0, 10)}
            </Typography>
            {!isUserProduct && prod.user.id == user_id && <Typography gutterBottom variant="h8" color='green' sx={{ textAlign: "center" }}> User Product</Typography>}
            {!isUserProduct && prod.user.id != user_id && prod.category != 'Sold' && setProceed && <Button onClick={() => addToCart(prod)} variant="contained" color="primary" fullWidth>Add To Cart</Button> }
            {prod.category == 'onSale' && isUserProduct && <Button onClick={() => setEditProduct(!editProduct)} variant="contained" color="primary" fullWidth>Edit Product</Button> }
        </Card >
    );
}