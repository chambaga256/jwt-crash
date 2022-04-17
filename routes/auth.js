const router =require("express").Router();
const {check, validationResult} = require("express-validator");
const{users} =require("../db");
const jwt =require("jsonwebtoken")
const bcrypt = require("bcrypt");
const res = require("express/lib/response");
const { required } = require("nodemon/lib/config");


router.post('/signup', [
check("email","please provide a valid email")
.isEmail(),
check("password" ,"please provide a password that is grater than five characters")
.isLength({ 
  min:6
})
],async(req,res)=>{
    const { password ,email}= req.body;
    // VALIDATE THE  INPUT
const errorrs = validationResult(req)
        
if(!errorrs.isEmpty()){
  return res.status(480).json({
    errorrs:errorrs.array()
  })
}
// VALIDATE IF THE USER DOESN'T EXIST


let user =users.find((user)=>{
return user.email===email
})
if(user){
   return res.status(480).json({
    "errorrs":[
      {
        "msg":"This user already exists!",
      }
    ]
  })
}
const hashedPassword =await bcrypt.hash(password,10)


users.push({
  email,
  password:hashedPassword
})

const token = await jwt.sign({
  email
}, "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5",{
  expiresIn:3500000
})

res.json({
  token
})

router.post('/login', async(req,res)=>{
  const {password,email}=req.body;
  let user =users.find((user)=>{
    return user.email==email
  });
  if(!user){
    return res.status(480).json({
     "errorrs":[
       {
         "msg":"Invalid Crendials",
       }
     ]
   })
 }

})

  const isMatch =await bcrypt.compare(password, user.password)
  if(!isMatch){
    return res.status(480).json({
     "errorrs":[
       {
         "msg":"Invalid Crendials",
       }
     ]
   });const token = await jwt.sign({
    email
  }, "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5",{
    expiresIn:3500000
  })
  
  res.json({
    token
  })
  }

});



router.get("/all",(req,res)=>{
  res.json();
})


module.exports=router;