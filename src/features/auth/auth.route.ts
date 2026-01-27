import { Router } from "express";
import authCtrl from "./auth.ctrl";

const AuthRouter = Router();

AuthRouter.post("/register", authCtrl.register);
AuthRouter.post("/login", authCtrl.login);
AuthRouter.post("/logout", authCtrl.logout);
AuthRouter.post("/refresh", authCtrl.refresh);

export default AuthRouter;
