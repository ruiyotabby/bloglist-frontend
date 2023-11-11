import { useEffect, useContext } from 'react';
import Blogs, { Blog } from './components/Blogs';
import loginService from './services/login';
import LoginForm from './components/LoginForm';
import blogService from './services/blog'
import './index.css'
import Notification from './components/Notification';
import { useNotification } from './hooks/index';
import UserContext from './UserContext';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import Users, { User } from './components/Users';

function App() {
  const [user, userDispatch] = useContext(UserContext)
  const successNotification = useNotification('success')
  const errorNotification = useNotification('error')
  const location = useLocation().pathname

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
      <h1 className='title'>BLOG</h1>
      {!user &&
        <>
          <h2>Log in to application</h2>
          <LoginForm handleSubmit={handleLogin} />
        </>
      }
      {user &&
        <>
          <header className='header'>
            <div>
              <Link className={location === '/blogs' ? 'active': ''} to='/blogs'>Blogs</Link>
              <Link className={location === '/users' ? 'active': ''} to='/users'>Users</Link>
            </div>
            <div>
              <>{user.name} logged in </>
              <button className='warning' onClick={handleLogout}>log out</button>
            </div>
          </header>
          <Routes>
            <Route path='/' element={<Blogs />}/>
            <Route path='/blogs' element={<Blogs />}/>
            <Route path='/users' element={<Users />} />
            <Route path='/users/:id' element={<User />} />
            <Route path='/blogs/:id' element={<Blog />} />
          </Routes>
        </>
      }
    </>
  );
}

export default App;
