import { Box, Card, CardActionArea, CardActions, Rating, CardContent, Typography, ButtonGroup, Button } from '@mui/material';
import styles from './ProductCard.module.css'
import { ContextFunction } from '../../../Context/Context';
import React, { useEffect, useState, useContext } from 'react'
import { toast } from 'react-toastify'
import { baseUrl, update_product} from '../../../Constants/urls';
import axios from 'axios';


export default function ProductCard({ prod, isUserProduct}) {
    const product = prod.product
    const quantity = prod.quantity
    let authToken = localStorage.getItem('Authorization')
    let setProceed = authToken ? true : false
    const { cart, setCart} = useContext(ContextFunction)
    const [productQuantity, setProductQuantity] = useState(1)
    const [updatedPrice, setUpdatedPrice] = useState(1)
    const [editProduct, setEditProduct] = useState(false)
    const [productPrice, setProductPrice] = useState(product.price)

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
                <ButtonGroup variant="outlined" aria-label="outlined button group">
                    {!isUserProduct && <Button onClick={decreaseQuantity}>-</Button>}
                    <Button>{productQuantity}</Button>
                    {!isUserProduct && <Button onClick={increaseQuantity}>+</Button>}
                </ButtonGroup>
            </CardActions>
            <Typography sx={{ textAlign: "center", width: '100%'}} variant="h6" color="primary">
                {quantity} in stock
            </Typography>
            <Typography gutterBottom variant="h8" sx={{ textAlign: "center" }}>
                Date Added : {product.date_added.slice(0, 10)}
            </Typography>
            {!  isUserProduct && <Button onClick={() => addToCart(prod)} variant="contained" color="primary" fullWidth>Add To Cart</Button> }
            {isUserProduct && <Button onClick={() => setEditProduct(!editProduct)} variant="contained" color="primary" fullWidth>Edit Product</Button> }
        </Card >
    );
}