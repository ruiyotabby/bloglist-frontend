import PropTypes from 'prop-types';
import { useState } from 'react';
import '../index.css'
import { useDispatch } from 'react-redux';
import { deleteBlog, likeBlog } from '../reducers/blogReducer';
import { createNotification, clearNotification } from '../reducers/notificationReducer';

const Blog = ({ blog, user }) => {
  const [visible, setVisible] = useState(false)
  const toggleVisibility = () => setVisible(!visible)
  const showWhenVisible = { display: visible ? '' : 'none' }
  const text = visible ? 'hide' : 'show'
  const dispatch = useDispatch()

  const handleLike = () => {
    try {
      const updateBlog = {
      ...blog,
      user: blog.user.id,
      likes: blog.likes + 1
    }
    dispatch(likeBlog(updateBlog))
    dispatch(createNotification({type: 'success', message: `blog '${blog.title} ${blog.author}' liked`}))
    setTimeout(() => dispatch(clearNotification()), 3000)
  } catch (exception) {
    dispatch(createNotification({type: 'success', message: exception.response.data.error}))
    setTimeout(() => dispatch(clearNotification()), 3000)
  }
  }

  const handleDelete = () => {
    try {
      if (!window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
        return null
      }
      dispatch(deleteBlog(blog.id))
      dispatch(createNotification({type: 'success', message: `blog '${blog.title} ${blog.author}' was deleted`}))
      setTimeout(() => dispatch(clearNotification()), 3000)
    } catch(exception) {
      dispatch(createNotification({type: 'success', message: exception.response.data.error}))
      setTimeout(() => dispatch(clearNotification()), 3000)
      console.log(exception);
    }
  }

  return (
    <div className='blog'>
      <span>{blog.title} {blog.author} </span>
      <button onClick={toggleVisibility}>{text}</button>
      <div style={showWhenVisible} className='hiddenContent'>
        <div>{blog.url}</div>
        <div id='likes'>likes: {blog.likes} <button onClick={handleLike}>like</button></div>
        <div>{blog.user.name}</div>
        {user && <button onClick={handleDelete}>remove</button>}
      </div>
    </div>
  );}


Blog.propTypes = {
  handleDelete: PropTypes.func,
  user: PropTypes.bool,
  handleClick: PropTypes.func,
  blog: PropTypes.shape({
    title: PropTypes.string,
    author: PropTypes.string,
    url: PropTypes.string,
    likes: PropTypes.number,
    user: PropTypes.shape({
      name: PropTypes.string,
      id: PropTypes.string
    })
  }),
};

export default Blog;
