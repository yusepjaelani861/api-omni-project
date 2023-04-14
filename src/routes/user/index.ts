import express from "express";
import UserController from "../../controllers/user";
import { protect } from "../../middleware/auth";

const router = express.Router()
const user = new UserController();

router
    .route("/auth/login")
    .post(user.auth.validation('login'), user.auth.login);

router
    .route("/auth/register")
    .post(user.auth.validation('register'), user.auth.register);

router
    .route("/auth/me")
    .get(protect, user.auth.authMe);

export default router;