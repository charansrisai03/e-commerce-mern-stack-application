import fs from 'fs';
import productModel from '../models/productModel.js';

import slugify from 'slugify';
import categoryModel from '../models/categoryModel.js';

import braintree from 'braintree';
import OrderModel from '../models/OrderModel.js';

import dotenv from 'dotenv'

dotenv.config()



var gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHANT_ID ,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY,
  });


export const createProductController = async(req,res) => {
    try{

        const {name,slug,description,quantity,price,category,shipping} = req.fields;
        const {photo} = req.files;

        if(!name){return res.status(401).send({success:false,message:"name is required"})};
        if(!description){return res.status(401).send({success:false,message:"description is required"})};
        if(!quantity){return res.status(401).send({success:false,message:"quantity is required"})};
        if(!price){return res.status(401).send({success:false,message:"price is required"})};
        if(!category){return res.status(401).send({success:false,message:"category is required"})};
        if(photo && photo.size > 1000000){return res.status(401).send({success:false,message:"photo is required and size should be less than 1mb"})};

        const product = new productModel({...req.fields,slug:slugify(name)});
        if(photo)
        {
            product.photo.data = fs.readFileSync(photo.path);
            product.photo.contentType = photo.type;
        }
        await product.save();
        res.status(200).send({
            success:true,
            message:"product created successfully",
            product
        })
    }
    catch(error){
        console.log(error);
        res.status(500).send({
            success:true,
            message:"error while creating the product",
            error
        })
    }
}

export const getProductsController = async(req,res)=>{
    try{
        const products = await productModel.find({}).select('-photo').populate('category').limit(10).sort({createdAt:-1});
        res.status(200).send({
            success:true,
            message:"fetched all products successfully",
            count:products.length,
            products
        })
    }
    catch(error)
    {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"error in fetching products",
            error
        })
    }
}

export const getSingleProductController = async(req,res) => {
    try{
        const {slug} = req.params;
        const product = await productModel.findOne({slug}).select('-photo').populate('category');
        res.status(200).send({
            success:true,
            message:"fetched the product successfully",
            product
        })
    }
    catch(error)
    {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"error in fetching the products",
            error
        })
    }
}

export const productPhotoController = async(req,res) => {
    try{
        
        const {id} = req.params;
        const product = await productModel.findById(id).select('photo');
        if(product.photo.data)
        {
            res.set('Content-type',product.photo.contentType);
            res.status(200).send(
                product.photo.data)
        }
    }
    catch(error){
        console.log(error);
        res.status(500).send({
            success:false,
            message:"error while getting photo",
            error
        })
    }
}

export const deleteProductController = async(req,res) => {
    try{
        await productModel.findByIdAndDelete(req.params.id).select('-photo');
        res.status(200).send({
            success:true,
            message:"deleted successfully"
        })
    }
    catch(error)
    {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"error while deleting the product",
            error
        })
    }
}

export const updateProductController = async(req,res) => {
    try{

        const {name,slug,description,quantity,price,category,shipping} = req.fields;
        const {photo} = req.files;

        if(!name){return res.status(401).send({success:false,message:"name is required"})};
        if(!description){return res.status(401).send({success:false,message:"description is required"})};
        if(!quantity){return res.status(401).send({success:false,message:"quantity is required"})};
        if(!price){return res.status(401).send({success:false,message:"price is required"})};
        if(!category){return res.status(401).send({success:false,message:"category is required"})};
        if(photo && photo.size > 1000000){return res.status(401).send({success:false,message:"photo is required and size should be less than 1mb"})};

        const product = await productModel.findByIdAndUpdate(req.params.id,{...req.fields,slug:slugify(name)},{new:true});
        if(photo)
        {
            product.photo.data = fs.readFileSync(photo.path);
            product.photo.contentType = photo.type;
        }
        await product.save();
        res.status(200).send({
            success:true,
            message:"product created successfully",
            product
        })
    }
    catch(error){
        console.log(error);
        res.status(500).send({
            success:true,
            message:"error while creating the product",
            error
        })
    }
}

export const productFiltersController = async(req,res) => {

    try{

        const {checked,radio} = req.body;
        let args = {}
        if(checked.length > 0) args.category = checked;
        if(radio.length) args.price = {$gte:radio[0],$lte:radio[1]}

        const products = await productModel.find(args);
        res.status(200).send({
            success:true,
            message:"filtered successfully",
            products
        })
    }
    catch(error){
        console.log(error);
        res.status(500).send({
            success:true,
            message:"error while filtering the products",
            error
        })
    }
}

export const productCountController = async(req,res) => {
    try{

        const total = await productModel.find({}).select('-photo').estimatedDocumentCount();

        res.status(200).send({
            success:true,
            total
        })

    }
    catch(error){
        console.log(error);
        res.status(500).send({
            success:true,
            message:"error while counting the products",
            error
        })
    }

}

export const productPageController = async(req,res) => {
    try{
        const perPage = 5;
        const page =  req.params.page ? req.params.page : 1;

        const pageProducts = await productModel.find({}).select('-photo').skip((page-1)*perPage).limit(perPage).sort({createdAt:-1});

        res.status(200).send({
            success:true,
            pageProducts
        })

    }
    catch(error){
        console.log(error);
        res.status(500).send({
            success:true,
            message:"error while fetching the product page",
            error
        })
    }

}

export const searchController = async(req,res) => {
    try{
        const {keyword} = req.params;
        const results = await productModel.find({
            $or:[
                {name:{$regex: keyword, $options:"i" }},
                {description:{$regex: keyword,$options:"i"}}
            ]
        }).select('-photo') ;

        res.json(results);
    }
    catch(error)
    {
        console.log(error);
        res.status(500).send({
            success:true,
            message:"error while fetching the product page",
            error
        })   
    }
}

export const getRelatedProductsController = async(req,res) => {
    try{

        const {pid,cid} = req.params;
        const relatedProds = await productModel.find({
            category:cid,
            _id:{$ne:pid}
        }).select('-photo').limit(3).populate('category');

        res.status(200).send({
            success:true,
            relatedProds
        })
    }
    catch(error)
    {
        console.log(error);
        res.status(400).send({
            success:false,
            error,
            message:"error in fetching related products"
        })
    }
}

export const getCategoryProductsController = async(req,res) => {
    try{
        const {slug} = req.params;
        const category = await categoryModel.findOne({slug:req.params.slug});
        const catprods = await productModel.find({category}).populate('category');
        res.status(200).send({
            success:true,
            message:"success",
            category,
            catprods
        })

    }
    catch(error)
    {
        console.log(error);
        res.status(400).send({
            success:false,
            error,
            message:"error in fetching category products"
        })
    }
};


export const braintreeTokenController = async(req,res) => {
    try{
       
        gateway.clientToken.generate({},function(err,response){
            if(err)
            res.status(500).send(err)
            else
            res.send(response)
        })

    }
    catch(error)
    {
        console.log(error);
    }
};

export const braintreePaymentController = async(req,res) => {
    try{
    const {cart,nonce} = req.body
    let total = 0;
    cart.map((i)=>{
        total+=i.price
    })
    let newTransaction = gateway.transaction.sale({
        amount:total,
        paymentMethodNonce:nonce,
        options:{
            submitForSettlement:true
        },
    },
    function(err,results){
        if(results){
             const newOrder = new OrderModel({
                products:cart,
                payment:results,
                buyer:req.user._id
             }).save()

             res.json({ok:true})
        }
        else
        {
            res.send(err)
        }
        
    })

    }
    catch(error)
    {
        console.log(error);
        
    }
};