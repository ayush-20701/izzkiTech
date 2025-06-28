const express = require('express')
const dotenv = require('dotenv')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')
dotenv.config()
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log('MongoDB connected!')
    } catch (error) {
        console.error(error)
    }
}
connectDB()
app.use(express.json())
// CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3001'
  ],
  credentials: true,
  optionsSuccessStatus: 200
}
app.use(cors(corsOptions))

const PORT = process.env.PORT || 5000
app.listen(PORT, ()=>{
    console.log(`🔊 Server running on port ${PORT}`);
})

const productRoutes = require('./routes/Routes')
app.use('/admin/products', productRoutes)