import Blog from '../models/Blog.js';

const PAGE_LIMIT = 5; 

export default {
  Query: {
    getBlogs: async (_, { page = 1, limit = PAGE_LIMIT }) => {
      const skip = (page - 1) * limit;
      const blogs = await Blog.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const totalCount = await Blog.countDocuments();
      const hasMore = skip + blogs.length < totalCount;

      return { blogs, hasMore };
    },
    getBlogById: async (_, { Id }: { Id: string }) => {
      return await Blog.findById(Id);
    },
    getBlogByUserId: async (_, { page = 1, limit = PAGE_LIMIT }: { page: number; limit: number },{ userId }) => {
      const skip = (page - 1) * limit;
      const blogs = await Blog.find({ userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const totalCount = await Blog.countDocuments({ userId });
      const hasMore = skip + blogs.length < totalCount;

      return { blogs, hasMore };
    },
  },
  Mutation: {
    createBlog: async (_, { title, content, bannerUrl }: { title: string; content: string; bannerUrl: string;  }, { userId }) => {
      const blog = new Blog({
        title,
        content,
        bannerUrl,
        userId, 
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: userId, 
        updatedBy: userId,
        like: 0,
        author: 'Anonymous', 
      });

      return await blog.save();
    },
    deleteBlog: async (_, { id }: { id: string },{ userId }) => {
      const blog = await Blog.findById(id);
      if (!blog) {
        throw new Error('Blog not found');
      }
      if (blog.userId !== userId) {
        throw new Error('Unauthorized: You can only delete your own blogs');
      }
      await Blog.findByIdAndDelete(id);
      return true;
    },
    updateBlog: async (_, { id, title, content, bannerUrl }: { id: string; title: string; content: string,bannerUrl: string; }, { userId }) => {
      const blog = await Blog.findById(id);
      if (!blog) {
        throw new Error('Blog not found');
      }
      if (blog.userId !== userId) {
        throw new Error('Unauthorized: You can only update your own blogs');
      }
      const updatedBlog = await Blog.findByIdAndUpdate(
        id,
        { title, content, bannerUrl, updatedAt: new Date().toISOString(), updatedBy: userId },
        { new: true }
      );
      return updatedBlog;
    },
  },
};