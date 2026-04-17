import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1',
  withCredentials: true,
});

// Auth
export const register  = (data) => api.post('/register', data);
export const login     = (data) => api.post('/login', data);
export const getUser   = ()     => api.get('/user');
export const logout    = ()     => api.get('/logout');
export const updateUser= (data) => api.put('/update', data);
export const uploadFile= (form) => api.post('/file-upload', form, { headers: { 'Content-Type': 'multipart/form-data' } });

// Generic CRUD factory
const crud = (base) => ({
  getAll:    (...args) => api.get(`/all-${base}${args.length ? '/' + args.join('/') : ''}`),
  getOne:    (id)  => api.get(`/single-${base}/${id}`),
  create:    (data)=> api.post(`/create-${base}`, data),
  update:    (id, data) => api.put(`/update-${base}/${id}`, data),
  remove:    (id)  => api.delete(`/delete-${base}/${id}`),
});

export const experienceAPI  = crud('experience');
export const educationAPI   = crud('education');
export const advantageAPI   = crud('advantage');
export const portfolioAPI   = crud('portfolio');
export const serviceAPI     = crud('service');
export const testimonialAPI = crud('testimonial');
export const contactAPI     = { getAll: () => api.get('/all-contact'), getOne: (id) => api.get(`/single-contact/${id}`), create: (data) => api.post('/create-contact', data), remove: (id) => api.delete(`/delete-contact/${id}`) };
export const blogAPI        = { getAll: (page=1, per=10) => api.get(`/all-blog/${page}/${per}`), getOne: (id) => api.get(`/single-blog/${id}`), create: (data) => api.post('/create-blog', data), update: (id, data) => api.put(`/update-blog/${id}`, data), remove: (id) => api.delete(`/delete-blog/${id}`) };
export const commentAPI     = { getAll: () => api.get('/all-comment'), getOne: (id) => api.get(`/single-comment/${id}`), create: (data) => api.post('/create-comment', data), remove: (id) => api.delete(`/delete-comment/${id}`) };

export default api;
