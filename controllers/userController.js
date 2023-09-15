const User = require("../models/User");
const CustomError = require("../errors")
const {createTokenUser, attachCookiesToResponse,checkPermissions} = require("../utils/")

const getAllUsers = async (req,res)=>{
    const users = await User.find({role:"user"}).select("-password") // get all users, dont include their pwd's
    res.status(200).json({users})
}

const getSingleUser = async (req,res)=>{
    const user = await User.findOne({_id:req.params.id}).select("-password") // get a user, dont include their pwd
    if(!user){
        throw new CustomError.NotFoundError(`No user found with id : ${req.params.id}`)
    }
    checkPermissions(req.user,user._id)
    res.status(200).json({user})
}

const showCurrentUser = async (req,res)=>{
    res.status(200).json({user:req.user})
}

const updateUser = async (req,res)=>{
    const {name,email} = req.body
    if(!name || !email){
        throw new CustomError.BadRequestError("Invalid credentials, provide name and email")
    }
    const user = await User.findOneAndUpdate({_id:req.user.userId},{email,name},{new:true,runValidators:true})
    const tokenUser = createTokenUser(user)
    attachCookiesToResponse({res,user:tokenUser})
    res.status(200).json({user:tokenUser})
}

const updateUserPassword = async (req,res)=>{
    const {oldPassword,newPassword} = req.body
    if(!oldPassword || !newPassword){
        throw new CustomError.BadRequestError("Invalid credentials, provide old password and new password")
    }
    const user = await User.findOne({_id:req.user.userId})
    if(!user){
        throw new CustomError.NotFoundError("User not found with the id " + req.user.userId)
    }
    const isPasswordCorrect = await user.comparePassword(oldPassword)
    if(!isPasswordCorrect){
        throw new CustomError.UnauthenticatedError("Password incorrect")
    }
    user.password = newPassword
    await user.save()
    res.status(200).json({msg:"Success! Password has been updated."})
}

module.exports = {getAllUsers, getSingleUser, showCurrentUser, updateUser, updateUserPassword}