import { useEffect, useRef } from 'react';
import LoginForm from './components/LoginForm';
import BlogForm from './components/BlogForm';
import './index.css'
import Notification from './components/Notification';
import { useDispatch, useSelector } from 'react-redux';
import { createNotification } from './reducers/notificationReducer';
import { initializeBlogs } from './reducers/blogReducer';
import { saveUserDetails } from './reducers/loginReducer';
import Blogs from './components/Blogs';

function App() {
  const user = useSelector(({ user }) => user)
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

  return (
    <>
      <Notification />
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
          <BlogForm />
          <Blogs />
        </>
      }
    </>
  );
}

export default App;
