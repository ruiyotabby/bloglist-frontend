import { useState, useEffect } from 'react';
import Blog from './components/Blog';
import loginService from './services/login';
import LoginForm from './components/LoginForm';
import BlogForm from './components/BlogForm';
import blogService from './services/blog'
import './index.css'
import Notification from './components/Notification';
import Togglable from './components/Togglable';

function App() {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    blogService.getAll().then((response) => setBlogs(response));
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
      blogService.setToken(loggedUser.token)
      window.localStorage.setItem('loggedUser', JSON.stringify(loggedUser))
      setSuccessMessage(`${loggedUser.name} signed in successfully`)
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch(exception) {
      setErrorMessage(exception.response.data.error)
      setTimeout(() => setErrorMessage(null), 3000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedUser')
    setTimeout(() => window.location.reload(), 2000)
    setSuccessMessage(`signed out successfully`)
    setTimeout(() => setSuccessMessage(null), 3000)
  }

  const handleCreation = async (newBlog) => {
    try {
      const response = await blogService.create(newBlog)
      setSuccessMessage(`a new blog '${newBlog.title}' by '${newBlog.author}' added`)
      setTimeout(() => setSuccessMessage(null), 3000)
      setBlogs(blogs.concat(response))
    } catch (error) {
      console.log(error);
      setErrorMessage(error.response.data.error)
      setTimeout(() => setErrorMessage(null), 3000)
    }
  }

  return (
    <>
      <Notification message={errorMessage} className='error' />
      <Notification message={successMessage} className='success' />
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
          <Togglable buttonLabel='Create note'>
            <BlogForm handleSubmit={handleCreation} />
          </Togglable>
          {blogs.map((blog) => <Blog key={blog.id} blog={blog} />)}
        </>
      }
    </>
  );
}

export default App;
