import mongoose from "mongoose";


const OrderSchema = new mongoose.Schema({
   products:[{
    type:mongoose.ObjectId,
    ref:'Product'
   },],

   payment:{},
   buyer:{
    type:mongoose.ObjectId,
    ref:'users'
   },
   status:{
    type:String,
    default:"Not processed",
    enum:["Not processed","processing","shipped","delivered","cancelled"],
   }

},{timestamps:true})

export default mongoose.model('Order',OrderSchema);