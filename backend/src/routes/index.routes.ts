import blog from "./blog.routes";
import auth from "./auth.routes";
import user from "./user.routes";
import { Router, Request, Response } from "express";
import { ServerHealthy, ServerError, ServerInternalError } from "../utils/response.utils";

const router = Router();

router.use("/auth", auth);
router.use("/blog", blog);
router.use("/user", user);

router.get("/", (req: Request, res: Response) => {
  try {
    return res.status(200).json(ServerHealthy);
  } catch (error) {
    if (error instanceof Error) return res.status(400).json(ServerError);
    return res.status(500).json(ServerInternalError);
  }
});

export default router
