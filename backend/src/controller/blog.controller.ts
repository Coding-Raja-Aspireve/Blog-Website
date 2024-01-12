import { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";
import Blog from "../schema/blog.schema";
import {
  checkIfMapPresent,
  createNewBlog,
  deleteBlog,
  deleteMap,
  fetchAllBlogs,
  fetchBlogWithIdArray,
  fetchBlogWithTagName,
  fetchBlogWithUsername,
  mapAuthorBlog,
  updateBlogData,
} from "../utils/blog.utils";
import {
  ControllerWithNext,
  ControllerWithoutNext,
} from "../types/controller.types";
import { BlogData, Comments, MapData, UserData } from "../types/schema.types";
import { dataProvidedIsNull } from "../utils/validation.utils";
import { UserDataWithAccessToken } from "../types/modified.types";
import { handleDuplicateKeyError } from "../utils/auth.utils";
import Map from "../schema/map.schema";
import {
  BlogDocument,
  MapDocument,
  UserDocument,
} from "../types/documents.types";

export const getBlogById: ControllerWithoutNext<Request, void> = async (
  req,
  res
) => {
  try {
    const _id = req.params.id;
    const blog = await fetchBlogWithIdArray([_id]);
    return res.status(200).json({ message: "Blog Fetched", blog });
  } catch (error) {
    if (error instanceof Error)
      return res.status(400).json({ error: error.message });
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getBlogByUsername: ControllerWithoutNext<Request, void> = async (
  req,
  res
) => {
  try {
    const _username = req.params.username;
    const blog = await fetchBlogWithUsername([_username]);
    console.log(blog);
    return res
      .status(200)
      .json({ message: "Blog Fetched", length: blog.length, blog });
  } catch (error) {
    if (error instanceof Error)
      return res.status(400).json({ error: error.message });
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getBlogByTags: ControllerWithoutNext<Request, void> = async (
  req,
  res
) => {
  try {
    const _tags = req.params.tags;
    console.log(_tags);
    const blog = await fetchBlogWithTagName([_tags]);
    console.log(blog);
    return res
      .status(200)
      .json({ message: "Blog Fetched", length: blog.length, blog });
  } catch (error) {
    if (error instanceof Error)
      return res.status(400).json({ error: error.message });
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getAllBlogs: ControllerWithoutNext<Request, void> = async (
  req,
  res
) => {
  try {
    const blog = await fetchAllBlogs();
    return res
      .status(200)
      .json({ message: "Blog Fetched", length: blog.length, blog });
  } catch (error) {
    if (error instanceof Error)
      return res.status(400).json({ error: error.message });
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const newBlog: ControllerWithNext<
  UserDataWithAccessToken,
  void
> = async (req, res, next) => {
  try {
    const {
      title,
      summary,
      poster,
      passages,
      types,
      tags,
      authorId,
      username,
      readTime,
    } = req.body;
    const data = dataProvidedIsNull([
      title,
      summary,
      poster,
      passages,
      types,
      tags,
      authorId,
      username,
      readTime,
    ]);
    if (data.isNull) throw Error("Complete Data not Provided");

    const postBlog = await createNewBlog({
      title,
      summary,
      poster,
      passages,
      types,
      tags,
      username,
      readTime,
    });

    if (postBlog === null || postBlog === undefined)
      throw Error("Blog Could Not be Posted");

    req.body = { ...req.body, blogId: postBlog.blogId };

    return next();
  } catch (error) {
    if (error instanceof Error)
      return res.status(400).json({ error: error.message });
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const mapAuthorToBlog: ControllerWithoutNext<
  UserDataWithAccessToken,
  void
> = async (req, res) => {
  try {
    const { authorId, blogId } = req.body;
    console.log(authorId, blogId);
    const isMapped = await mapAuthorBlog(authorId!, blogId!);
    console.log(isMapped)
    if (isMapped === null || isMapped === undefined)
      throw Error("Blog Could Not be Mapped");
    return res
      .status(200)
      .json({ message: "Blog Created Successfully", blogId });
  } catch (error) {
    if (error instanceof Error)
      return res.status(400).json({ error: error.message });
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const checkMapUserToBlog: ControllerWithNext<
  UserDataWithAccessToken,
  string
> = async (req, res, next) => {
  try {
    const { authorId, blogId } = req.body;
    const dataProvided = dataProvidedIsNull([blogId]);
    if (dataProvided.isNull) throw Error("Full Data not Provided");
    await checkIfMapPresent(authorId!, blogId!);
    console.log("User Present");
    return next();
  } catch (error) {
    if (error instanceof Error)
      return res.status(400).json({ error: error.message });
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateBlog: ControllerWithoutNext<
  UserDataWithAccessToken,
  void
> = async (req, res) => {
  try {
    const BlogData = req.body;
    console.log(BlogData);
    const isUpdated = await updateBlogData(BlogData);
    if (!isUpdated) throw Error("Blog not updated");
    return res
      .status(200)
      .json({ message: "Blog Updated Successfully", blogId: BlogData.blogId });
  } catch (error) {
    if (error instanceof Error)
      return res.status(400).json({ error: error.message });
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteBlogById: ControllerWithoutNext<
  UserDataWithAccessToken,
  void
> = async (req, res) => {
  try {
    const { blogId } = req.body;
    await deleteBlog([blogId!]);
    await deleteMap([blogId!]);
    return res.status(200).json({ message: "Blog Deleted" });
  } catch (error) {
    if (error instanceof Error)
      return res.status(400).json({ error: error.message });
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const incrementView:ControllerWithoutNext<UserDataWithAccessToken, void> = async (req, res) => {
  try {
    const {id} = req.params
    await incrementOnBlog([new Types.ObjectId(id)], "views", 1)
    return res.status(200).json({message: "View Updated"})
  } catch (error) {
    if (error instanceof Error)
      return res.status(400).json({ error: error.message });
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

export const incrementReshare:ControllerWithoutNext<UserDataWithAccessToken, void> = async (req, res) => {
  try {
    const {id} = req.params
    await incrementOnBlog([new Types.ObjectId(id)], "reshares", 1)
    return res.status(200).json({message: "Reshares Updated"})
  } catch (error) {
    if (error instanceof Error)
      return res.status(400).json({ error: error.message });
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

export const incrementLike:ControllerWithoutNext<UserDataWithAccessToken, void> = async (req, res) => {
  try {
    const {id, number} = req.params
    await incrementOnBlog([new Types.ObjectId(id)], "likes", parseInt(number))
    return res.status(200).json({message: "Likes Updated"})
  } catch (error) {
    if (error instanceof Error)
      return res.status(400).json({ error: error.message });
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

export const updateCommentToBlog: ControllerWithoutNext<UserDataWithAccessToken, void> = async (req, res) => {
  try {
    const {id} = req.params
    const {comment} = req.body

    if(comment === null || comment === undefined) throw Error("No Comment Provided")

    await updateComment([new Types.ObjectId(id)], comment)
    return res.status(200).json({message: "Comment Updated"})
  } catch (error) {
    if (error instanceof Error)
      return res.status(400).json({ error: error.message });
    return res.status(500).json({ error: "Internal Server Error" });
  }
}


export const updateComment = async (blogId: Types.ObjectId[], comment: Comments[]) => {
  console.log(comment)
  const updateBlog = await Blog.updateOne({blogId}, {comment})
  if(!updateBlog.acknowledged) throw Error("Comment Not Updated")
  return true;
}






export const incrementOnBlog = async (blogId: Types.ObjectId[], type: string, increment: Number) => {
  const updateViewerCount = await Blog.updateOne({blogId}, {$inc: {[type]: increment}})
  if(!updateViewerCount.acknowledged) throw Error("View Not Incremented")
}


