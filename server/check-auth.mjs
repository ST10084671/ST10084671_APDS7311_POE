import jwt from "jsonwebtoken";

const checkauth=(req,res,next)=>
{
    try{
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token,"secret_this_should_be_longer_than_it_is")
        next();
    }
    catch(error)
    {
        res.status(401).json({
            message:"Invalid Token"
        });
    }
};
export default checkauth;