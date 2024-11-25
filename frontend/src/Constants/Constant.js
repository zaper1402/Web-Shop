import { Slide } from "@mui/material";
import { useContext } from "react";
import axios from 'axios';
import {baseUrl,allInventoryUrl, get_inventory, set_cart} from '../Constants/urls'
import { ContextFunction } from '../Context/Context';

const getCart = async (setProceed, setCart, authToken) => {
    if (setProceed) {
        // const { data } = await axios.get(baseUrl + productUrl,
        //     {
        //         headers: {
        //             'Authorization': authToken
        //         }
        //     })
     
        // setCart(data);
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
        const { data } = await axios.post(`${baseUrl}${allInventoryUrl}`, { "user_id": localStorage.getItem('user_id') },
                {
                    headers: {
                        'Authorization': localStorage.getItem('Authorization')
                    }
                }
            );
        setData(data)
    } catch (error) {
        console.log(error);
    }
}

const getUserProducts = async (setProceed, setUserInventory) => {
    try {
        if (!setProceed) {
            return
        }
        const { data } = await axios.get(`${baseUrl}${get_inventory}?user_id=${localStorage.getItem('user_id')}`, 
            {
                headers: {
                    'Authorization': localStorage.getItem('Authorization'),
                    'Content-Type': 'application/json'
                }
            }
        );
        setUserInventory(data)
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





export { getCart, handleClickOpen, handleClose, handleLogOut, getSingleProduct, getAllInventory, getUserProducts }