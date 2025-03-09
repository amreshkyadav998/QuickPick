const express = require("express")
const app = express()
const cors = require("cors")
require("dotenv").config()
const connectDB = require("./config/db")
const PORT = process.env.PORT || 5000
const authRoutes = require('./routes/auth');
const cartRoutes = require('./routes/cart');
const wishlistRoutes = require('./routes/wishlist');
const { notFound, errorHandler } = require('./middlewares/errorMiddleware');

// middlewares
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(express.static("public"));

// connect to the mongodb database
connectDB() 

// Routes
app.use('/api/items', require("./routes/items"))
app.use('/api/payment', cors(), require("./routes/payment"))
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);

// Error middleware
app.use(notFound);
app.use(errorHandler);
app.listen(PORT, console.log("Server is running on port ", PORT))