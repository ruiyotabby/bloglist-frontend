import { useState, useEffect } from 'react';
import Blog from './components/Blog';
import loginService from './services/login';
import LoginForm from './components/LoginForm';
import BlogForm from './components/BlogForm';
import blogService from './services/blog'

function App() {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null)

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

  const handleLogin = async (username, password) => {
    try {
      const user = await loginService.login({ username, password })
      blogService.setToken(user.token)
      setUser(user)
      window.localStorage.setItem('loggedUser', JSON.stringify(user))
    } catch(exception) {
      console.log(exception);
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedUser')
    window.location.reload()
  }

  const handleCreation = async (title, author, url) => {
    try {
      const blog = { title, author, url}
      const response = await blogService.create(blog)
      setBlogs(blogs.concat(response))
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
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
          <BlogForm handleSubmit={handleCreation} />
          {blogs.map((blog) => <Blog key={blog.id} blog={blog} />)}
        </>
      }
    </>
  );
}

export default App;
