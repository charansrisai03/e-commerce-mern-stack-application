import mongoose from 'mongoose';

import colors from 'colors';

const connectDB = async () => {

    try{
        const conn = await mongoose.connect(process.env.mongo_url);
        console.log(`connected to mongoDb database ${conn.connection.host} `.bgGreen.white);
    }
    catch (error){
        console.log("Error in connecting to the database".bgRed.white);
    }
}

export default connectDB;