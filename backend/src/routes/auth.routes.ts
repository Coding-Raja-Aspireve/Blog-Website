import { Router, Request, Response } from "express";
import { ServerError, ServerHealthy, ServerInternalError } from "../utils/response.utils";
import { login, register, updateUser, sendTokensToUser, fetchUser, updateUserPassword, returnUser } from "../controller/auth.controller";

const router: Router = Router();



router.get("/", (req: Request, res: Response) => {
  try {
    return res.status(200).json(ServerHealthy);
  } catch (error) {
    if (error instanceof Error) return res.status(400).json(ServerError);
    return res.status(500).json(ServerInternalError);
  }
});

router.post("/register", register, sendTokensToUser)
router.post("/login", login, sendTokensToUser)
router.post("/update", fetchUser, updateUser, sendTokensToUser)
router.post("/updatePassword", fetchUser, updateUserPassword, sendTokensToUser)
router.post("/fetchUser", fetchUser, returnUser)

export default router;
