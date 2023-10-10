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
    }
  }
})

export const { setBlogs , addBlog} = blogSlice.actions

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll()
    dispatch(setBlogs(blogs))
  }
}

export const createBlog =(newObject) => {
  return async (dispatch) => {
    const newBlog = await blogService.create(newObject)
    dispatch(addBlog(newBlog))
    dispatch(initializeBlogs())
  }
}

export default blogSlice.reducer
