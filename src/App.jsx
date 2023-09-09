import { useState, useEffect } from 'react'
import noteService from './services/blog'
import Blog from './components/Blog'

function App() {
  const [blogs, setBlogs] = useState([])

  useEffect( () => {
    noteService.getAll().then(blogs => setBlogs(blogs))
  }, [])

  return (
    <div>
      <h2>Blogs</h2>
      {blogs.map(blog => <Blog key={blog.id} blog={blog} />)}
    </div>
  )
}

export default App
