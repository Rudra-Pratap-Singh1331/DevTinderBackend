import express from 'express'
import { userAuthMiddleware ,adminAuth} from './middleware/userAuthMiddleware.js';

const app = express();

// // app.use("/",(req,res)=>{
// //     res.send(`hello welcome to "/" route`)
// // })
// app.use("/hello/123",(req,res)=>{
//   res.send("hello at /hello/123")
// })

// app.use("/user",(req,res)=>{
//   res.send("app.use executed" )
// })

// app.get('/user/:id/:name/:pass',(req,res)=>{
//   const {id,name,pass} = req.params
//   const {userId} = req.query;
//   res.send({userId,id,name,pass})
// })

// app.post("/user",(req,res)=>{
//   res.send(
//     {
//       fullName : "Rudra Pratap Singh",
//       techStack : "MERN"
//     }
//   )
// })


//thoery copy next() heading example 

//first when next is used when the validation is successs or middleware doesnt send response to the client request lets take the example a middleware which will be used to validate the user ..
app.use("/admin",adminAuth)
app.use("/user",userAuthMiddleware)

app.post("/user",(req,res)=>{
  res.send("db me data save hogaya")
})
app.get("/admin",(req,res)=>{
  res.send("hehe m hi hoo admin>!")
})
app.get('/user',(req,res)=>{
  res.send("validated successfully!")
})

//suppose that was a get request now i have the get 




app.listen(4000,()=>{
  console.log("server running !!")
})