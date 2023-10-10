import { useState, useEffect, useRef } from 'react';
import Blog from './components/Blog';
import loginService from './services/login';
import LoginForm from './components/LoginForm';
import BlogForm from './components/BlogForm';
import blogService from './services/blog'
import './index.css'
import Notification from './components/Notification';
import Togglable from './components/Togglable';
import { useDispatch, useSelector } from 'react-redux';
import { clearNotification, createNotification } from './reducers/notificationReducer';
import { createBlog, initializeBlogs } from './reducers/blogReducer';

function App() {
  const [user, setUser] = useState(null)
  const blogFormRef = useRef()
  const notification = useSelector(state => state.notification)
  const blogs = useSelector(state => state.blogs)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeBlogs())
  }, []);

  useEffect(() => {
    const loggedUser = window.localStorage.getItem('loggedUser');
    if (loggedUser) {
      const user = JSON.parse(loggedUser)
      setUser(user)
      blogService.setToken(user.token)
      setTimeout(() => {
        window.localStorage.removeItem('loggedUser')
        window.location.reload()
      }, 60000 * 60)
    }
  }, [])

  const handleLogin = async (credentials) => {
    try {
      const loggedUser = await loginService.login(credentials)
      setUser(loggedUser)
      blogService.setToken(loggedUser.token)
      window.localStorage.setItem('loggedUser', JSON.stringify(loggedUser))
      dispatch(createNotification({type: 'success', message: `${loggedUser.name} signed in successfully`}))
      setTimeout(() => dispatch(clearNotification()), 3000)
      setTimeout(() => {
        window.localStorage.removeItem('loggedUser')
        window.location.reload()
      }, 60000 * 60)
    } catch(exception) {
      setErrorMessage(exception.response.data.error)
      setTimeout(() => setErrorMessage(null), 3000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedUser')
    setTimeout(() => window.location.reload(), 2000)
    dispatch(createNotification({type: 'success', message: `signed out successfully`}))
    setTimeout(() => dispatch(clearNotification()), 3000)
  }

  const handleCreation = async (newBlog) => {
    try {
      blogFormRef.current.toggleVisibility()
      dispatch(createBlog(newBlog))
      dispatch(createNotification({type: 'success', message: `a new blog '${newBlog.title}' by '${newBlog.author}' added`}))
      setTimeout(() => dispatch(clearNotification()), 3000)
    } catch (error) {
      dispatch(createNotification({type: 'success', message: error.response.data.error}))
      setTimeout(() => dispatch(clearNotification()), 3000)
    }
  }

  const handleLike = async (blog) => {
    try {
      await blogService.update(blog.id, blog)
      dispatch(createNotification({type: 'success', message: `blog '${blog.title} ${blog.author}' liked`}))
      setTimeout(() => dispatch(clearNotification()), 3000)
    } catch(exception) {
      dispatch(createNotification({type: 'success', message: exception.response.data.error}))
      setTimeout(() => dispatch(clearNotification()), 3000)
    }
  }

  const handleRemove = async (blog) => {
    try {
      if (!window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
        return null
      }
      await blogService.remove(blog.id)
      dispatch(createNotification({type: 'success', message: `blog '${blog.title} ${blog.author}' was deleted`}))
      setTimeout(() => dispatch(clearNotification()), 3000)
    } catch(exception) {
      dispatch(createNotification({type: 'success', message: exception.response.data.error}))
      setTimeout(() => dispatch(clearNotification()), 3000)
      console.log(exception);
    }

  }

  return (
    <>
      <Notification notification={notification} />
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
