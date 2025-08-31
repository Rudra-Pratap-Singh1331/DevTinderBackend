import { configDotenv } from "dotenv";
import express from "express"
import dotenv from "dotenv"
import connectDB from "./config/dbConfig.js"
import { User } from "./models/user.js";
import validator from "validator";
import bcrypt from "bcrypt" 
const app = express();

dotenv.config()

app.use(express.json())


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
  const fields = ["fullName","mobileNumber","techStack"];
    try{
    const isPostAllowed = Object.keys(req.body).every((key)=>fields.includes(key));

    const error = [] ;
    
    if(!isPostAllowed){

      return res.send("Extra fields are not allowed!!")

    }


    if (Object.keys(req.body).includes("fullName") &&  (!req.body.fullName || req.body.fullName.length < 2)) {

      error.push("Full name must be at least 2 characters long.");

    }

    if (Object.keys(req.body).includes("mobileNumber") && (!validator.isMobilePhone(req.body.mobileNumber))) {

      error.push("Mobile number is invalid.");

    }

    if(error.length>0){

      return res.status(400).json({ errors : error })

    }else{
      const updated = await User.findByIdAndUpdate(req.params.id , req.body , {new : true , runValidators:true}); //new true means return the updated doc
  
       res.status(200).json({message:"updated",value:updated})
    }
  }
  catch(error){

    res.send(error)

  }
})

app.post("/signup",async(req,res)=>{
  const {fullName,email,mobileNumber,age,gender,techStack,password} = req.body;
  try{

    const error = [] ;
    const result =  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/.test(password)
    if(!result){

      error.push("Has minimum 8 characters in length. At least one uppercase English lette. At least one lowercase English letter. At least one digit. At least one special character")
    }
    // if(!email) throw new Error("Email required");
    if(!validator.isEmail(req.body.email)){

      error.push({field : "Email", message:`${req.body.email} Incorrect email`})

    }

    if (!req.body.fullName || req.body.fullName.length < 2) {

      error.push({field:"Fullname",message:"Full name must be at least 2 characters long."});

    }

    if (!validator.isMobilePhone(req.body.mobileNumber)) {

      error.push({field:"Mobile Number" , message:"Mobile number is invalid."});

    }

    if (!req.body.age || req.body.age < 18) {

      error.push({field:"Age",message:"Age must be 18 or above."});

    }

    if(error.length>0){

      return res.status(400).json({ error });

    }
    else{
      const hashPassword = await bcrypt.hash(password,10)
      const user = new User({
        fullName,
        email,
        mobileNumber,
        age,
        gender,
        techStack,
        password:hashPassword
      });

      await user.save();

      res.status(200).send("User Created Successfully!")

    }
  }
  
  catch(error){

    if (error.code === 11000) {

      return res.status(400).send("This email is already registered.");

    }
    if(error.name == "ValidationError"){
      return res.status(500).json(error)
    }

    res.status(500).json({error})

  }

})

app.post("/login",async (req,res) => {
  const {email,password} = req.body;
  const user  = await User.findOne({email})
  if(!user) return res.send("Invalid Credentials")
  const value = await bcrypt.compare(password,user.password);
  if(value){ 
    res.cookie("token" , "shjdkjahikahfkjashf2qiu3h28u72h4k2j43oihfztq3t9073496tkv23jgfur72382y7982y5")
    res.send("Login Successfull!") }
  else{
    res.send("password invalid")
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
  console.log(error)
})





































