import { Router, Request, Response } from "express";
import { ServerError, ServerHealthy, ServerInternalError } from "../utils/response.utils";
import { checkMapUserToBlog, deleteBlogById, getAllBlogs, getBlogById, getBlogByTags, getBlogByUsername, incrementLike, incrementReshare, mapAuthorToBlog, newBlog, updateBlog, updateCommentToBlog } from "../controller/blog.controller";
import { fetchUser } from "../controller/auth.controller";
import { incrementView } from "../controller/blog.controller";

const router: Router = Router();

router.get("/", (req: Request, res: Response) => {
  try {
    return res.status(200).json(ServerHealthy);
  } catch (error) {
    if (error instanceof Error) return res.status(400).json(ServerError);
    return res.status(500).json(ServerInternalError);
  }
});

router.get("/blogs", getAllBlogs )
router.get("/tags/:tags", getBlogByTags)
router.post("/createBlog", fetchUser, newBlog, mapAuthorToBlog )
router.post("/updateBlog", fetchUser, checkMapUserToBlog, updateBlog)
router.delete("/deleteBlog", fetchUser, checkMapUserToBlog, deleteBlogById)
router.post("/incrementView/:id", fetchUser, incrementView)
router.post("/reshare/:id", fetchUser, incrementReshare)
router.post("/likeBlog/:id/:number", fetchUser, incrementLike)
router.post("/comment/:id", fetchUser, updateCommentToBlog)
router.get("/blogs/:username", getBlogByUsername)
router.get("/:id", getBlogById)

export default router;
