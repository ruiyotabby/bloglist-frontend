import PropTypes from 'prop-types';
import { useState } from 'react';
import '../index.css'

const Blog = ({ blog, handleClick }) => {
  const [visible, setVisible] = useState(false)
  const toggleVisibility = () => setVisible(!visible)
  const showWhenVisible = { display: visible ? '' : 'none' }
  const text = visible ? 'hide' : 'show'

  const handleLike = (event) => {
    event.preventDefault()
    const updateBlog = {
      ...blog,
      user: blog.user.id,
      likes: blog.likes + 1
    }
    handleClick(updateBlog)
  }

  return (
    <div className='blog'>
      <span>{blog.title} {blog.author} </span>
      <button onClick={toggleVisibility}>{text}</button>
      <div style={showWhenVisible}>
        <div>{blog.url}</div>
        <div>likes: {blog.likes} <button onClick={handleLike}>like</button></div>
        <div>{blog.user.name}</div>
      </div>
    </div>
  );}


Blog.propTypes = {
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
