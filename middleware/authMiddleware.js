import JWT from 'jsonwebtoken';
import userModel from '../models/userModel.js';

export const requireSignIn = async(req,res,next) => {

    try{

        const decode = JWT.verify(req.headers.authorization,process.env.jwt_token);
        req.user = decode;
        next();
    }
    catch(error){
        console.log(error);
    }
};

export const isAdmin = async(req,res,next) => {

    try{
        const user = await userModel.findById(req.user._id);
        if(user.role!==1)
        {
            return res.send({
                success:false,
                message:"unauthorised access",
            })
        }
        else
        {
            next();
        }
    }
    catch(error){
        console.log(error);
        res.send({
            success:false,
            error,
        })
    }
}