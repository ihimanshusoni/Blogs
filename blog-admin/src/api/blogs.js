import api from "./client.js";

export async function fetchBlogs() {
  const response = await api.get("/api/blogs");
  return response.data;
}

export async function fetchBlog(id) {
  const response = await api.get(`/api/blogs/${id}`);
  return response.data;
}

export async function createBlog(data) {
  const response = await api.post("/api/blogs", data);
  return response.data;
}

export async function updateBlog(id, data) {
  const response = await api.put(`/api/blogs/${id}`, data);
  return response.data;
}

export async function deleteBlog(id) {
  const response = await api.delete(`/api/blogs/${id}`);
  return response.data;
}

export async function fetchPublishedBlogs() {
  const response = await api.get("/api/blogs/public");
  return response.data;
}

export async function fetchPublishedBlog(slug) {
  const response = await api.get(`/api/blogs/public/${slug}`);
  return response.data;
}
