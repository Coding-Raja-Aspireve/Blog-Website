import { Types } from "mongoose";
import Blog from "../schema/blog.schema";
import { BlogDocument } from "../types/documents.types";
import { CheckIfMapPresent, CreateNewBlog, DeleteBlog, DeleteMap, FetchMultipleBlogs, MapAuthorBlog, UpdateBlogData } from "../types/controller.types";
import Map from "../schema/map.schema";
import { handleDuplicateKeyError } from "./auth.utils";
import { BlogData } from "../types/schema.types";

export const fetchBlogWithIdArray: FetchMultipleBlogs = async (idArray) => {
  idArray && idArray.forEach((element, idx, arr) => {
    arr[idx] = new Types.ObjectId(element);
  });
  const blogList = await Blog.find({ blogId: {$in: idArray} });
  if (blogList === null || blogList === undefined)
    throw Error("Blog Not Found");
  return blogList;
};

export const fetchBlogWithUsername: FetchMultipleBlogs = async (username) => {
  const blogList = await Blog.find({ username: {$in: username} });
  console.log(blogList)
  if (blogList === null || blogList === undefined)
    throw Error("Blog Not Found");
  return blogList;
};

export const fetchBlogWithTagName: FetchMultipleBlogs = async (tag) => {
  console.log(tag)
  const blogList = await Blog.find({ tags: {$in: tag} });
  if (blogList === null || blogList === undefined)
    throw Error("Blog Not Found");
  return blogList;
};

export const fetchAllBlogs: FetchMultipleBlogs = async () => {
  const blogList = await Blog.find();
  console.log(blogList);
  if (blogList === null || blogList === undefined)
    throw Error("Blog Not Found");
  return blogList;
};

export const deleteBlog:DeleteBlog = async (blogs: Types.ObjectId[]) => {
  const deleteBlog = await Blog.deleteOne({ blogId: { $in: blogs } });
  if (!deleteBlog.acknowledged) throw Error("Blog Not Deleted");
  return;
};

export const deleteMap: DeleteMap = async (blogs: Types.ObjectId[]) => {
  const deleteBlog = await Map.deleteOne({ blogId: { $in: blogs } });
  if (!deleteBlog.acknowledged) throw Error("Blog Not Deleted Successfully");
  return;
};


export const updateBlogData: UpdateBlogData = async (BlogData) => {
  const isUpdated = await Blog.updateOne(
    { blogId: BlogData.blogId },
    { ...BlogData, updatedAt: Date.now() }
  );
  console.log(isUpdated);
  if (!isUpdated.acknowledged) throw Error("Blog has been Updated");
  return true;
};

export const checkIfMapPresent: CheckIfMapPresent = async (
  authorId: Types.ObjectId,
  blogId: Types.ObjectId
) => {
  const isPresent = await Map.findOne({ authorId, blogId });
  console.log(isPresent);
  if (isPresent === null || isPresent === undefined)
    throw Error("User is not Author");
  return true;
};

export const createNewBlog: CreateNewBlog = async ({
  title,
  summary,
  poster,
  passages,
  types,
  tags,
  username,
  readTime,
}: BlogData) => {
  const postBlog = new Blog({
    title,
    summary,
    poster,
    passages,
    types,
    tags,
    username,
    readTime,
  });
  return await postBlog.save().catch(handleDuplicateKeyError);
};

export const mapAuthorBlog: MapAuthorBlog = async (authorId, blogId) => {
  console.log("here")
  const mapped = new Map({ authorId, blogId });
  console.log(mapped)
  return await mapped.save().catch(handleDuplicateKeyError);
};

