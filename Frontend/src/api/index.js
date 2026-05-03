import axios from "axios";

const api = axios.create({
  baseURL: "https://mernstack-portfolio-backend-6h5a.onrender.com/api/v1",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Skip redirect loop on auth routes from /login page
    if (
      error.config?.url?.includes("login") ||
      !window.location.pathname.startsWith("/admin")
    ) {
      return Promise.reject(error);
    }
    if (error.response?.status === 401) {
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

// Auth
export const login = (data) => api.post("/login", data);
export const getUser = () => api.get("/user");
export const logout = () => api.get("/logout");
export const updateUser = (data) => api.put("/update", data);
export const getProfile = () => api.get("/profile"); // public
export const uploadFile = (form, onUploadProgress) =>
  api.post("/file-upload", form, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress,
  });
export const uploadFiles = (form, onUploadProgress) =>
  api.post("/files-upload", form, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress,
  });

// Helpers — resolve a stored image reference to a usable URL
// (handles full URLs, /uploads/<filename>, and bare filenames from legacy data).
export const resolveImg = (val) => {
  if (!val) return "";
  if (val.startsWith("http")) return val;
  if (val.startsWith("/uploads/")) return val;
  if (val.startsWith("/api/v1/get-file/")) return val;
  return `/uploads/${val}`;
};

// Generic CRUD factory
const crud = (base) => ({
  getAll: (...args) =>
    api.get(`/all-${base}${args.length ? "/" + args.join("/") : ""}`),
  getOne: (id) => api.get(`/single-${base}/${id}`),
  create: (data) => api.post(`/create-${base}`, data),
  update: (id, data) => api.put(`/update-${base}/${id}`, data),
  remove: (id) => api.delete(`/delete-${base}/${id}`),
});

export const experienceAPI = crud("experience");
export const educationAPI = crud("education");
export const advantageAPI = crud("advantage");
export const portfolioAPI = crud("portfolio");
export const serviceAPI = crud("service");
export const testimonialAPI = crud("testimonial");
export const contactAPI = {
  getAll: () => api.get("/all-contact"),
  getOne: (id) => api.get(`/single-contact/${id}`),
  create: (data) => api.post("/create-contact", data),
  remove: (id) => api.delete(`/delete-contact/${id}`),
};
export const blogAPI = {
  getAll: (page = 1, per = 10) => api.get(`/all-blog/${page}/${per}`),
  getOne: (id) => api.get(`/single-blog/${id}`),
  create: (data) => api.post("/create-blog", data),
  update: (id, data) => api.put(`/update-blog/${id}`, data),
  remove: (id) => api.delete(`/delete-blog/${id}`),
};
export const commentAPI = {
  getAll: () => api.get("/all-comment"),
  getOne: (id) => api.get(`/single-comment/${id}`),
  create: (data) => api.post("/create-comment", data),
  remove: (id) => api.delete(`/delete-comment/${id}`),
};

export default api;
