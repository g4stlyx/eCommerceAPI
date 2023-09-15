const Product = require("../models/Product");
const Review = require("../models/Review");
const CustomError = require("../errors")
const path = require("path")

const createProduct = async (req,res)=>{
    req.body.user = req.user.userId
    const product = await Product.create(req.body)
    res.status(201).json({product})
}
const getAllProducts = async (req,res)=>{
    const products = await Product.find({})
    .populate({path:"user",select:"name email"})
    .populate("reviews")
    
    res.status(200).json({products,count:products.length})
}
const getSingleProduct = async (req,res)=>{
    const product = await Product.findOne({_id: req.params.id})
    .populate({path:"user",select:"name email"})
    .populate("reviews")

    if(!product){
        throw new CustomError.NotFoundError(`Product with id ${req.params.id} not found`)
    }
    res.status(200).json({product})
}
const updateProduct = async (req,res)=>{
    const product = await Product.findOneAndUpdate({_id: req.params.id},req.body,{runValidators:true,new:true})
    if(!product){
        throw new CustomError.NotFoundError(`Product with id ${req.params.id} not found`)
    }
    res.status(200).json({product})
}
const deleteProduct = async (req,res)=>{
    const product = await Product.findOne({_id: req.params.id})
    if(!product){
        throw new CustomError.NotFoundError(`Product with id ${req.params.id} not found`)
    }

    await product.deleteOne()
    await Review.deleteMany({product:req.params.id}) 
    await Review.save()
    res.status(200).json({msg:"Success! Product removed."})
}
const uploadImage = async (req,res)=>{
    console.log(req.body.files)
    if(!req.files){
        throw new CustomError.BadRequestError("No file uploaded")
    }
    const productImage = req.files.image
    if(!productImage.mimetype.startsWith("image")){
        throw new CustomError.BadRequestError("Please upload an image")
    }
    const maxSize = 1024 * 1024
    if(productImage.size > maxSize){
        throw new CustomError.BadRequestError("Please upload an image smaller than 1MB")
    }
    const imagePath = path.join(__dirname,"../public/uploads/"+ `${productImage.name}`)
    await productImage.mv(imagePath)
    res.status(200).json({image:"/uploads/"+productImage.name})
}

module.exports = {createProduct,getAllProducts,getSingleProduct,updateProduct,deleteProduct,uploadImage}