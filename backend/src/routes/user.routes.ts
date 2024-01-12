import { Router, Request, Response } from "express";
import { ServerError, ServerHealthy, ServerInternalError } from "../utils/response.utils";
import { checkFollowConditions, checkUnfollowConditions, fetchUserUsingUsername, fetchUsername, setFollwersSchema, setUserSchemaFollower, unsetFollwersSchema, unsetUserSchemaFollower } from "../controller/user.controller";
import { fetchUser } from "../controller/auth.controller";

const router: Router = Router();

router.get("/", (req: Request, res: Response) => {
  try {
    return res.status(200).json(ServerHealthy);
  } catch (error) {
    if (error instanceof Error) return res.status(400).json(ServerError);
    return res.status(500).json(ServerInternalError);
  }
});

router.get("/:username", fetchUserUsingUsername)
router.post("/follow/:username", fetchUser, fetchUsername, checkFollowConditions, setFollwersSchema, setUserSchemaFollower)
router.post("/unfollow/:username", fetchUser, fetchUsername, checkUnfollowConditions, unsetFollwersSchema, unsetUserSchemaFollower)

export default router;
