import React, { useState, createContext } from 'react'
export const ContextFunction = createContext()

const Context = ({ children }) => {
    const [cart, setCart] = useState([])
    const [userInventory, setUserInventory] = useState([])


    return (
        <ContextFunction.Provider value={{ cart, setCart, userInventory, setUserInventory }}>
            {children}
        </ContextFunction.Provider>
    )
}

export default Context