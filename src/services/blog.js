import axios from 'axios';

const baseUrl = 'http://localhost:3003/api/blogs';
let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data;
};

const create = async (newBlog) => {
  const config = {
    headers: {
      'Authorization': token
    }
  }

  const response = await axios.post(baseUrl, newBlog, config)
  return response.data
}

const update = async (updatedBlog) => {
  const response = await axios.put(`${baseUrl}/${updatedBlog.id}`, updatedBlog)
  return response.data
}

const remove = async (blogId) => {
  const config = {
    headers: {
      'Authorization': token
    }
  }

  const response = await axios.delete(`${baseUrl}/${blogId}`, config)
  return response.data
}

const addComment = async ({ blogId, newComment}) =>{
  const response = await axios.post(`${baseUrl}/${blogId}/comments`, newComment)
  return response.data
}

const blogService = {
  getAll,
  create,
  setToken,
  update,
  remove,
  addComment,
}

export default blogService;
