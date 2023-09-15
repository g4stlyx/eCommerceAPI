const Order = require("../models/Order");
const Product = require("../models/Product");
const CustomError = require("../errors");
const { checkPermissions } = require("../utils");

const fakeStripeAPI = async ({amount,currency})=>{
    const client_secret = "someRandomValue"
    return {client_secret,amount}
}

const createOrder = async (req, res) => {
    const { items: cartItems, tax, shippingFee } = req.body;
  
    if (!cartItems || cartItems.length == 0) {
      throw new CustomError.BadRequestError("No cart items provided");
    }
    if (!tax || !shippingFee) {
      throw new CustomError.BadRequestError(
        "Please provide tax and shipping fee"
      );
    }
  
    let orderItems = [];
    let subtotal = 0;
  
    for (const item of cartItems) {
      const dbProduct = await Product.find({ _id: item.product });
      if (!dbProduct) {
        throw new CustomError.NotFoundError("No product with id:" + item.product);
      }
  
      const singleOrderItem = {
        amount: item.amount,
        name: item.name,
        price: item.price,
        image: item.image,
        product: item.product,
      };
      orderItems = [...orderItems, singleOrderItem]
      subtotal += item.amount * item.price
    }
  
    const total = tax + shippingFee + subtotal
    const paymentIntent = await fakeStripeAPI({
      amount: total, currency:"usd"
    })
  
    const order = await Order.create({
      orderItems,total,subtotal,tax,shippingFee,clientSecret:paymentIntent.client_secret,user:req.user.userId
    })
    res.status(201).json({order,clientSecret:order.clientSecret})
};


const getAllOrders = async (req, res) => {
  const orders = await Order.find({})
  res.status(200).json({orders,count:orders.length})
};

const getSingleOrder = async (req, res) => {
    const order = await Order.findOne({_id:req.params.id})
    if(!order){
        throw new CustomError.NotFoundError("No order with id:" + req.params.id);
    }
    checkPermissions(req.user, order.user)
    res.status(200).json({order})
};

const getCurrentUserOrders = async (req, res) => {
    const orders = await Order.find({user: req.user})
    res.status(200).json({orders,count:orders.length})
};

const updateOrder = async (req, res) => {
    const {paymentIntentId} = req.body
    const order = await Order.findOne({_id: req.params.id})
    if(!order){
        throw new CustomError.NotFoundError("No order with id:" + paymentIntentId);
    }
    checkPermissions(req.user, order.user)
    order.paymentIntentId = paymentIntentId
    order.status = "paid"
    await order.save()

    res.status(200).json({order})
};

module.exports = {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  createOrder,
  updateOrder,
};
