import mongoose from "mongoose";

const userSchema = mongoose.Schema({

  fullName:{
    type:String,
  },
  email:{
    type:String,
  },
  mobileNumber:{
    type:Number,
  },
  age:{
    type:Number,
  },
  gender:{
    type:String,
  },
  techStack:{
    type:String
  }

})

export const User = mongoose.model("User",userSchema);
