const User = require("../models/User")
const CustomError = require("../errors/index")
const {attachCookiesToResponse, createTokenUser} = require("../utils")

const register = async (req, res) =>{
    const {name,email,password} = req.body
    const emailAlreadyExists = await User.findOne({email})
    if(emailAlreadyExists){
        throw new CustomError.BadRequestError(`Email already exists`)
    }

    // the first registered user is an admin
    const isFirstAccount = await User.countDocuments({}) === 0
    const role = isFirstAccount ? "admin" : "user"

    const user = await User.create({name,email,password,role})

    const tokenUser = createTokenUser(user)
    attachCookiesToResponse({res, user:tokenUser})
    res.status(201).json({user:tokenUser})
}

const login = async (req, res) => {
    const {email,password} = req.body
    if (!email || !password) {
        throw new CustomError.BadRequestError("Email and password are required")
    }
    const user = await User.findOne({email})
    if(!user){
        throw new CustomError.UnauthenticatedError("Invalid Credentials")
    }
    const isPasswordCorrect = await user.comparePassword(password)
    if(!isPasswordCorrect){
        throw new CustomError.UnauthenticatedError("Invalid Credentials")
    }
    const tokenUser = createTokenUser(user)
    attachCookiesToResponse({res, user:tokenUser})
    res.status(200).json({user:tokenUser})
}

const logout = async (req, res) => {
    res.cookie("token","logout",{
        httpOnly:true,
        expires:new Date(Date.now()),
    })
    res.status(200).json({msg:"user logged out!"})
}

module.exports = {register,login,logout}