const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  createBlog,
  getBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  getPublishedBlogs,
  getPublishedBlogBySlug,
} = require("../controllers/blogController");

router.get("/public", getPublishedBlogs);
router.get("/public/:slug", getPublishedBlogBySlug);

router.use(authMiddleware);

router.post("/", createBlog);
router.get("/", getBlogs);
router.get("/:id", getBlogById);
router.put("/:id", updateBlog);
router.delete("/:id", deleteBlog);

module.exports = router;
