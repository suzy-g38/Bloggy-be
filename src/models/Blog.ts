import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema({
  title: String,
  content: String,
  like: Number,
  bannerUrl: String,
  userId: String,
  author: String,
  createdAt: String,
  updatedAt: String,
  createdBy: String,
  updatedBy: String
});

export default mongoose.model('Blog', BlogSchema);
