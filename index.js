import { configDotenv } from "dotenv";
import express from "express"
import dotenv from "dotenv"
import connectDB from "./config/dbConfig.js"
const app = express();

dotenv.config()

app.get('/',(req,res)=>{
  res.send("hello")
})

connectDB()
.then(()=>{
  console.log("DB connected Successfully!")
  app.listen(process.env.PORT,()=>{

  console.log("server is running!!")
  //we are doing this because we are not using cjs but if we use cjs we can call the connectDB function insed the configDB and reuire the module above like require("./config/dbConfig") we have already studeied that NodeJS wrap each module into IIFE and will execute the moment the reuire will be readed the fucntion will get execute and db will get connected

})
}).catch((error)=>{
  console.log(error.message)
})





































