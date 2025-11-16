const Blog = require("../models/Blog");

const slugify = (value) => {
  if (!value) return "";
  return value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
};

const ensureUniqueSlug = async (desiredSlug, excludeId = null) => {
  const baseSlug = desiredSlug || `blog-${Date.now()}`;
  let uniqueSlug = baseSlug;
  let suffix = 1;

  const slugExists = async (candidate) => {
    const query = { slug: candidate };
    if (excludeId) {
      query._id = { $ne: excludeId };
    }
    return Blog.exists(query);
  };

  while (await slugExists(uniqueSlug)) {
    uniqueSlug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  return uniqueSlug;
};

const normalizeTags = (tags) => {
  if (!tags) return [];
  if (Array.isArray(tags)) {
    return tags
      .map((tag) => tag?.toString().trim())
      .filter(Boolean)
      .map((tag) => tag.toLowerCase());
  }
  if (typeof tags === "string") {
    return tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean)
      .map((tag) => tag.toLowerCase());
  }
  return [];
};

exports.createBlog = async (req, res) => {
  try {
    const { title, slug, excerpt, content, tags, published } = req.body;

    if (!title || !content) {
      return res
        .status(400)
        .json({ message: "Title and content are required" });
    }

    const normalizedSlug = slugify(slug || title);
    const uniqueSlug = await ensureUniqueSlug(normalizedSlug);

    const blog = await Blog.create({
      title,
      slug: uniqueSlug,
      excerpt,
      content,
      tags: normalizeTags(tags),
      published: Boolean(published),
      author: req.user._id,
    });

    res.status(201).json(blog);
  } catch (error) {
    console.error("Failed to create blog", error);
    res.status(500).json({ message: "Failed to create blog" });
  }
};

exports.getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ author: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(blogs);
  } catch (error) {
    console.error("Failed to fetch blogs", error);
    res.status(500).json({ message: "Failed to fetch blogs" });
  }
};

exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findOne({
      _id: req.params.id,
      author: req.user._id,
    });

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.json(blog);
  } catch (error) {
    console.error("Failed to fetch blog", error);
    res.status(500).json({ message: "Failed to fetch blog" });
  }
};

exports.updateBlog = async (req, res) => {
  try {
    const { title, slug, excerpt, content, tags, published } = req.body;

    const blog = await Blog.findOne({
      _id: req.params.id,
      author: req.user._id,
    });

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    if (title !== undefined) blog.title = title;
    if (excerpt !== undefined) blog.excerpt = excerpt;
    if (content !== undefined) blog.content = content;
    if (tags !== undefined) blog.tags = normalizeTags(tags);
    if (published !== undefined) blog.published = Boolean(published);

    if (slug !== undefined || title) {
      const normalizedSlug = slugify(slug || blog.title);
      blog.slug = await ensureUniqueSlug(normalizedSlug, blog._id);
    }

    await blog.save();
    res.json(blog);
  } catch (error) {
    console.error("Failed to update blog", error);
    res.status(500).json({ message: "Failed to update blog" });
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findOneAndDelete({
      _id: req.params.id,
      author: req.user._id,
    });

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.json({ message: "Blog deleted" });
  } catch (error) {
    console.error("Failed to delete blog", error);
    res.status(500).json({ message: "Failed to delete blog" });
  }
};

exports.getPublishedBlogs = async (_req, res) => {
  try {
    const blogs = await Blog.find({ published: true })
      .sort({ createdAt: -1 })
      .select("title slug excerpt tags published createdAt updatedAt");
    res.json(blogs);
  } catch (error) {
    console.error("Failed to fetch published blogs", error);
    res.status(500).json({ message: "Failed to fetch blogs" });
  }
};

exports.getPublishedBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({
      slug: req.params.slug,
      published: true,
    });

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.json(blog);
  } catch (error) {
    console.error("Failed to fetch blog", error);
    res.status(500).json({ message: "Failed to fetch blog" });
  }
};
