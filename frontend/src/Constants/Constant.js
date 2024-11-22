import { Slide } from "@mui/material";
import { forwardRef } from "react";
import axios from 'axios';
import {baseUrl, allProductsUrl,allInventoryUrl} from '../Constants/urls'

const getCart = async (setProceed, setCart, authToken) => {
    if (setProceed) {
        const { data } = await axios.get(baseUrl + productUrl,
            {
                headers: {
                    'Authorization': authToken
                }
            })
        setCart(data);
    }
}
const getWishList = async (setProceed, setWishlistData, authToken) => {
    if (setProceed) {
        const { data } = await axios.get(`${process.env.REACT_APP_GET_WISHLIST}`,
            {
                headers: {
                    'Authorization': authToken
                }
            })
        setWishlistData(data)
    }
}
const handleLogOut = (setProceed, toast, navigate, setOpenAlert) => {
    if (setProceed) {
        localStorage.removeItem('Authorization')
        toast.success("Logout Successfully", { autoClose: 500, theme: 'colored' })
        navigate('/')
        setOpenAlert(false)
    }
    else {
        toast.error("User is already logged of", { autoClose: 500, theme: 'colored' })
    }
}

const handleClickOpen = (setOpenAlert) => {
    setOpenAlert(true);
};

const handleClose = (setOpenAlert) => {
    setOpenAlert(false);
};

const getAllInventory = async (setData) => {
    try {
        const { data } = await axios.get(baseUrl + allInventoryUrl);
        setData(data)
    } catch (error) {
        console.log(error);
    }
}

const getAllProducts = async (setData) => {
    try {
        const { data } = await axios.get(baseUrl + allProductsUrl);
        setData(data)


    } catch (error) {
        console.log(error);
    }
}

const getSingleProduct = async (setProduct, id, setLoading) => {

    const { data } = await axios.get(`${process.env.REACT_APP_FETCH_PRODUCT}/${id}`)
    setProduct(data)
    setLoading(false);

}

// const Transition = forwardRef(function Transition(props, ref) {
//     return <Slide direction="up" ref={ref} {...props} />;
// });





export { getCart, getWishList, handleClickOpen, handleClose, handleLogOut, getAllProducts, getSingleProduct }