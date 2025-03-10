import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/App';
import { CartProvider } from "./Context/CartItemsContext";


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <CartProvider>
<App />
</CartProvider>
);