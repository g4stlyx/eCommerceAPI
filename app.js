require("dotenv").config() // to use .env variables
require("express-async-errors") // not to use try catch in every async function

//express
const express = require("express")
const app = express()

// rest of the packages
const morgan = require("morgan")
const cookieParser = require("cookie-parser")
const fileUpload = require("express-fileupload")
const path = require("path")

// security
const rateLimiter = require("express-rate-limit")
const helmet = require("helmet")
const xss = require("xss-clean")
const cors = require("cors")
const mongoSanitizer = require("express-mongo-sanitize")

//db
const connectDB = require("./db/connect") 

// routes
const authRouter = require("./routes/authRoute")
const userRouter = require("./routes/userRoute")
const productRouter = require("./routes/productRoute")
const reviewRouter = require("./routes/reviewRoute")
const orderRouter = require("./routes/orderRoute")

// middlewares
const notFoundMiddleware = require("./middleware/not-found") 
const errorHandlerMiddleware = require("./middleware/error-handler") 

app.set("trust proxy",1)
app.use(rateLimiter({
    windowMs:15 * 60* 1000,
    max:60
}))

app.use(helmet())
app.use(cors())
app.use(xss())
app.use(mongoSanitizer())

app.use(morgan("tiny")) // http request logger
app.use(express.json()) // req.body
app.use(cookieParser(process.env.JWT_SECRET)) // req.cookies - req.signedCookies
app.use(express.static(path.join(__dirname,"/public"))) // static files
app.use(fileUpload()) // req.files

app.get("/",(req,res)=>{
    console.log(req.signedCookies)
    res.send("e-commerce api")
})

app.use("/api/v1/auth",authRouter)
app.use("/api/v1/users",userRouter)
app.use("/api/v1/products",productRouter)
app.use("/api/v1/reviews",reviewRouter)
app.use("/api/v1/orders",orderRouter)

app.use(notFoundMiddleware) // 404
app.use(errorHandlerMiddleware) // other errors




const port = process.env.PORT || 5000
const start = async () => {
    try {
        await connectDB(process.env.MONGO_URL)
        app.listen(port,console.log(`Server is running on port ${port}`))
    }
    catch(error){
        console.log(error)
    }
}
start()