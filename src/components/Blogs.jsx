import PropTypes from 'prop-types';
import { useContext, useState } from 'react';
import '../index.css'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import blogService from '../services/blog';
import { useNotification } from '../hooks';
import UserContext from '../UserContext';
import BlogForm from './BlogForm';

const Blog = ({ blog }) => {
  const [visible, setVisible] = useState(false)
  const toggleVisibility = () => setVisible(!visible)
  const showWhenVisible = { display: visible ? '' : 'none' }
  const text = visible ? 'hide' : 'show'
  const queryClient = useQueryClient()
  const successNotification = useNotification('success')
  const errorNotification = useNotification('error')
  const [user, userDispatch] = useContext(UserContext)

  const { data } = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
  })

  const blogs = data

  const updateBlogMutation = useMutation({
    mutationFn: blogService.update,
    onSuccess: (updatedBlog) => {
      successNotification.show(`blog '${updatedBlog.title} ${updatedBlog.author}' liked`)
      queryClient.setQueryData(['blogs'], blogs.map(blog => blog.id === updatedBlog.id ? updatedBlog : blog))
    },
    onError: (error) => errorNotification.show(error.response.data.error)
  })

  const deleteBlogMutation = useMutation({
    mutationFn: blogService.remove,
    onSuccess: (deletedBlog) => {
      successNotification.show(`blog '${deletedBlog.title} ${deletedBlog.author}' was deleted`)
      queryClient.setQueryData(['blogs'], blogs.filter(blog => blog.id !== deletedBlog.id))
    },
    onError: (error) => errorNotification.show(error.response.data.error)
  })

  const handleLike = () => {
    const updateBlog = {
      ...blog,
      user: blog.user.id,
      likes: blog.likes + 1
    }
    updateBlogMutation.mutate(updateBlog)
  }

  const handleRemove = () => {
    const deletedBlog = {
      ...blog,
      user: blog.user.id
    }
    if (!window.confirm(`Remove blog ${deletedBlog.title} by ${deletedBlog.author}`)) {
      return null
    }
    deleteBlogMutation.mutate(deletedBlog.id)
  }

  return (
    <div className='blog'>
      <span>{blog.title} {blog.author} </span>
      <button onClick={toggleVisibility}>{text}</button>
      <div style={showWhenVisible} className='hiddenContent'>
        <div>{blog.url}</div>
        <div id='likes'>likes: {blog.likes} <button onClick={handleLike}>like</button></div>
        <div>{blog.user.name}</div>
        {(user.username === blog.user.username) && <button onClick={handleRemove}>remove</button>}
      </div>
    </div>
  );
}

const Blogs = ({ user }) => {
  const { isLoading, error, data } = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
   })

  if (isLoading) {
    return <div>Loading data...</div>
  }

  if (error) {
    return <div>{error.message}</div>
  }

  const blogs = data

  return (
    <>
      <BlogForm user={user}></BlogForm>
      {blogs.sort((a, b) => b.likes - a.likes).map((blog) =>
        <Blog key={blog.id} blog={blog} />
      )}
  </>
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
