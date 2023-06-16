import express from 'express';

import colors from 'colors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoute.js';

import productRoutes from './routes/productRoutes.js';

import path from 'path'
import { fileURLToPath } from 'url';



import createCategoryRoutes from './routes/categoryRoutes.js';
import cors from 'cors';

dotenv.config();

connectDB();


const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/v1/auth',authRoutes);
app.use('/api/v1/category',createCategoryRoutes);
app.use(express.static(path.join(__dirname,"./e-client/build")))


app.use('/api/v1/product',productRoutes);

app.use('*',function(req,res){
    res.sendFile(path.join(__dirname,'./e-client/build/index.html '))
})

const PO = process.env.PORT;
const MO = process.env.MODE;
app.listen(PO,()=>{
    console.log(`server is running on ${MO} on port ${PO}`.bgCyan.white);
        
})