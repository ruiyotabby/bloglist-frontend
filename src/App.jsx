import { useState, useEffect } from 'react';
import noteService from './services/blog';
import Blog from './components/Blog';
import loginService from './services/login';
import LoginForm from './components/Login';

function App() {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null)

  useEffect(() => {
    noteService.getAll().then((response) => setBlogs(response));
  }, []);

  const handleLogin = async (username, password) => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })
      setUser(user)
    } catch(exception) {
      console.log(exception);
    }
  }

  return (
    <div>
      {!user &&
      <div>
        <h2>Log in to application</h2>
        <LoginForm handleSubmit={handleLogin} />
      </div>
      }

      {user &&
      <div>
        <h2>Blogs</h2>
        {user.name} logged in
        {blogs.map((blog) => <Blog key={blog.id} blog={blog} />)}
      </div>
      }
    </div>
  );
}

export default App;
