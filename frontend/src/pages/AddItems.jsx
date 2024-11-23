import React, { useState, useEffect } from 'react';
import { Button, Typography, Container, Grid, InputAdornment, TextField  } from '@mui/material';
import SearchBar from '../components/SearchBar/SearchBar';
import Loading from '../components/loading/Loading';
import { baseUrl, get_inventory ,add_inventoryUrl } from '../Constants/urls';
import axios from 'axios'
import ProductCard from '../components/Cart/Product Card/ProductCard';
import { toast } from 'react-toastify'


const AddItems = () => {
    const [products, setProducts] = useState([]);
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

    const handleSubmit = (e) => {
        e.preventDefault();
        setProducts([...products, newProduct]);
        setNewProduct({ name: '', price: '', description: '', image: null });
        setShowForm(false);
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
            setProducts(data)
            setFilteredData(data)

        } catch (error) {
            setIsLoading(false)
            console.log(error);
        }
    }

    const addInventory = async () => {
        try {
            const formData = {
                name: newProduct.name,
                description: newProduct.description,
                price: newProduct.price,
                // image: newProduct.image,
                user_id: localStorage.getItem('user_id'),
                quantity: newProduct.quantity
            };

            const { data } = await axios.post(`${baseUrl}${add_inventoryUrl}`, formData, {
                headers: {
                    'Authorization': localStorage.getItem('Authorization'),
                    'Content-Type': 'application/json'
                }
            });
            let newproduct = data.data[0]
            setProducts([...products, newproduct]);
            setFilteredData([...filteredData, newproduct]);
            clearForm();
            toast.success('Product added successfully',{ autoClose: 500, theme: 'colored' });
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
        if( e.target.value === undefined || e.target.value === 'All' || e.target.value === ''){
            setFilteredData(productData)
        }else{
            setFilteredData(productData.filter(prod => prod.product.name.includes(e.target.value)))
        }
    }

    return (
        <div>
            <Button variant='contained' className='nav-icon-span' sx={{ marginBottom: 1, marginInlineStart: 10}} onClick={() => setShowForm(!showForm)} >
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
                    <Container style={{ marginTop: 90, display: "flex", justifyContent: 'center' }}>
                        <SearchBar eventListener={handleChange} />
                    </Container>
                    {loading}
                    <Container maxWidth='xl' style={{ marginTop: 10, display: "flex", justifyContent: 'center', flexWrap: "wrap", paddingBottom: 20, marginBottom: 30, width: '100%' }}>
                        {filteredData.map(prod => (
                            <ProductCard key={prod.id+prod.user.name} prod={prod} isUserProduct={true}/>
                        ))}
                    </Container>
                </Container >
            </ul>
        </div>
    );
};

export default AddItems;