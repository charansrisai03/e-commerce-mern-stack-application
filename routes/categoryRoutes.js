import express from "express";

const router = express.Router();
import { requireSignIn,isAdmin } from '../middleware/authMiddleware.js';
import { createCategoryController, deleteCategoryController, getCategoriesCntroller, getSingleCategoryController, updateCategoryController } from "../controllers/createCategoryController.js";

router.post('/create-category',requireSignIn,isAdmin,createCategoryController);

router.put('/update-category/:id',requireSignIn,isAdmin,updateCategoryController);

router.get('/get-categories',getCategoriesCntroller);

router.get('/single-category/:slug',getSingleCategoryController);

router.delete('/delete-category/:id',requireSignIn,isAdmin,deleteCategoryController);



export default router