// import { createContext } from "react";

// export const CartItemsContext = createContext({
//     items: [],
//     totalAmount: 0,
//     addItem: () => {},
//     removeItem: () => {},
//     quantity: () => {}
// })
 

import { createContext, useState, useEffect } from "react";

export const CartItemsContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem("cartItems");
        return savedCart ? JSON.parse(savedCart) : { items: [], totalAmount: 0 };
    });

    // Save cart items to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (item) => {
        const updatedItems = [...cartItems.items, item];
        const updatedTotalAmount = cartItems.totalAmount + item.price;

        setCartItems({
            items: updatedItems,
            totalAmount: updatedTotalAmount
        });
    };

    return (
        <CartItemsContext.Provider value={{ ...cartItems, addToCart }}>
            {children}
        </CartItemsContext.Provider>
    );
};

