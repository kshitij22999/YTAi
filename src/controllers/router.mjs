import userRouter from "./userController.mjs";
import fileRouter from "./fileController.mjs";
import { Router } from "express";
import authRouter from "./authController.mjs";

const router = Router();

router.use(userRouter);
router.use(fileRouter);
router.use(authRouter);

export default router;

