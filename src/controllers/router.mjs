import userRouter from "./userController.mjs";
import fileRouter from "./fileController.mjs";
import { Router } from "express";

const router = Router();

router.use(userRouter);
router.use(fileRouter);

export default router;

