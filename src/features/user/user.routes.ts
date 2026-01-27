import { Router } from "express";
import userCtrl from "./user.ctrl";
import { AuthMiddleware } from "../../middlewares/auth.middlewares";

const userRouter = Router();

userRouter.get("/me", AuthMiddleware, userCtrl.profile);
userRouter.get("/profile/:userId", AuthMiddleware, userCtrl.getOneProfile);
userRouter.put("/update", AuthMiddleware, userCtrl.update);
userRouter.delete("/delete", AuthMiddleware, userCtrl.delete);
userRouter.post("/search", AuthMiddleware, userCtrl.userSearch);

export default userRouter;
