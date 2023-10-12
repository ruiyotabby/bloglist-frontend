import PropTypes from 'prop-types';
import { useState } from 'react';
import '../index.css'
import { useDispatch, useSelector } from 'react-redux';
import { deleteBlog, likeBlog } from '../reducers/blogReducer';
import { createNotification, clearNotification } from '../reducers/notificationReducer';

const Blog = ({ blog }) => {
  const [visible, setVisible] = useState(false)
  const toggleVisibility = () => setVisible(!visible)
  const showWhenVisible = { display: visible ? '' : 'none' }
  const text = visible ? 'hide' : 'show'
  const dispatch = useDispatch()
  const user = useSelector(({ user }) => user)
  const blogs = useSelector(({ blogs }) => blogs)
  console.log('blogs...', blogs);

  const handleLike = () => {
    try {
      const updateBlog = {
      ...blog,
      user: blog.user.id,
      likes: blog.likes + 1
    }
    dispatch(likeBlog(updateBlog))
    dispatch(createNotification({type: 'success', message: `blog '${blog.title} ${blog.author}' liked`}))
  } catch (exception) {
    dispatch(createNotification({type: 'success', message: exception.response.data.error}))
  }
  }

  const handleDelete = () => {
    try {
      if (!window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
        return null
      }
      dispatch(deleteBlog(blog.id))
      dispatch(createNotification({type: 'success', message: `blog '${blog.title} ${blog.author}' was deleted`}))
    } catch(exception) {
      dispatch(createNotification({type: 'success', message: exception.response.data.error}))
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
        {(user.username === blog.user.username)
          && <button onClick={handleDelete}>remove</button>
        }
      </div>
    </div>
  );
}

const Blogs = () => {
  const blogs = useSelector(({ blogs }) => blogs)

  return (
    blogs.map((blog) => <Blog key={blog.id} blog={blog} />
      )
  )
}


Blog.propTypes = {
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

export default Blogs;
