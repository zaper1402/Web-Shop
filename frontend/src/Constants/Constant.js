import axios from 'axios';
import {baseUrl,allInventoryUrl, get_inventory,get_cart} from '../Constants/urls'

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

const handleLogOut = (setProceed, toast, navigate, setOpenAlert,setCart,setProducts) => {
    if (setProceed) {
        localStorage.removeItem('Authorization')
        localStorage.removeItem('user_id')
        localStorage.removeItem('user_name')
        localStorage.removeItem('password')
        
        toast.success("Logout Successfully", { autoClose: 500, theme: 'colored' })
        if(window.location.pathname !== '/'){
            navigate('/')
        }else{
            window.location.reload()
        }
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



const getCart = async (setProceed, setCart) => {
    if (setProceed) {
        const formData = new FormData();
        formData.append('user_id', localStorage.getItem('user_id'));
        const { data } = await axios.get(`${baseUrl}${get_cart}?user_id=${localStorage.getItem('user_id')}`,
            {
                headers: {
                    'Authorization': localStorage.getItem('Authorization')
                }
            })
        console.log(`Get cart:${data.inventory.length}`);
        setCart(data.inventory);
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




export { handleClickOpen, handleClose, handleLogOut, getAllInventory, getUserProducts, getCart }