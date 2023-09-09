import { useState, useEffect } from 'react';
import noteService from './services/blog';
import Blog from './components/Blog';
import loginService from './services/login';

function App() {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    noteService.getAll().then((response) => setBlogs(response));
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })
      setUser(user)
      setPassword('')
      setUsername('')
    } catch(exception) {
      console.log(exception);
    }
  }

  return (
    <div>
      <h2>Blogs</h2>
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            type="text"
            value={username}
            name='username'
            onChange={({target}) => setUsername(target.value)}
          />
        </div>
        <div>
        password
          <input
            type='text'
            value={password}
            name='password'
            onChange={({target}) => setPassword(target.value)}
          />
        </div>
        <button type='submit'>Login</button>
      </form>
      {blogs.map((blog) => <Blog key={blog.id} blog={blog} />)}
    </div>
  );
}

export default App;
