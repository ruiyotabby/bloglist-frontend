import { useEffect, useContext } from 'react';
import Blogs from './components/Blogs';
import loginService from './services/login';
import LoginForm from './components/LoginForm';
import BlogForm from './components/BlogForm';
import blogService from './services/blog'
import './index.css'
import Notification from './components/Notification';
import { useNotification } from './hooks/index';
import UserContext from './UserContext';

function App() {
  const [user, userDispatch] = useContext(UserContext)
  const successNotification = useNotification('success')
  const errorNotification = useNotification('error')

  useEffect(() => {
    const loggedUser = window.localStorage.getItem('loggedUser');
    if (loggedUser) {
      userDispatch({ type: 'SAVE', payload: JSON.parse(loggedUser) })
      blogService.setToken(JSON.parse(loggedUser).token)
    }
  }, [])

  const handleLogin = async (credentials) => {
    try {
      const loggedUser = await loginService.login(credentials)
      userDispatch({ type: 'SAVE', payload: loggedUser })
      blogService.setToken(loggedUser.token)
      window.localStorage.setItem('loggedUser', JSON.stringify(loggedUser))
      successNotification.show(`${loggedUser.name} signed in successfully`)
      setTimeout(() => {
        window.localStorage.removeItem('loggedUser')
        window.location.reload()
      }, 1000 * 60 * 60)
    } catch(exception) {
      errorNotification.show(exception.response.data.error)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedUser')
    userDispatch({ type: 'CLEAR'})
    successNotification.show(`Signed out successfully`)
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
          <BlogForm user={user}></BlogForm>
          <Blogs user={user}/>
        </>
      }
    </>
  );
}

export default App;
