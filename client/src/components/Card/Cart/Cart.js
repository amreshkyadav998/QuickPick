import { Fragment, useContext, useState } from 'react';
import { CartItemsContext } from '../../../Context/CartItemsContext';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Badge from '@mui/material/Badge';
import CartCard from './CartCard/CartCard';
import './Cart.css';
import Button from '@mui/material/Button';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  minWidth: '320px',
  width: '90%',
  maxWidth: '500px',
  height: 'auto',
  bgcolor: 'background.paper',
  border: '5px solid #FFE26E',
  borderRadius: '15px',
  boxShadow: 24,
  p: 4,
  overflowY: 'auto',
};

const Cart = () => {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [openCheckoutModal, setOpenCheckoutModal] = useState(false);
    const handleCheckoutOpen = () => setOpenCheckoutModal(true);
    const handleCheckoutClose = () => setOpenCheckoutModal(false);

    const cartItems = useContext(CartItemsContext);
    
    const handleCheckout = async () => {
        if (cartItems.totalAmount > 0) {
            try {
                const response = await fetch("https://quickpick-backend.onrender.com/api/payment/initialize", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ amount: cartItems.totalAmount}) // Convert INR to paise
                });

                const data = await response.json();

                const options = {
                    key: process.env.REACT_APP_RAZORPAY_KEY_ID, 
                    amount: data.order.amount,
                    currency: "INR",
                    name: "Your Shop",
                    description: "Order Payment",
                    order_id: data.order.id,
                    handler: function (response) {
                        console.log("Payment Successful:", response);
                        handleCheckoutOpen(); // Show success modal
                    },
                    prefill: {
                        name: "John Doe",
                        email: "john@example.com",
                        contact: "9876543210"
                    },
                    theme: {
                        color: "#3399cc"
                    },
                    modal: {
                        ondismiss: function() {
                            console.log("Checkout modal closed by user");
                        }
                    }
                };

                const razorpay = new window.Razorpay(options);
                razorpay.open();
            } catch (error) {
                console.error("Payment initialization failed:", error);
                alert("Payment initialization failed");
            }
        }
    };

    return (
        <Fragment>
            <Badge badgeContent={cartItems.items.length} color="error">
                <ShoppingCartIcon color="black" onClick={handleOpen} sx={{ width: '35px', cursor: 'pointer' }} />
            </Badge>
            <Modal open={open} onClose={handleClose}>
                <Box sx={style}>
                    <div className="cart__header">
                        <h2>Your Cart</h2>
                    </div>
                    <div className="cart__items__container">
                        <div className="cartItems">
                            {cartItems.items.length === 0 ? 
                                <div className="cart__empty">Empty cart!</div> : 
                                <div className="shop__cart__items">
                                    {cartItems.items.map((item) => <CartCard key={item._id} item={item} />)}
                                </div>
                            }
                            {cartItems.items.length > 0 &&
                                <div className="options">
                                    <div className="total__amount">
                                        <div className="total__amount__label">Total Amount:</div>
                                        <div className="total__amount__value">₹{cartItems.totalAmount}.00</div>
                                    </div>
                                    <div className="checkout">
                                        <Button variant="outlined" onClick={handleCheckout}>Checkout</Button>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                </Box>
            </Modal>
            <Modal open={openCheckoutModal} onClose={handleCheckoutClose}>
                <Box sx={style}>
                    <div className="d-flex w-100 h-100 justify-content-center align-items-center">
                        <h2>Your checkout was successful</h2>
                    </div>
                </Box>
            </Modal>
        </Fragment>
    );
};

export default Cart;
