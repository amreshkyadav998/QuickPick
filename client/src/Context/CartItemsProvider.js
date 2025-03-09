import { useEffect, useState } from "react";
import { CartItemsContext } from "./CartItemsContext";

const CartItemsProvider = (props) => {

    const [cartItems, setCartItems] = useState([])
    const [totalAmountOfItems, setTotalAmountOfItems] = useState(0)
    
    const addToCartHandler = (item, quantity) => {
        const { _id, name, price, image, category, size} = item;
        removeFromCartHandler(item)
        setCartItems((prevItems) => [...prevItems, {_id, name, price, image, category, itemQuantity: quantity, size}])
    }

    const removeFromCartHandler = (item) => {
        setCartItems(cartItems.filter((prevItem) => prevItem._id !== item._id))
    }

    const calculateTotalAmount = (currentCartItems) => {
        let total = 0
        currentCartItems.forEach((item) => {
            total = total + (item.price * item.itemQuantity)
        })

        setTotalAmountOfItems(total)
    }

    const quantityHandler = (itemId, action) => {
        if(action === 'INC'){
            setCartItems(cartItems.map((item) => {
                if(item.id  === itemId){
                    item.itemQuantity += 1
                }
                return item
            }))
        }
        else {
            setCartItems(cartItems.map((item) => {
                if(item.id  === itemId){
                    item.itemQuantity -= 1
                }
                return item
            }))
        }
    }

    useEffect(() => {
        calculateTotalAmount(cartItems)
    }, [cartItems])


    const cartItemCtx = {
        items: cartItems,
        totalAmount: totalAmountOfItems,
        addItem: addToCartHandler,
        removeItem: removeFromCartHandler,
        quantity: quantityHandler
    }

    return ( 
        <CartItemsContext.Provider value={cartItemCtx}>
            {props.children}
        </CartItemsContext.Provider>
     );
}
 
export default CartItemsProvider;




// import React, { useState, useEffect, useContext } from "react";
// import { CartItemsContext } from "./CartItemsContext";
// import { AuthContext } from "./AuthContext";
// import { cartAPI } from "../utils/apiUtils";

// export const CartItemsProvider = ({ children }) => {
//     const [cartItems, setCartItems] = useState([]);
//     const [totalAmount, setTotalAmount] = useState(0);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);
//     const { isAuthenticated } = useContext(AuthContext);

//     // Fetch cart items when user is authenticated
//     useEffect(() => {
//         if (isAuthenticated) {
//             fetchCartItems();
//         } else {
//             const localCart = localStorage.getItem("cart");
//             if (localCart) {
//                 setCartItems(JSON.parse(localCart));
//             }
//         }
//     }, [isAuthenticated]);

//     // Save cart to localStorage for non-authenticated users
//     useEffect(() => {
//         if (!isAuthenticated) {
//             localStorage.setItem("cart", JSON.stringify(cartItems));
//         }
//         calculateTotalAmount(cartItems);
//     }, [cartItems, isAuthenticated]);

//     const fetchCartItems = async () => {
//         try {
//             setLoading(true);
//             const data = await cartAPI.getCart();
//             setCartItems(data);
//             setError(null);
//         } catch (err) {
//             setError(err.message);
//             console.error("Error fetching cart:", err);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const addToCart = async (item, quantity = 1) => {
//         const { _id, name, price, image, category, size } = item;
        
//         if (isAuthenticated) {
//             try {
//                 setLoading(true);
//                 await cartAPI.addToCart(_id, quantity);
//                 fetchCartItems();
//             } catch (err) {
//                 setError(err.message);
//                 console.error("Error adding to cart:", err);
//             } finally {
//                 setLoading(false);
//             }
//         } else {
//             removeFromCart(_id); // Ensure only one entry per item
//             setCartItems((prevItems) => [...prevItems, { _id, name, price, image, category, itemQuantity: quantity, size }]);
//         }
//     };

//     const removeFromCart = async (itemId) => {
//         if (isAuthenticated) {
//             try {
//                 setLoading(true);
//                 await cartAPI.removeFromCart(itemId);
//                 fetchCartItems();
//             } catch (err) {
//                 setError(err.message);
//                 console.error("Error removing from cart:", err);
//             } finally {
//                 setLoading(false);
//             }
//         } else {
//             setCartItems(cartItems.filter((item) => item._id !== itemId));
//         }
//     };

//     const updateCartItemQuantity = async (itemId, action) => {
//         if (isAuthenticated) {
//             try {
//                 setLoading(true);
//                 const newQuantity = action === "INC" ? 1 : -1;
//                 await cartAPI.updateCartItem(itemId, newQuantity);
//                 fetchCartItems();
//             } catch (err) {
//                 setError(err.message);
//                 console.error("Error updating cart item:", err);
//             } finally {
//                 setLoading(false);
//             }
//         } else {
//             setCartItems(
//                 cartItems.map((item) =>
//                     item._id === itemId ? { ...item, itemQuantity: action === "INC" ? item.itemQuantity + 1 : item.itemQuantity - 1 } : item
//                 )
//             );
//         }
//     };

//     const calculateTotalAmount = (currentCartItems) => {
//         const total = currentCartItems.reduce((acc, item) => acc + item.price * item.itemQuantity, 0);
//         setTotalAmount(total);
//     };

//     const clearCart = () => {
//         setCartItems([]);
//         if (!isAuthenticated) {
//             localStorage.removeItem("cart");
//         }
//     };

//     const syncCartWithServer = async () => {
//         if (isAuthenticated && cartItems.length > 0) {
//             try {
//                 setLoading(true);
//                 for (const item of cartItems) {
//                     await cartAPI.addToCart(item._id, item.itemQuantity);
//                 }
//                 localStorage.removeItem("cart");
//                 fetchCartItems();
//             } catch (err) {
//                 setError(err.message);
//                 console.error("Error syncing cart with server:", err);
//             } finally {
//                 setLoading(false);
//             }
//         }
//     };

//     return (
//         <CartItemsContext.Provider
//             value={{
//                 cartItems,
//                 totalAmount,
//                 addToCart,
//                 removeFromCart,
//                 updateCartItemQuantity,
//                 clearCart,
//                 syncCartWithServer,
//                 loading,
//                 error
//             }}
//         >
//             {children}
//         </CartItemsContext.Provider>
//     );
// };
