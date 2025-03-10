// const axios = require("axios")

// const CHAPA_URL = process.env.CHAPA_URL || "https://api.chapa.co/v1/transaction/initialize"
// const CHAPA_AUTH = process.env.CHAPA_AUTH // || register to chapa and get the key

// const initializePayment = async (req, res) => {

//     const config = {
//         headers: {
//             Authorization: CHAPA_AUTH
//         }
//     }

//     // chapa redirect you to this url when payment is successful
//     const CALLBACK_URL = "http://localhost:3000"

//     // a unique reference given to every transaction
//     const TEXT_REF = "tx-myecommerce12345-" + Date.now()

//     // form data
//     const data = {
//         amount: req.body.amount, 
//         currency: 'ETB',
//         email: 'ato@ekele.com',
//         first_name: 'Ato',
//         last_name: 'Ekele',
//         tx_ref: TEXT_REF,
//         callback_url: CALLBACK_URL
//     }

//     // post request to chapa
//     await axios.post(CHAPA_URL, data, config)
//         .then((response) => {
//             res.send(response.data.data.checkout_url)
//             console.log(response.data)
//         })
//         .catch((err) => console.log(err))

//         /* res.json({res: "message", url: CALLBACK_URL}) */
// }

// const verifyPayment = async (req, res) => {
//         await axios.get("https://api.chapa.co/v1/transaction/verify/" + req.params.id, config)
//             .then((response) => {
//                 console.log(response)
//                 res.json({message: response})
//             }) 
//             .catch((err) => {
//                 console.log("Payment can't be verfied", err)
//                 res.json({error: err})
//             })

//             res.json({message: "response", param: req.params.id})
// }

// module.exports = { initializePayment, verifyPayment }



const Razorpay = require("razorpay");
const crypto = require("crypto");
require("dotenv").config()

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const initializePayment = async (req, res) => {
    try {
        const options = {
            amount: req.body.amount * 100, // Amount in paisa
            currency: "INR",
            receipt: "tx-myecommerce12345-" + Date.now(),
            payment_capture: 1 // Auto capture payment
        };

        const order = await razorpay.orders.create(options);
        res.json({ success: true, order });
    } catch (error) {
        console.error("Error initializing payment:", error);
        res.status(500).json({ success: false, error: "Payment initialization failed" });
    }
};

const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        const generated_signature = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest("hex");

        if (generated_signature === razorpay_signature) {
            res.json({ success: true, message: "Payment verified successfully", payment_id: razorpay_payment_id });
        } else {
            res.status(400).json({ success: false, error: "Invalid payment signature" });
        }
    } catch (error) {
        console.error("Payment verification failed:", error);
        res.status(500).json({ success: false, error: "Payment verification failed" });
    }
};

module.exports = { initializePayment, verifyPayment };
