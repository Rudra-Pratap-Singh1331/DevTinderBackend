export const userAuthMiddleware = (req,res,next) => {

  const incomingToken ="12e12"
  const dbToken = "12e12"
  if(incomingToken!== dbToken) return res.status(401).json({"messsage" : "unauthorized user!"})
  next()
}


export const adminAuth = (req,res,next)=>{
  const adminToken ="admin"
  const dbAdminToken = "admin"
  if(adminToken!=dbAdminToken) return res.status(403).json({"message":"chor agaya"})
  next();
}
