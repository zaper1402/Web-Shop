import React, { useEffect } from 'react'
import { Container, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { useContext } from 'react'
import { ContextFunction } from '../Context/Context'
import Products from '../components/SingleCategory/Products'


const HomePage = () => {
    const { setCart } = useContext(ContextFunction)
    let authToken = localStorage.getItem('Authorization')
    useEffect(() => {
        // getCart()
        window.scroll(0, 0)
    }, [])

    return (
        <>
            <Container maxWidth='xl' style={{ display: 'flex', justifyContent: "center", padding: 0, flexDirection: "column", marginBottom: 70 }}>
                <Typography variant='h3' sx={{ textAlign: 'center', marginTop: 10, color: '#1976d2', fontWeight: 'bold' }}>Products</Typography>
                <Container maxWidth='xl' style={{ marginTop: 90, display: "flex", justifyContent: 'center', flexGrow: 1, flexWrap: 'wrap', gap: 20, }}>
                    <Products />
                </Container>
            </Container >
        </ >
    )
}

export default HomePage