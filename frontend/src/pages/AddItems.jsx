import React, { useState, useEffect } from 'react';
import { Button, Typography, Container } from '@mui/material';
import SearchBar from '../components/SearchBar/SearchBar';
import Loading from '../components/loading/Loading';
import { baseUrl, get_inventory ,add_inventoryUrl } from '../Constants/urls';
import axios from 'axios'
import ProductCard from '../components/Cart/Product Card/ProductCard';



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
            console.log(data);
            setProducts([...products, data.data]);
            setFilteredData([...filteredData, data.data]);
        } catch (error) {
            setIsLoading(false);
            console.log(error);
        }
    };

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
            <Button variant='contained' className='nav-icon-span' sx={{ marginBottom: 1 }} onClick={() => setShowForm(!showForm)} >
                      <Typography variant='button'> Add Product</Typography>
            </Button>
            {showForm && (
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Name:</label>
                        <input
                            type="text"
                            name="name"
                            value={newProduct.name}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Price:</label>
                        <input
                            type="number"
                            name="price"
                            value={newProduct.price}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Description:</label>
                        <textarea
                            name="description"
                            value={newProduct.description}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Image:</label>
                        <input
                            type="file"
                            name="image"
                            onChange={handleImageChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Quantity:</label>
                        <input
                            type="number"
                            name="quantity"
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <Button type="submit" onClick={addInventory}>Add Product</Button>
                </form>
            )}
            <ul>
                <Container maxWidth='xl' style={{ marginTop: 90, display: 'flex', justifyContent: "center", flexDirection: "column" }}>
                    <Container style={{ marginTop: 90, display: "flex", justifyContent: 'center' }}>
                        <SearchBar eventListener={handleChange} />
                    </Container>
                    {loading}
                    <Container maxWidth='xl' style={{ marginTop: 10, display: "flex", justifyContent: 'center', flexWrap: "wrap", paddingBottom: 20, marginBottom: 30, width: '100%' }}>
                        {filteredData.map(prod => (
                            <ProductCard key={prod.id+prod.user.name} prod={prod}/>
                        ))}
                    </Container>
                </Container >
            </ul>
        </div>
    );
};

export default AddItems;