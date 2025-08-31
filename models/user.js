import mongoose from "mongoose";
import validator from 'validator'
const userSchema = new mongoose.Schema({

  fullName:{
    type:String,
    required:true,
    set : (value) => value? validator.escape(value):value,
    maxLength : [60,"Max length is 30"],
    minLength : [2,"Minimum length is 2"],
   
  },
  email:{
    type:String,
    lowercase:true,
    set : (value) => value ? validator.escape(value):value,
    validate:{
      validator:(value)=> /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value),
      message: ({value})=> `${value} is not a valid email` 
    },
    required:true,
    trim:true, // remove spaces white 
  },
  password:{
    type:String,
    required:true,
    minLength:8,
  },
  mobileNumber:{
    type:String,
    required:true,
    set : (value) => value ? validator.escape(value):value,
    validate:{
      validator: (value) => /^[0-9]{10}$/.test(value),
      message: ({value}) => `${value} is not valid mobile number`
    },
  },
  age:{
    type:Number,
    min: [18, "Age must be at least 18"],
    max: [100, "Age cannot exceed 100"],
  },
  gender:{
    type:String,
    set : (value) => value ? validator.escape(value):value,
    enum: {values:["Male","Female","Others"],message:"error"}
  },
  techStack:{
    type: [String],
    set : (arr) => Array.isArray(arr) ? arr.map((value)=>validator.escape(value)) : arr,
  }
},
{
  timestamps:true
}

)

export const User = mongoose.model("User",userSchema);
