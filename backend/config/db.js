import mongoose from "mongoose";

const connectDb=async() =>{
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log("DataBase Conencted")

    }
    catch(error){
        console.log("Db Error");

    }
}
export default connectDb;