import { useContext } from 'react';
import '../index.css'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import blogService from '../services/blog';
import { useNotification } from '../hooks';
import UserContext from '../UserContext';
import BlogForm from './BlogForm';
import { Link, useParams } from 'react-router-dom';

export const Blog = () => {
  const queryClient = useQueryClient()
  const successNotification = useNotification('success')
  const errorNotification = useNotification('error')
  const [user, userDispatch] = useContext(UserContext)

  const { id } = useParams()
  const { isLoading, data } = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
  })

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

  if (isLoading) return <p>Please wait...</p>

  const blogs = data
  const blog = blogs.find(blog => blog.id === id)

  if (!blog) return <p>Blog not found</p>

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
    <>
      <h3>{blog.title} {blog.author} </h3>
      <a href={`http://www.${blog.url}`}>{blog.url}</a>
      <div id='likes'>{blog.likes} likes <button onClick={handleLike}>like</button></div>
      <div>added by <Link to={`/users/${blog.user.id}`}>{blog.user.name}</Link></div>
      {(user.username === blog.user.username) && <button onClick={handleRemove}>remove</button>}
    </>
  );
}

const Blogs = () => {
  const { isLoading, error, data } = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
   })

  if (isLoading) {
    return <p>Loading data...</p>
  }

  if (error) {
    return <p>{error.message}</p>
  }

  const blogs = data

  return (
    <>
      <BlogForm />
      {blogs.sort((a, b) => b.likes - a.likes).map((blog) =>
      <div key={blog.id} className='blog'>
        <Link to={`/blogs/${blog.id}`}>{blog.title} {blog.author} </Link>
      </div>
      )}
  </>
  )
}

export default Blogs;
