import express from "express"
import { User } from "../models/user.js";
import validator from "validator";
import userAuthMiddleware from "../middlewares/userAuthMiddleware.js";
import { ConnectionRequestModel } from "../models/connectionRequest.js";


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

userRouter.get("/connections",userAuthMiddleware,async (req,res)=>{

  try {
    const loggedInUserConnections = await ConnectionRequestModel.find({               //if no user empty array []  is returned 
    $or:[
      {
        toUserId : req.user._id,
        status: "Accepted"
      },
      {
        fromUserId:req.user._id,
        status:"Accepted",
      } 
    ]
  }).populate("fromUserId" , ["fullName","age","gender","techStack"]).populate("toUserId",["fullName","age","gender","techStack"])

  const data = loggedInUserConnections.map((users)=>{
    if(users.fromUserId._id.toString()===req.user._id.toString()) return users.toUserId;
    return users.fromUserId
  })

  res.status(200).json({
    status:true,
    data: data
  })
  } catch (error) {
    
    res.status(500).json({
      status:false,
      error:{
        message: error.message
      }
    })

  }

})

userRouter.get("/connections/requests",userAuthMiddleware, async (req,res) => {

  try {
    const requestsPending = await ConnectionRequestModel.find({
      toUserId:req.user._id,
      status:"Interested",
    }).populate("fromUserId",["fullName","age","gender","techStack"]);

    const data = requestsPending.map((users)=> users.fromUserId)

    return res.status(200).json({
      status:true,
      data:data,
    })

  } catch (error) {
    return res.status(500).json({
      status:false,
      message: "error:" + error.message,
    })
  }

})

userRouter.get("/feed",userAuthMiddleware,async (req,res)=>{

  //finding all the connection that we dont want to show in the user feed

  const page = parseInt(req.query.page) || 1;
  let limit = parseInt(req.query.limit) || 10;
  const skip = (page-1)*limit;

  // sanitizing limit

  limit = limit>20 ? 10 : limit;

  const existingConnectionUser = await ConnectionRequestModel.find({
    $or:[
      {toUserId:req.user._id},{
        fromUserId:req.user._id
      }
    ]
  }).select("fromUserId toUserId");

  //now here we have to make very if condition for getting unique id because in some document we may the sender or in some we may the reciever

  const userNotToBeShowOnTheFeed = new Set();

  //pushing th eexistingConnectionUser in the set

  existingConnectionUser.forEach((users)=>{
    userNotToBeShowOnTheFeed.add(users.fromUserId);
    userNotToBeShowOnTheFeed.add(users.toUserId);
  })

  //finding the rest of the remaining users

  const UsersToBeShowOnTheFeed = await User.find(
   {
    $and:[
      {
        _id : { $nin : Array.from(userNotToBeShowOnTheFeed) },    //conver the Set into Array
      },
      {
        _id: { $ne : req.user._id }
      }
    ]
   }
  ).select("fullName age techStack gender").skip(skip).limit(limit)

  res.status(200).json({
    status:true,
    data: UsersToBeShowOnTheFeed
  })

})

export default userRouter;