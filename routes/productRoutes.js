import express from 'express';
import { isAdmin, requireSignIn } from '../middleware/authMiddleware.js';
import { braintreePaymentController, braintreeTokenController, createProductController, getCategoryProductsController, getProductsController, getRelatedProductsController, getSingleProductController, productCountController, productFiltersController, productPageController, productPhotoController, searchController, updateProductController } from '../controllers/productController.js';

import formidable from 'express-formidable';
import { deleteProductController } from './../controllers/productController.js';
import { updateCategoryController } from '../controllers/createCategoryController.js';

const router = express.Router();

router.post('/create-product',requireSignIn,isAdmin,formidable(),createProductController);

router.get('/get-products',getProductsController);

router.get('/get-singleproduct/:slug',getSingleProductController);

router.get('/product-photo/:id',productPhotoController);

router.delete('/delete-product/:id',deleteProductController);

router.post('/product-filters',productFiltersController);

router.get('/product-count',productCountController);

router.get('/product-page/:page',productPageController);

router.get('/product-search/:keyword',searchController);

router.get('/get-relatedProducts/:pid/:cid',getRelatedProductsController);

router.get('/get-categoryproducts/:slug',getCategoryProductsController);

router.get('/braintree/token',braintreeTokenController);

router.post('/braintree/payment',requireSignIn,braintreePaymentController);

router.put('/update-product/:id',requireSignIn,isAdmin,formidable(),updateProductController);
export default router;