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
    required:true,
    type:String,
    enum:{
      values : ["Ignored" , "Interested" , "Accepted" , "Rejected"],
    },
  }
},
{
  timestamps:true,
}
)

connectionRequestSchema.pre("save", async function () {

  const connectionObject = this;

  const ReqExist = await ConnectionRequestModel.findOne({
    $or:[ 
      {fromUserId :connectionObject.fromUserId ,toUserId : connectionObject.toUserId} , {
      fromUserId : connectionObject.toUserId ,toUserId : connectionObject.fromUserId
      }
    ]
})
if(ReqExist) throw new Error("Connection Request Already Exist!")

})

export const ConnectionRequestModel = mongoose.model("ConnectionRequest", connectionRequestSchema);