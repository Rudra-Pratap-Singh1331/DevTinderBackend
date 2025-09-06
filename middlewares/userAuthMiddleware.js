import { User } from "../models/user.js";
import jwt from "jsonwebtoken";
const userAuthMiddleware = async (req,res,next) => {
  try
  {
    const { token } = req.cookies;

    const jwtPayload =  jwt.verify(token , process.env.JWT_SECRET_KEY)

    const loggedInUser = await User.findById(jwtPayload.id)

    if(!loggedInUser) return res.status(401).json({
      status : false,
      message : "User doesn't exist"
    })

    req.user = loggedInUser;

    next()
  }
  catch(error)
  {
    res.status(401).json(
      {
        status : false,
        message : error.message,
      }
    )
  }

}

export default userAuthMiddleware;