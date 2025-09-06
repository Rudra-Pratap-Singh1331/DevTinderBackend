import mongoose from "mongoose";
import { User } from "../models/user.js";

const connectionAuthMiddleware = async (req,res,next) => {

  const fromUserId = req.user._id
  const toUserId = req.params.toUserId;

  //validating whether the toUserId is valid MongoID or not

  if(!mongoose.Types.ObjectId.isValid(toUserId)) return res.status(404).json({
    status:false,
    error:{
      message:"Invalid User Id",
    }
  })

  //checking wheter the sender and reciever are not the same
  if(toUserId.toString() ===  fromUserId.toString()) return res.status(404).json({
    status:false,
    error:{
      message:"You can't send request to yourself !", 
    }
  })

  const userReciever = await User.findById(toUserId);

  if(!userReciever) return res.status(404).json({
    success:false,
    error:{
      message:"Reciever User Doesn't Exist!",
    }
  })

  next();

}

export default connectionAuthMiddleware;