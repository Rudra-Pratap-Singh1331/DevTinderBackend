import express from 'express'

import userAuthMiddleware from "../middlewares/userAuthMiddleware.js"
import connectionAuthMiddleware from '../middlewares/connectionAuthMiddleware.js';
import {ConnectionRequestModel} from '../models/connectionRequest.js';

const app = express()

const connectionRouter = express.Router();

connectionRouter.post("/request/send/:typeOfReq/:toUserId",userAuthMiddleware,connectionAuthMiddleware, async (req,res)=>{

try{
  const allowedReqStatus = ["Ignored" , "Interested"];

  const isStatusValid = allowedReqStatus.includes(req.params.typeOfReq);

  if(!isStatusValid) return res.status(401).json({
    status:false,
    error:{
      message:"Not a Valid Status!"
    }
  })

  const toUserId = req.params.toUserId;

  const fromUserId = req.user._id;

  //now let check validate that the user can only send req one time to another user and that user then cant send the req to the user who has already send the request to that user HWERE WE WILL USE DB QUERY  and also make this check with the help of a mongoose midlleware "pre" in the Schema  let's go!!  CAUTION pre doestnot have acces to req,res parameter it has oncly access to next()

  const connectionRequestDocument = new ConnectionRequestModel({
    fromUserId,
    toUserId,
    status: req.params.typeOfReq,
  })

  const connectionReqSend = await connectionRequestDocument.save();

  res.status(200).json({
    success:true,
    connectionReqSend,
  })
}catch(error){

  res.status(500).json({
    status:false,
    error:{
      message: error.message,
    }
  })

}
})

export default connectionRouter;