import express from "express"
import cors from "cors"
import { connectDB } from "./config/db.js"
import foodRouter from "./routes/foodRoute.js"
import userRouter from "./routes/userRoute.js"
import 'dotenv/config'
import cartRouter from "./routes/cartRoute.js"
import orderRouter from "./routes/orderRoute.js"
import restaurantRouter from "./routes/restaurantRoute.js";



//app config
const app = express()
const port = 4000

//middleware 
app.use(express.json()) // requests from frontend will be parsed to backend by this json
app.use(cors()) //to use any backend from frontend


//DB Connection
connectDB();


// API endpoints
app.use("/api/food", foodRouter)

// to access files on frontend
app.use("/images", express.static('uploads'))

app.use("/api/user", userRouter)

app.use("/api/cart", cartRouter)

app.use("/api/order", orderRouter)
 
app.use("/api/restaurant", restaurantRouter);





// decrypt data from server
app.get("/", (req, res) => {    
    res.send("API Working")    
})                            


// to run express server
app.listen(port, () => {
    console.log(`Server Started on http://localhost:${port}`)
})





// mongodb+srv://hamdi100junior:DbPass123@cluster0.keyc2.mongodb.net/?