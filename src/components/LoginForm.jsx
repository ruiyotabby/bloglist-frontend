import { useState } from "react";
import { login } from '../reducers/loginReducer';
import { useDispatch } from "react-redux";
import { createNotification } from "../reducers/notificationReducer";


const LoginForm = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      dispatch(login({ username, password }))
      setTimeout(() => {
        window.localStorage.removeItem('loggedUser')
        window.location.reload()
      }, 60000 * 60)
    } catch({ response }) {
      console.log(response.data.error);
      dispatch(createNotification({type: 'error', message: response.data.error}))
    }
  }

  return (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type="text"
          value={username}
          name='username'
          required
          onChange={({target}) => setUsername(target.value)}
        />
      </div>
      <div>
      password
        <input
          type='password'
          value={password}
          name='password'
          required
          onChange={({target}) => setPassword(target.value)}
        />
      </div>
      <button type='submit'>Login</button>
    </form>
  )
}

export default LoginForm;