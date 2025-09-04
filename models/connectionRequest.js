import mongoose from "mongoose";


const connectionRequestSchema = new mongoose.Schema({
  fromUserId:{
    type:mongoose.Schema.Types.ObjectId,
    required:true,
  },
  toUserId:{
    type:mongoose.Schema.Types.ObjectId,
    required:true,
  },
  status:{
    enum:{
      values : ["Pending" , "Accepted" , "Rejected" , "blocked"],
      message : `{VALUE} is not supported!`,
    }
  }
},
{
  timestamps:true,
}
)

export default ConnectionRequestModel = new mongoose.model("ConntectionRequest" , connectionRequestSchema);