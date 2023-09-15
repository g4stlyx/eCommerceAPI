const mongoose = require('mongoose');
const ReviewSchema = mongoose.Schema({
    rating:{
        type:Number,
        min:1,
        max:5,
        required:[true,"Please provide rating"]
    },
    title:{
        type:String,
        trim:true,
        required:[true,"Review Title is required"],
        maxlength:100
    },
    comment:{
        type:String,
        required:[true,"Review Comment is required"],
        maxlength:400
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true
    },
    product:{
        type:mongoose.Schema.ObjectId,
        ref:"Product",
        required:true
    }
},
{timestamps:true}
)

ReviewSchema.index({product:1,user:1},{unique:true}) // a user can create only one review for a single product
// statics originally
ReviewSchema.statics.calculateAverageRating = async function(productId){
    const result = await this.aggregate([
        {$match:{product:productId}},
        {$group:{
            _id:null,
            averageRating:{$avg:"$rating"},
            numOfReviews: {$sum:1}
        }}
    ])
    try{
        await this.model("Product").findOneAndUpdate({_id:productId},{
            averageRating: Math.ceil(result[0]?.averageRating || 0),
            numOfReviews: result[0]?.numOfReviews || 0,
        })
    }
    catch(err){
        console.log(err)
    }
    console.log("it is called")
}

ReviewSchema.post("save", async function(){
    await this.constructor.calculateAverageRating(this.product)
    
})

module.exports = mongoose.model("Review",ReviewSchema)