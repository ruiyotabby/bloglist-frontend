import { useEffect, useRef } from 'react';
import Blog from './components/Blog';
import LoginForm from './components/LoginForm';
import BlogForm from './components/BlogForm';
import './index.css'
import Notification from './components/Notification';
import Togglable from './components/Togglable';
import { useDispatch, useSelector } from 'react-redux';
import { createNotification } from './reducers/notificationReducer';
import { createBlog, initializeBlogs } from './reducers/blogReducer';
import { saveUserDetails } from './reducers/loginReducer';

function App() {
  const user = useSelector(state => state.user)
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
      dispatch(saveUserDetails(JSON.parse(loggedUser)))
      setTimeout(() => {
        window.localStorage.removeItem('loggedUser')
        window.location.reload()
      }, 60000 * 60)
    }
  }, [])

  const handleLogout = () => {
    window.localStorage.removeItem('loggedUser')
    setTimeout(() => window.location.reload(), 2000)
    dispatch(createNotification({type: 'success', message: `signed out successfully`}))
  }

  const handleCreation = async (newBlog) => {
    try {
      blogFormRef.current.toggleVisibility()
      dispatch(createBlog(newBlog))
      dispatch(createNotification({type: 'success', message: `a new blog '${newBlog.title}' by '${newBlog.author}' added`}))
    } catch (error) {
      dispatch(createNotification({type: 'success', message: error.response.data.error}))
    }
  }

  return (
    <>
      <Notification notification={notification} />
      {!user &&
        <>
          <h2>Log in to application</h2>
          <LoginForm />
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
                user={user.username === blog.user.username}
              />
            )
          }
        </>
      }
    </>
  );
}

export default App;
