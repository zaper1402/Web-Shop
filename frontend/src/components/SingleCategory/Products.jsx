import './products.css'
import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import Loading from '../loading/Loading'
import ProductCard from '../Cart/Product Card/ProductCard'
import { baseUrl, allInventoryUrl, populate_db } from '../../Constants/urls'
import SearchBar from '../SearchBar/SearchBar'
import { Button, Typography, Container, } from '@mui/material'



const Products = () => {

    const [productData, setProductData] = useState([])
    const [filteredData, setFilteredData] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        getCategoryProduct()
        window.scroll(0, 0)
    }, [])

    const getCategoryProduct = async () => {
        try {
            setIsLoading(true)
            console.log(`loading product data `);
            const { data } = await axios.post(`${baseUrl}${allInventoryUrl}`, { "user_id": localStorage.getItem('user_id') },
                {
                    headers: {
                        'Authorization': localStorage.getItem('Authorization')
                    }
                }
            );
            setIsLoading(false)
            console.log(data);
            setProductData(data)
            setFilteredData(data)

        } catch (error) {
            console.log(error);
        }
    }

  

    const handleChange = (e) => {
        //filter setProductData based on e.target.value
        if (e.target.value === undefined || e.target.value === 'All' || e.target.value === '') {
            setFilteredData(productData)
        } else {
            setFilteredData(productData.filter(prod => prod.product.name.includes(e.target.value)))
        }
    }

    const loading = isLoading ?
        (
            <Container maxWidth='xl' style={{ marginTop: 10, display: "flex", justifyContent: "center", flexWrap: "wrap", paddingLeft: 10, paddingBottom: 20 }}>
                <Loading /><Loading /><Loading /><Loading />
                <Loading /><Loading /><Loading /><Loading />
            </Container >
        )
        : ""



    return (
        <>
            <Container maxWidth='xl' style={{ marginTop: 90, display: 'flex', justifyContent: "center", flexDirection: "column" }}>
                <Container style={{ display: "flex", justifyContent: 'center' }}>
                    <SearchBar eventListener={handleChange} />
                </Container>
                {loading}
                <Container maxWidth='xl' style={{ marginTop: 10, display: "flex", justifyContent: 'center', flexWrap: "wrap", paddingBottom: 20, marginBottom: 30, width: '100%' }}>
                    {filteredData.map(prod => (
                        <ProductCard key={prod.id + prod.user.name} prod={prod} />
                    ))}
                </Container>
            </Container >
        </>
    )
}

export default Products