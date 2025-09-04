import express from 'express' 
import { User } from '../models/user.js';
import validator from "validator";
import bcrypt from "bcrypt" 
import jwt from "jsonwebtoken";
const app = express();

const authRouter = express.Router();

authRouter.post("/login",async (req,res) => {
  try{
  const {email,password} = req.body;
  const user  = await User.findOne({email})
  if(!user) return res.send("Invalid Credentials")
  const value = await bcrypt.compare(password,user.password);
  if(value){ 
    //jwt 

    const authToken = jwt.sign({id:user._id},process.env.JWT_SECRET_KEY);

    res.cookie("token",authToken)
    res.send("Login Successfull!") }
  else{
    res.send("password invalid")
  } 
  }catch(error)
  {
    res.send(404).json({error})
  }
})

authRouter.post("/signup",async(req,res)=>{
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

authRouter.post("/logout" , (req,res)=>{

  res.cookie("token" , null , {
    expires: new Date(Date.now()),
  })
  res.json( {
    success:true,
    message:"Logged Out Successfully!"
  } )

})

export default authRouter;