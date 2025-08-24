import { configDotenv } from "dotenv";
import express from "express"
import dotenv from "dotenv"
import connectDB from "./config/dbConfig.js"
import { User } from "./models/user.js";
import validator from "validator";
import mongoSanitize from 'express-mongo-sanitize'
const app = express();

dotenv.config()

app.use(express.json())

app.use(mongoSanitize())

app.get("/users",async(req,res)=>{

  //FINDING THE DB USER HAVING NAME PROVIDED IN REQ BODY
  // const users = await User.find({fullName:req.body.fullName})

  //FINDING ALL THE USER

  // const users = await User.find({});

  //finding by mongodb id

  const users = await User.findById({})

  if(users.length==0) return res.send("no user found")
  res.send(users)
})

app.delete("/user",async(req,res)=>{

  const deleted = await User.findByIdAndDelete(req.query.userId)
  res.send(deleted)

})

app.patch("/user/:id/update",async(req,res)=>{

  try{

  const updated = await User.findByIdAndUpdate(req.params.id , req.body , {new : true , runValidators:true});
  
  res.send(["updates",updated])

  }
  catch(error){

    res.send(error)

  }
})

app.post("/signup",async(req,res)=>{
  const fields = ["fullName","email","mobileNumber","age","gender","techStack"];
  try{
    const isPostAllowed = Object.keys(req.body).every((key)=>fields.includes(key));

    const error = [] ;
    
    if(!isPostAllowed){

      return res.send("Extra fields are not allowed!!")

    }

    if(!validator.isEmail(req.body.email)){

      error.push(`${req.body.email} Incorrect email`)

    }

    if (!req.body.fullName || req.body.fullName.length < 2) {

      error.push("Full name must be at least 2 characters long.");

    }

    if (!validator.isMobilePhone(req.body.mobileNumber)) {

      error.push("Mobile number is invalid.");

    }

    if (!req.body.age || req.body.age < 18) {

      error.push("Age must be 18 or above.");

    }

    if(error.length>0){

      return res.status(400).json({ errors : error })

    }
    else{
      
      const user = new User(req.body);

      await user.save();

      res.status(200).send("User Created Successfully!")

    }

  }
  catch(error){

    if (error.code === 11000) {

      return res.status(400).send("This email is already registered.");

    }

    res.status(500).send(error.message);

  }

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





































