import { Router } from "express";
// import { User } from '../models/user.model';
import { authCallback } from "../controllers/auth.controller.js";

const router = Router();

router.post("/callback", authCallback)

export default router;

