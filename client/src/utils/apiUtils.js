// client/src/utils/apiUtils.js

const BASE_URL = 'http://localhost:5000/api';

// Get auth token from localStorage
const getToken = () => localStorage.getItem('token');

// Helper function for authenticated requests
const authFetch = async (url, options = {}) => {
    const token = getToken();
    
    if (!token) {
        throw new Error('Not authenticated');
    }
    
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers
    };
    
    const config = {
        ...options,
        headers
    };
    
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
    }
    
    return data;
};

// Cart API calls
export const cartAPI = {
    getCart: async () => {
        return await authFetch(`${BASE_URL}/cart`);
    },
    
    addToCart: async (itemId, quantity = 1) => {
        return await authFetch(`${BASE_URL}/cart`, {
            method: 'POST',
            body: JSON.stringify({ itemId, quantity })
        });
    },
    
    updateCartItem: async (itemId, quantity) => {
        return await authFetch(`${BASE_URL}/cart/${itemId}`, {
            method: 'PUT',
            body: JSON.stringify({ quantity })
        });
    },
    
    removeFromCart: async (itemId) => {
        return await authFetch(`${BASE_URL}/cart/${itemId}`, {
            method: 'DELETE'
        });
    }
};

// Wishlist API calls
export const wishlistAPI = {
    getWishlist: async () => {
        return await authFetch(`${BASE_URL}/wishlist`);
    },
    
    addToWishlist: async (itemId) => {
        return await authFetch(`${BASE_URL}/wishlist`, {
            method: 'POST',
            body: JSON.stringify({ itemId })
        });
    },
    
    removeFromWishlist: async (itemId) => {
        return await authFetch(`${BASE_URL}/wishlist/${itemId}`, {
            method: 'DELETE'
        });
    }
};