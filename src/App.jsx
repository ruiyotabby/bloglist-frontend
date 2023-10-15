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

function App() {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null)
  const blogFormRef = useRef()
  const [notification, dispatch] = useContext(NotificationContext)

  useEffect(() => {
    blogService.getAll().then((response) => {
      setBlogs(response)
    });
  }, []);

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
        window.location.reload
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

  const handleCreation = async (newBlog) => {
    try {
      blogFormRef.current.toggleVisibility()
      await blogService.create(newBlog)
      setBlogs(await blogService.getAll())
      dispatch({ type: 'ADD', payload: { type: 'success', message: `a new blog '${newBlog.title}' by '${newBlog.author}' added` } })
      setTimeout(() => dispatch({ type: 'CLEAR' }), 3000)
    } catch (error) {
      dispatch({ type: 'ADD', payload: { type: 'error', message: error.response.data.error } })
      setTimeout(() => dispatch({ type: 'CLEAR' }), 3000)
    }
  }

  const handleLike = async (blog) => {
    try {
      await blogService.update(blog.id, blog)
      setBlogs(await blogService.getAll())
      dispatch({ type: 'ADD', payload: { type: 'success', message: `blog '${blog.title} ${blog.author}' liked` } })
      setTimeout(() => dispatch({ type: 'CLEAR' }), 3000)
    } catch(exception) {
      dispatch({ type: 'ADD', payload: { type: 'error', message: exception.response.data.error } })
      setTimeout(() => dispatch({ type: 'CLEAR' }), 3000)
    }
  }

  const handleRemove = async (blog) => {
    try {
      if (!window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
        return null
      }
      await blogService.remove(blog.id)
      setBlogs(await blogService.getAll())
      dispatch({ type: 'ADD', payload: { type: 'success', message: `blog '${blog.title} ${blog.author}' was deleted` } })
      setTimeout(() => dispatch({ type: 'CLEAR' }), 3000)
    } catch(exception) {
      dispatch({ type: 'ADD', payload: { type: 'success', message: exception.response.data.error } })
      setTimeout(() => dispatch({ type: 'CLEAR' }), 3000)
      console.log(exception);
    }

  }

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
