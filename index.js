import express from "express"
import dotenv from "dotenv"
import connectDB from "./config/dbConfig.js"
import { User } from "./models/user.js"; 
import cookieParser from "cookie-parser";
import authRouter from "./routes/authRoute.js";
import userRouter from "./routes/userRoute.js";
import connectionRouter from "./routes/connection.js";
const app = express();

dotenv.config()

app.use(express.json())

app.use(cookieParser())

app.use("/",authRouter);

app.use("/user",userRouter);

app.use("/connection",connectionRouter)

//feed of user that fetches all the user for the homepage of the user currently logged in !!
app.get("/users",async(req,res)=>{

  //FINDING THE DB USER HAVING NAME PROVIDED IN REQ BODY
  // const users = await User.find({fullName:req.body.fullName})

  //FINDING ALL THE USER

  // const users = await User.find({});

  //finding by mongodb id

  // const users = await User.findById({})

  // if(users.length==0) return res.send("no user found")
  // res.send(users)

  const users = await User.find({});
  res.send(users);


})





connectDB()
.then(()=>{
  console.log("DB connected Successfully!")
  app.listen(process.env.PORT,()=>{

  console.log("server is running!!")
  //we are doing this because we are not using cjs but if we use cjs we can call the connectDB function insed the configDB and reuire the module above like require("./config/dbConfig") we have already studeied that NodeJS wrap each module into IIFE and will execute the moment the reuire will be readed the fucntion will get execute and db will get connected

})
}).catch((error)=>{
  console.log(error)
})





































