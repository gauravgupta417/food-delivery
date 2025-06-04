import jwt from "jsonwebtoken"
// to decode the token that the user has send it:->

const authMiddleware= async (req,res,next)=>{
 const {token}=req.headers;
    if(!token){
        return res.json({success:false,message:"Not Authorized Login Again"});
    }

    try{
        const token_decode=jwt.verify(token,process.env.JWT_SECRET);
        // when we decode the  token we get the user id.
         if (!req.body) req.body = {};
        req.body.userId=token_decode.id;
        next();
    }
    catch(error){
        console.log(error)
        res.json({success:false,message:"Error"});
    }

}
export default authMiddleware