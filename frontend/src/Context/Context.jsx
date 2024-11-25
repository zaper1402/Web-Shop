import React, { useState, createContext } from 'react'
export const ContextFunction = createContext()

const Context = ({ children }) => {
    const [cart, setCart] = useState([])
    const [userInventory, setUserInventory] = useState([])
    const [products, setProducts] = useState([])


    return (
        <ContextFunction.Provider value={{ cart, setCart, userInventory, setUserInventory, products, setProducts }}>
            {children}
        </ContextFunction.Provider>
    )
}

export default Context