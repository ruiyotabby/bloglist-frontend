import { createSlice } from "@reduxjs/toolkit";
import blogService from "../services/blog";

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    setBlogs(state, action) {
      return action.payload.sort((a, b) => b.likes - a.likes)
    },
    addBlog(state, action) {
      return state.concat(action.payload)
    },
    updateBlog(state, action) {
      const updatedBlog = action.payload
      return state.map(blog => blog.id === updatedBlog.id ? updatedBlog : blog)
    },
    removeBlog(state, action) {
      const deletedBlog = action.payload
      return state.filter(blog => blog.id !== deletedBlog.id)
    }
  }
})

export const { setBlogs , addBlog, updateBlog, removeBlog } = blogSlice.actions

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll()
    dispatch(setBlogs(blogs))
  }
}

export const createBlog = (newObject) => {
  return async (dispatch) => {
    const newBlog = await blogService.create(newObject)
    dispatch(addBlog(newBlog))
    dispatch(initializeBlogs())
  }
}

export const likeBlog = (updatedObject) => {
  return async (dispatch) => {
    const updatedBlog = await blogService.update(updatedObject)
    dispatch(updateBlog(updatedBlog))
    dispatch(initializeBlogs())
  }
}

export const deleteBlog = (id) => {
  return async (dispatch) => {
    const deletedBlog = await blogService.remove(id)
    dispatch(removeBlog(deletedBlog))
  }
}

export default blogSlice.reducer
