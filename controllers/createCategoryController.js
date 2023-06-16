import categoryModel from "../models/categoryModel.js";

import slugify from "slugify";

export const createCategoryController = async (req,res) => {

    try{
        const {name} = req.body;
    if(!name)
    {
        return res.status(401).send({
            success:false,
            message:"name is required",
        })
    }
    const existingCategory = await categoryModel.findOne({name});
    if(existingCategory)
    {
        return res.status(200).send({
            success:false,
            message:"a categiry with that name already exists"
        })
    }
    const newCategory = await categoryModel({name,slug:slugify(name)}).save();
    res.status(201).send({
        success:true,
        message:"category create successfully",
        newCategory
    })
    }
    catch(error)
    {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"error is creating category",
            error
        })
    }
    
}

export const updateCategoryController = async (req,res) => {

    try{
        const {name} = req.body;
        const {id} = req.params;
        const category = await categoryModel.findByIdAndUpdate(id,{name,slug:slugify(name)},{new:true});
        res.status(200).send({
            success:true,
            message:"category updated successfully",
            category,
        });
    }
    catch(error)
    {
        console.log(error);
        res.satus(500).send({
            success:false,
            message:"error while updating",
            error
        })
    }
}

export const getCategoriesCntroller = async(req,res)=>{
    try{

        const categories = await categoryModel.find({});
        res.status(200).send({
            success:true,
            message:"retrieved all categories successfully",
            categories
        })
    }
    catch(error){
        console.log(error);
        res.status(500).send({
            success:false,
            error,
            message:"error while retrieving categories"
        })
    }
}

export const getSingleCategoryController = async(req,res) => {
    try{
        const {slug} = req.params;
        const category = await categoryModel.findOne({slug});
        res.status(200).send({
            success:true,
            message:"successfully fetched the category",
            category
        })
    }
    catch(error){
        console.log(error);
        res.status(500).send({
            success:false,
            message:"error while fetching the category",
            error
        })
    }
}

export const deleteCategoryController = async(req,res) => {
    try{
        const {id} = req.params;
        await categoryModel.findByIdAndDelete(id);
        res.status(200).send({
            success:true,
            message:"successfully deleted"
        })
    }
    catch(error)
    {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"error while deleting the category",
            error
        })
    }
}

