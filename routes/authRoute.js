import express from 'express';

import { loginController, registerController, testController,forgotPasswordController, updateProfileController, getOrdersController, getAllOrdersController, updateStatusController } from '../controllers/authController.js';
import { requireSignIn,isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register',registerController);

router.post('/login',loginController);

router.get('/test',requireSignIn,isAdmin,testController);

router.post('/forgot-password',forgotPasswordController);

router.get('/user-auth',requireSignIn,(req,res)=>{
    res.status(200).send({
        ok:true
    })
});

router.get('/admin-auth',requireSignIn,isAdmin,(req,res)=>{
    res.status(200).send({
        ok:true
    })
});

router.put('/profile',requireSignIn,updateProfileController)

router.get('/orders',requireSignIn,getOrdersController);

router.get('/allorders',requireSignIn,isAdmin,getAllOrdersController);

router.put('/updatestatus/:orderId',requireSignIn,isAdmin,updateStatusController)
export default router;