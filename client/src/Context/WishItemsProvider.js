import { useContext, useState } from "react";
import { CartItemsContext } from "./CartItemsContext";
import { WishItemsContext } from "./WishItemsContext";

const WishItemsProvider = (props) => {
    const [ wishItems, setWishItems ] = useState([])

    const cartItems = useContext(CartItemsContext)

    const addToCartHandler = (item) => {
        cartItems.addItem(item, 1)
    }

    const addToWishHnadler = (item) => {
        const { _id, name, price, image, category, size } = item;
        removeFromWishHandler(item)
        setWishItems((prevItems) => [...prevItems, {_id, name, price, image, category, size, itemQuantity: 1}])
    }

    const removeFromWishHandler = (item) => {
        setWishItems(wishItems.filter((prevItem) => prevItem._id !== item._id))
    }

    const wishItemsCtx = {
        items: wishItems,
        addItem: addToWishHnadler,
        removeItem: removeFromWishHandler,
        addToCart: addToCartHandler
    }

    return ( 
        <WishItemsContext.Provider value={wishItemsCtx}>
            {props.children}
        </WishItemsContext.Provider>
     );
}
 
export default WishItemsProvider;


// import React, { useState, useEffect, useContext } from 'react';
// import { WishItemsContext } from './WishItemsContext';
// import { AuthContext } from './AuthContext';
// import { wishlistAPI } from '../utils/apiUtils';

// export const WishItemsProvider = ({ children }) => {
//     const [wishItems, setWishItems] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);
//     const { isAuthenticated } = useContext(AuthContext);

//     useEffect(() => {
//         if (isAuthenticated) {
//             fetchWishlistItems();
//         } else {
//             const localWishlist = localStorage.getItem('wishlist');
//             if (localWishlist) {
//                 setWishItems(JSON.parse(localWishlist));
//             }
//         }
//     }, [isAuthenticated]);

//     useEffect(() => {
//         if (!isAuthenticated && wishItems.length > 0) {
//             localStorage.setItem('wishlist', JSON.stringify(wishItems));
//         }
//     }, [wishItems, isAuthenticated]);

//     const fetchWishlistItems = async () => {
//         try {
//             setLoading(true);
//             const data = await wishlistAPI.getWishlist();
//             setWishItems(data);
//             setError(null);
//         } catch (err) {
//             setError(err.message);
//             console.error('Error fetching wishlist:', err);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const addToWishlist = async (item) => {
//         if (isAuthenticated) {
//             try {
//                 setLoading(true);
//                 await wishlistAPI.addToWishlist(item._id);
//                 fetchWishlistItems();
//             } catch (err) {
//                 setError(err.message);
//                 console.error('Error adding to wishlist:', err);
//             } finally {
//                 setLoading(false);
//             }
//         } else if (!wishItems.some(wishItem => wishItem._id === item._id)) {
//             setWishItems([...wishItems, item]);
//         }
//     };

//     const removeFromWishlist = async (itemId) => {
//         if (isAuthenticated) {
//             try {
//                 setLoading(true);
//                 await wishlistAPI.removeFromWishlist(itemId);
//                 fetchWishlistItems();
//             } catch (err) {
//                 setError(err.message);
//                 console.error('Error removing from wishlist:', err);
//             } finally {
//                 setLoading(false);
//             }
//         } else {
//             setWishItems(wishItems.filter(item => item._id !== itemId));
//         }
//     };

//     const clearWishlist = () => {
//         setWishItems([]);
//         if (!isAuthenticated) {
//             localStorage.removeItem('wishlist');
//         }
//     };

//     const syncWishlistWithServer = async () => {
//         if (isAuthenticated && wishItems.length > 0) {
//             try {
//                 setLoading(true);
//                 for (const item of wishItems) {
//                     await wishlistAPI.addToWishlist(item._id);
//                 }
//                 localStorage.removeItem('wishlist');
//                 fetchWishlistItems();
//             } catch (err) {
//                 setError(err.message);
//                 console.error('Error syncing wishlist with server:', err);
//             } finally {
//                 setLoading(false);
//             }
//         }
//     };

//     return (
//         <WishItemsContext.Provider
//             value={{
//                 wishItems,
//                 addToWishlist,
//                 removeFromWishlist,
//                 clearWishlist,
//                 syncWishlistWithServer,
//                 loading,
//                 error,
//             }}
//         >
//             {children}
//         </WishItemsContext.Provider>
//     );
// };
