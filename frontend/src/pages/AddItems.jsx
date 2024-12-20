import React, { useState, useEffect, useContext } from 'react';
import { Button, Typography, Container, Grid, TextField } from '@mui/material';
import SearchBar from '../components/SearchBar/SearchBar';
import Loading from '../components/loading/Loading';
import { baseUrl, get_inventory, add_inventoryUrl } from '../Constants/urls';
import axios from 'axios'
import { ContextFunction } from '../Context/Context';
import ProductCard from '../components/Cart/Product Card/ProductCard';
import { toast } from 'react-toastify'


const AddItems = () => {
    const { userInventory, setUserInventory } = useContext(ContextFunction)
    const [selectedFilter, setSelectedFilter] = useState('')
    const [filteredData, setFilteredData] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [showForm, setShowForm] = useState(false);
    const [newProduct, setNewProduct] = useState({
        name: '',
        price: '',
        description: '',
        image: null,
        quantity: 0
    });

    useEffect(() => {
        getUserProducts()
        window.scroll(0, 0)
    }, [])

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProduct({ ...newProduct, [name]: value });
    };

    const handleImageChange = (e) => {    
        setNewProduct({ ...newProduct, image: e.target.files[0] });
    };


    const getUserProducts = async () => {
        try {
            setIsLoading(true)
            const { data } = await axios.get(`${baseUrl}${get_inventory}?user_id=${localStorage.getItem('user_id')}`,
                {
                    headers: {
                        'Authorization': localStorage.getItem('Authorization'),
                        'Content-Type': 'application/json'
                    }
                }
            );
            setIsLoading(false)
            console.log(data);
            setUserInventory(data)
            setFilteredData(data)

        } catch (error) {
            setIsLoading(false)
            console.log(error);
        }
    }

    const addInventory = async (e) => {
        try {
            const formData = new FormData();
            const quantity = parseInt(newProduct.quantity, 10);
            formData.append('name', newProduct.name);
            formData.append('description', newProduct.description);
            formData.append('price', newProduct.price);
            formData.append('image', newProduct.image);
            formData.append('quantity', quantity);
            formData.append('user_id', localStorage.getItem('user_id'));
            if(quantity < 1){
                toast.error('Quantity must be greater than 0', { autoClose: 300, theme: 'colored' });
                return;
            }else if(newProduct.price < 1){
                toast.error('Price must be greater than 0', { autoClose: 300, theme: 'colored' });
                return;
            }
            console.log('FormData contents:', [...formData.entries()]); // Debug log

            const { data, status } = await axios.post(`${baseUrl}${add_inventoryUrl}`, formData, {
                headers: {
                    'Authorization': localStorage.getItem('Authorization'),
                    'Content-Type': 'multipart/form-data'
                }
            }).catch(error => {
                toast.error('An error occurred, please try again', { autoClose: 300, theme: 'colored' });
            });
            let newproduct = data.data[0]
        
            const updatedInventory = [...userInventory, newproduct];
            setUserInventory(updatedInventory);
            setFilteredData(updatedInventory.filter(prod => prod.category.includes(selectedFilter)));
            clearForm();
            // handleChange({ target: { value: selectedFilter } })
            toast.success('Product added successfully', { autoClose: 500, theme: 'colored' });
        } catch (error) {
            setIsLoading(false);
            console.log(error);
        }
    };

    const clearForm = () => {
        setNewProduct({ name: '', price: '', description: '', image: null, quantity: 0 });
    }

    const loading = isLoading ?
        (
            <Container maxWidth='xl' style={{ marginTop: 10, display: "flex", justifyContent: "center", flexWrap: "wrap", paddingLeft: 10, paddingBottom: 20 }}>
                <Loading /><Loading /><Loading /><Loading />
                <Loading /><Loading /><Loading /><Loading />
            </Container >
        )
        : ""

    const handleChange = (e) => {
        //filter setProductData based on e.target.value
        if (e.target.value === selectedFilter) {
            setSelectedFilter('')
            setFilteredData(userInventory)
        } else {
            console.log(e.target.value, selectedFilter)
            setSelectedFilter(e.target.value)
            setFilteredData(userInventory.filter(prod => prod.category.includes(e.target.value)))
        }
    }

    return (
        <div>
            <Button variant='contained' className='nav-icon-span' sx={{ marginBottom: 1, marginInlineStart: 10 }} onClick={() => setShowForm(!showForm)} >
                <Typography variant='button'> Add Product</Typography>
            </Button>

            {showForm && (
                <Grid container spacing={2} margin={10} width={'400px'}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            name="name"
                            value={newProduct.name}
                            onChange={handleInputChange}
                            required
                            fullWidth
                            id="name"
                            label="Name"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            required
                            fullWidth
                            id="price"
                            label="price"
                            name="price"
                            value={newProduct.price}
                            onChange={handleInputChange}
                            inputMode='numeric'
                            inputProps={{ type: 'number', max: 999, min: 0 }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            required
                            fullWidth
                            id="description"
                            label="description"
                            name="description"
                            value={newProduct.description}
                            onChange={handleInputChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <input
                            accept="image/*"
                            style={{ display: 'none' }}
                            id="raised-button-file"
                            type="file"
                            onChange={handleImageChange}
                        />
                        <label htmlFor="raised-button-file">
                            <Button variant="contained" component="span">
                                {newProduct.image ? 'Reupload Image' : 'Upload Image'}
                            </Button>
                        </label>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            required
                            fullWidth
                            name="quantity"
                            label="quantity"
                            id="quantity"
                            value={newProduct.quantity}
                            onChange={handleInputChange}
                            inputProps={{ type: 'number', max: 10, min: 0 }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            onClick={addInventory}
                        >
                            Submit
                        </Button>
                    </Grid>
                </Grid>
            )}
            <ul>
                <Container maxWidth='xl' style={{ marginTop: 90, display: 'flex', justifyContent: "center", flexDirection: "column" }}>
                    {/* <Container style={{ marginTop: 90, display: "flex", justifyContent: 'center' }}>
                        <SearchBar eventListener={handleChange} />
                    </Container> */}
                    {/* Add three filter list options here "Sold", "Purchased", "OnSale" */}
                    <Container style={{ marginTop: 20, width:'400px', display: 'flex', justifyContent: 'space-between' }}>
                        <Button 
                            variant={selectedFilter === 'Sold' ? 'contained' : 'outlined'} 
                            onClick={() => handleChange({ target: { value: 'Sold' } })}
                        >
                            Sold
                        </Button>
                        <Button 
                            variant={selectedFilter === 'Purchased' ? 'contained' : 'outlined'} 
                            onClick={() => handleChange({ target: { value: 'Purchased' } })}
                        >
                            Purchased
                        </Button>
                        <Button 
                            variant={selectedFilter === 'onSale' ? 'contained' : 'outlined'} 
                            onClick={() => handleChange({ target: { value: 'onSale' } })}
                        >
                            OnSale
                        </Button>
                    </Container>
                    
                    {loading}
                    <Container maxWidth='xl' style={{ marginTop: 10, display: "flex", justifyContent: 'center', flexWrap: "wrap", paddingBottom: 20, marginBottom: 30, width: '100%' }}>
                        {filteredData.map(prod => (
                            <ProductCard key={prod.id + prod.user.name} prod={prod} isUserProduct={true} isEditable={selectedFilter=='onSale'} />
                        ))}
                    </Container>
                </Container >
            </ul>
        </div>
    );
};

export default AddItems;