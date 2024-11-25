import axios from 'axios';
import {baseUrl,allInventoryUrl, get_inventory} from '../Constants/urls'


const handleLogOut = (setProceed, toast, navigate, setOpenAlert) => {
    if (setProceed) {
        localStorage.removeItem('Authorization')
        localStorage.removeItem('user_id')
        localStorage.removeItem('user_name')
        localStorage.removeItem('password')
        setCart([])
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




export { handleClickOpen, handleClose, handleLogOut, getAllInventory, getUserProducts }