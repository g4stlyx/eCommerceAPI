const mongoose = require("mongoose")
const ProductSchema = new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:[true, "Please provide a product name"],
        maxlength:[100, "Name cannot be more thean 100 characters"]
    },
    price:{
        type:Number,
        required:[true, "Please provide a price"],
        default: 0
    },
    description:{
        type:String,
        required:[true, "Please provide a description"],
        maxlength:[1000, "description cannot be more than 1000 characters"]
    },
    image:{
        type:String,
        default:"/uploads/1.jpeg"
    },
    category:{
        type:String,
        required:[true, "Please provide a category"],
        enum:["office","kitchen","bedroom"],
    },
    company:{
        type:String,
        required:[true, "Please provide a company"],
        enum:{
            values:["ikea","liddy","marcos"],
            message:"{VALUE} is not a supported"
        },
    },
    colors:{
        type:[String],
        required:true,
        default:["#000"]
    },
    featured:{
        type:Boolean,
        default:false
    },
    freeShipping:{
        type:Boolean,
        default:false
    },
    inventory:{
        type:Number,
        required:true,
        default:15
    },
    averageRating:{
        type:Number,
        default:0
    },
    numOfReviews:{
        type:Number,
        default:0
    },
    user:{
        type:mongoose.Types.ObjectId,
        ref:"User",
        required:true
    }
    },
    {
    timestamps:true, // createdAt,updatedAt
    toJSON:{virtuals:true}, // to access reviews
    toObject:{virtuals:true} // to access reviews
    }
)

// virtual property, to access reviews when products are fetched
ProductSchema.virtual("reviews",{
    ref:"Review",
    localField:"_id",
    foreignField:"product",
    justOne:false,    
})

ProductSchema.pre("remove",async function(next){
    await this.model("Review").deleteMany({product:this._id})
})


module.exports = mongoose.model("Product",ProductSchema)