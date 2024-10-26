import userRouter from "./userController.mjs";
import fileRouter from "./fileController.mjs";
import { Router } from "express";
import authRouter from "./authController.mjs";
import videoUploadRouter from "./videoUploadController.mjs";

const router = Router();

router.use(userRouter);
router.use(fileRouter);
router.use(authRouter);
router.use(videoUploadRouter);

export default router;

