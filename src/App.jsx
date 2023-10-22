import { useState, useEffect, useRef, useContext } from 'react';
import Blog from './components/Blog';
import loginService from './services/login';
import LoginForm from './components/LoginForm';
import BlogForm from './components/BlogForm';
import blogService from './services/blog'
import './index.css'
import Notification from './components/Notification';
import Togglable from './components/Togglable';
import NotificationContext from './NotificationContext';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNotification } from './hooks/index';

function App() {
  const [user, setUser] = useState(null)
  const blogFormRef = useRef()
  const [notification, dispatch] = useContext(NotificationContext)
  const queryClient = useQueryClient()
  const successNotification = useNotification('success')
  const errorNotification = useNotification('error')

  useEffect(() => {
    const loggedUser = window.localStorage.getItem('loggedUser');
    if (loggedUser) {
      const user = JSON.parse(loggedUser)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (credentials) => {
    try {
      const loggedUser = await loginService.login(credentials)
      setUser(loggedUser)
      blogService.setToken(loggedUser.token)
      window.localStorage.setItem('loggedUser', JSON.stringify(loggedUser))
      dispatch({ type: 'ADD', payload: { type: 'success', message: `${loggedUser.name} signed in successfully` } })
      setTimeout(() => dispatch({ type: 'CLEAR' }), 3000)
      setTimeout(() => {
        window.localStorage.removeItem('loggedUser')
        window.location.reload()
      }, 1000 * 60 * 60)
    } catch(exception) {
      dispatch({ type: 'ADD', payload: { type: 'error', message: exception.response.data.error } })
      setTimeout(() => dispatch({ type: 'CLEAR' }), 3000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedUser')
    setTimeout(() => window.location.reload(), 2000)
    dispatch({ type: 'ADD', payload: { type: 'success', message: `Signed out successfully` } })
    setTimeout(() => dispatch({ type: 'CLEAR' }), 3000)
  }

  const { isLoading, error, data } = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
   })

  const newBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: (newBlog) => {
      successNotification.show(`a new blog '${newBlog.title}' by '${newBlog.author}' added`)
      queryClient.setQueryData(['blogs'], blogs.concat({...newBlog, user: user}))
    },
    onError: (error) => errorNotification.show(error.response.data.error)
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

  const handleCreation = async (newBlog) => {
    blogFormRef.current.toggleVisibility()
    newBlogMutation.mutate(newBlog)
  }

  const handleLike = (blog) => {
    updateBlogMutation.mutate(blog)
  }

  const handleRemove = async (blog) => {
    if (!window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      return null
    }
    deleteBlogMutation.mutate(blog.id)
  }

   if (isLoading) {
    return <div>Loading data...</div>
  }

   if (error) {
    return <div>{error.message}</div>
  }

   const blogs = data

  return (
    <>
      <Notification />
      {!user &&
        <>
          <h2>Log in to application</h2>
          <LoginForm handleSubmit={handleLogin} />
        </>
      }
      {user &&
        <>
          <h2>Blogs</h2>
          {user.name} logged in
          <button onClick={handleLogout}>log out</button>
          <h2>Create new</h2>
          <Togglable buttonLabel='Create new blog' ref={blogFormRef}>
            <BlogForm handleSubmit={handleCreation} />
          </Togglable>
          {blogs
            .sort((a, b) => b.likes - a.likes)
            .map((blog) =>
              <Blog
                key={blog.id}
                blog={blog}
                handleClick={handleLike}
                user={user.username === blog.user.username}
                handleDelete={handleRemove}
              />
            )
          }
        </>
      }
    </>
  );
}

export default App;
