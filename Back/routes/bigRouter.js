import express from "express"
import { addUser } from "../controllers/userController.js";

const router = express.Router();

router.route("/register").get().post(addUser);
router.route("/login").get(authentic);
router.route("/lobby", authCheck()).get(chat);

export default router;