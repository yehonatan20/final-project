import express from "express";
import dotenv from 'dotenv';
import cors from "cors";
import mongoose from "mongoose";
import router from "./routes/bigRouter.js";
import notFound from "./utilities/notFound.js";


dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

app.use("/api/v1", router);
app.use(notFound);

const start = async() => {
    try {
        await mongoose.connect("mongodb+srv://yehonatan20:123@yehonatan.yylq3.mongodb.net/sheshbeshDB?retryWrites=true&w=majority&appName=yehonatan")
        app.listen(PORT, () =>{
            console.log(process.env.PORT);
            console.log(`Server is listening on port ${PORT}`);
    });
    } catch (error) {
        console.log(error);
    }
};

start();