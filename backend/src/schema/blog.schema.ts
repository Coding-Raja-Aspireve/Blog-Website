import { Schema, model, Document, Types } from "mongoose";
import { BlogDocument } from "../types/documents.types";

// Create the Blog schema
const BlogSchema = new Schema<BlogDocument>({
  blogId: {
    type: Schema.Types.ObjectId,
    default: new Types.ObjectId(),
    required: true,
  },
  title: {
    type: String,
    required: true,
    unique: true
  },
  summary: {
    type: String,
    required: true,
  },
  poster: {
    type: String,
    required: true,
  },
  passages: {
    type: [String],
    default: [""],
  },
  types: {
    type: [String],
    default: [""],
  },
  tags: {
    type: [String],
    default: ["Tech"],
  },
  createdAt: {
    type: Schema.Types.Date,
    immutable: true,
    default: Date.now,
  },
  updatedAt: {
    type: Schema.Types.Date,
    default: Date.now,
  },
  likes: {
    type: Number,
    required: true,
    default: 0,
  },
  views: {
    type: Number,
    required: true,
    default: 0,
  },
  reshares: {
    type: Number,
    required: true,
    default: 0,
  },
  readTime: {
    type: Number,
    required: true,
    default: 0,
  },
  username: {
    type: String,
    required: true,
  },
  comment: [
    {
      text: {
        type: String,
        required: true,
      },
      username: {
        type: String,
      },
      image: {
        type: String,
      },
      createdAt: {
        type: Date,
      },
      likes: {
        type: Number,
        default: 0
      },
      subcomments: [
        {
          text: {
            type: String,
            required: true,
          },
          username: {
            type: String,
          },
          image: {
            type: String,
          },
          createdAt: {
            type: Date,
          },
        },
      ],
    },
  ],
});

const Blog = model<BlogDocument>("blog", BlogSchema);

export default Blog;
