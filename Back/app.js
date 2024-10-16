import express from "express";
import dotenv from 'dotenv';
import cors from "cors";
import mongoose from "mongoose";
import router from "./routes/bigRouter.js";
import notFound from "./utilities/notFound.js";
import lobbyController from './controllers/lobbyController.js'; // Import socket handler
import { Server } from "socket.io";
import http from 'http';
import cookieParser from 'cookie-parser'
import gameController from "./controllers/gameController.js";



dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded());




app.use("/api/v1", router);
// app.use(notFound);

const server = http.createServer(app);
// Socket.io setup
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL,
        methods: ["GET", "POST"],
        credentials: true
    },
    connectionStateRecovery: {}
});

// Socket event handling
lobbyController(io);
gameController(io);

const start = async() => {
    try {
        await mongoose.connect(process.env.MONGODB_URL_CONNECTION);
        server.listen(PORT, () =>{
            console.log(process.env.PORT);
            console.log(`Server is listening on port ${PORT}`);
    });
    } catch (error) {
        console.log(error);
    }
};

start();