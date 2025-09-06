import express from "express"
import { User } from "../models/user.js";
import validator from "validator";
import jwt from "jsonwebtoken";
import userAuthMiddleware from "../middlewares/userAuthMiddleware.js";


const app = express();

const userRouter = express.Router();


userRouter.get("/profile", userAuthMiddleware,async(req,res)=>{

  try{
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
userRouter.delete("/delete", userAuthMiddleware, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const deleted = await User.findByIdAndDelete(loggedInUser._id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.cookie("token" , null , {
      expires:new Date(Date.now()),
    })
    
    return res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
userRouter.patch("/profile/update",userAuthMiddleware,async(req,res)=>{
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
      const updated = await User.findByIdAndUpdate(req.body.id , req.body , {new : true , runValidators:true}); //new true means return the updated doc
  
       res.status(200).json({message:"updated",value:updated})
    }
  }
  catch(error){

    res.send(error)

  }
})


export default userRouter;