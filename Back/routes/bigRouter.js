import express from "express"
import { addUser, login } from "../controllers/userController.js";

const router = express.Router();

router.route("/register").post(addUser);
router.route("/login").post(login);
router.route("/lobby"/*, authCheck()*/).get(/*chat*/);

export default router;