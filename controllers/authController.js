import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import OrderModel from "../models/OrderModel.js";
import userModel from "../models/userModel.js";

import JWT from "jsonwebtoken";



export const registerController = async (req,res) => {
    try{

    const {name,email,password,phone,address,answer} = req.body;
    if(!name)
    {
        res.send({message:"name is required"});
    }   
    if(!email)
    {
        res.send({message:"email is required"});
    }
    if(!password)
    {
        res.send({message:"password is required"});
    }
    if(!phone)
    {
        console.log("jhansi");
        res.send({message:"phoneNo is required"});
    }
    if(!address)
    {
        res.send({message:"address is required"});
    }
    if(!answer)
    {
        res.send({message:"answer is required"});
    }

    const existingUser =  await userModel.findOne({email});
    console.log(existingUser);
    if(existingUser)
    {
        return res.status(200).send({
            success:false,
            message:"Already registered, please login",
        })
    }

    const hps = await hashPassword(password);
    const newUser = await new userModel({name,email,phone,address,answer,password}).save();
    res.status(201).send({
        success:true,
        message:"registered successfully",
       newUser,
    })

    }
    catch(error){
        console.log(error);
        res.status(500).send({
            success:false,
            message:"error while registering",
            error,
        });

    }

};


export const loginController = async (req,res) => {

    try{
    const {email,password} = req.body;
    if(!password||!email)
    {
        return res.send({
            success:false,
            message:"Enter all the required fields"
        })
    }
    const user = await userModel.findOne({email});
    if(!user)
    {
        return res.status(404).send({
            success:false,
            message:"user has not registered"
        })
    }
    const match = comparePassword(password,user.password);
    console.log(password," ",user.password);
    if(password!=user.password)
    {
        return res.send({
            success:false,
            message:"invalid password"
        })
    }
    const token = await JWT.sign({_id:user._id},process.env.jwt_token,{
        expiresIn:"7d",
    });

    res.status(200).send({
        success:true,
        message:"logged in successfully",
        user:{
            name:user.name,
            email:user.email,
            phone:user.phone,
            address:user.address,
            role:user.role,
        },
        token,
    })

    }
    catch(error)
    {
        console.log(error);
        res.send({
            success:false,
            message:"error while logging in",
            error
        })
    }
}

export const forgotPasswordController = async(req,res) => {

    try{
        const {email,newPassword,answer} = req.body;

        if(!email){
            return res.send({
                success:false,
                message:"email is required"
            })
        }
        if(!answer){
            return res.send({
                success:false,
                message:"answer is required"
            })
        }
        if(!newPassword){
            return res.send({
                success:false,
                message:"new password is required"
            })
        }

        const user = await userModel.findOne({email,answer});
        if(!user)
        {
            return res.status(404).send({
                success:false,
                message:"invalid email or answer"
            })
        }
        const hashed =  await hashPassword(newPassword);
        await userModel.findByIdAndUpdate(user._id,{password:newPassword});
        res.status(200).send({
            success:true,
            message: "password has been reset successfully"
        })
    }
    catch(error)
    {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"error has occurred",
            error,
        })
    }
}

export const testController = async(req,res) => {
    

    try{
        res.send("protected route");
    }
    catch(error)
    {
        console.log(error);
        res.send({
            success:false,
            message:error
        })
    }
}

export const updateProfileController = async(req,res) =>{
    try{
        const {name,email,password,phone,address} = req.body;
        const user =  await userModel.findById(req.user._id)
        if(password&&password.length<6)
        {
            return res.json({error:"password is required and length should be min 6 characters"})
        }
        const updatedUser =  await userModel.findByIdAndUpdate(req.user._id,{
            name:name || user.name,
            password:password || user.password,
            phone: phone || user.phone,
            address: address|| user.address
        },{new:true})
        res.status(200).send({
            success:true,
            message:"Profile updated successfully",
            updatedUser
        })
    }
    catch(error)
    {
        console.log(error);
        res.status(400).send({
            success:false,
            message:"error in updating profile",
            error
        })
    }
}

export const getOrdersController = async(req,res) => {
    try{ 
        const orders  = await OrderModel.find({buyer:req.user._id}).populate("products","-photo").populate("buyer","name");
        res.json(orders)
    }
    catch(error)
    {
        console.log(error)
        res.status(500).send({
            success:false,
            message:"error in getting orders",
            error
        })
    }
}

export const getAllOrdersController = async(req,res) => {
    try{ 
        const orders  = await OrderModel.find({}).populate("products","-photo").populate("buyer","name").sort({createdAt:-1});
        res.json(orders)
    }
    catch(error)
    {
        console.log(error)
        res.status(500).send({
            success:false,
            message:"error in getting orders",
            error
        })
    }
}

export const updateStatusController = async(req,res) => {
    try{

        const {status} = req.body;
        const {orderId} = req.params;
        const orders = await OrderModel.findByIdAndUpdate(orderId,{status},{new:true})

        res.json(orders)
    }  
    catch(error)
    {
        console.log(error)
        res.status(500).send({
            success:false,
            message:"error in updating status".
            error
        })
    }
}
