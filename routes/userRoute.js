import express from "express"
import { User } from "./models/user.js";
import validator from "validator";
import jwt from "jsonwebtoken";


const app = express();

const userRouter = express.Router();


userRouter.get("/user/profile", async(req,res)=>{

  try{

    const {token} = req.cookies;
    const validToken = jwt.verify(token , process.env.JWT_SECRET_KEY);
    res.json(
      {
        status:true,
        profileAuth : "authorized",
      }
    )

  }catch(error){
    res.json(error)
  }

})
userRouter.delete("/user/delete",async(req,res)=>{
  try{
      const cookie = req.cookies
      const validToken = jwt.verify(cookie.token , process.env.JWT_SECRET_KEY); //if valid return the payload object if error flow directs to cache block;
      console.log(validToken)
      const userExist = await User.findOne({_id:validToken.id});
      if(!userExist) return res.json({
        success:false,
        message:"user does not exist!"
      })
      const deleted = await User.findByIdAndDelete(validToken.id)
      res.cookie("token" , null , {
        expires:new Date(Date.now()),
      })
      res.send(deleted)
  }catch(error)
  {
      res.json(error.message)
  }
})

userRouter.patch("/user/profile/update",async(req,res)=>{
  const fields = ["id","fullName","mobileNumber","techStack"];
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
      const updated = await User.findByIdAndUpdate(req.body.id , req.body , {new : true , runValidators:true}); //new true means return the updated doc
  
       res.status(200).json({message:"updated",value:updated})
    }
  }
  catch(error){

    res.send(error)

  }
})


export default userRouter;