import './products.css'
import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'
import { Container } from '@mui/system'
import { Box, Button, MenuItem, FormControl, Select } from '@mui/material'
import Loading from '../loading/Loading'
import { BiFilterAlt } from 'react-icons/bi';
import ProductCard from '../Cart/Product Card/ProductCard'
import { baseUrl, allInventoryUrl } from '../../Constants/urls'
import SearchBar from '../SearchBar/SearchBar'


const Products = () => {

    const [productData, setProductData] = useState([])
    const [filteredData, setFilteredData] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [title, setTitle] = useState('All')
    const { cat } = useParams()

    useEffect(() => {
        getCategoryProduct()
        window.scroll(0, 0)
    }, [])

    const getCategoryProduct = async () => {
        try {
            setIsLoading(true)
            console.log("loading category data "); 
            const { data } = await axios.get(`${baseUrl}${allInventoryUrl}`, 
                {
                    headers: {
                        'Authorization': localStorage.getItem('Authorization')
                    }
                }
            );
            setIsLoading(false)
            console.log(data);
            setProductData(data)

        } catch (error) {
            console.log(error);
        }
    }
    

    const handleChange = (e) => {
        //filter setProductData based on e.target.value
        if( e.target.value === undefined || e.target.value === 'All' || e.target.value === ''){
            setFilteredData(productData)
        }else{
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
        </>
    )
}


export default Products

    //         