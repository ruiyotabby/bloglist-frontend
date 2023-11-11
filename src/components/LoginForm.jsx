import { useState } from "react";
import PropTypes from 'prop-types';

const LoginForm = ({ handleSubmit }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = (event) => {
    event.preventDefault()

    handleSubmit({ username, password })
  }

  return (
    <form onSubmit={handleLogin}>
      <div>
        <label htmlFor="username">Username:</label>< br />
        <input
          id="username"
          type="text"
          value={username}
          name='username'
          required
          onChange={({target}) => setUsername(target.value)}
        />
      </div>
      <div>
        <label htmlFor="password">Password:</label>< br />
        <input
          id="password"
          type='password'
          value={password}
          name='password'
          required
          onChange={({target}) => setPassword(target.value)}
        />
      </div>< br />
      <button type='submit'>Login</button>
    </form>
  )
}

LoginForm.propTypes = {
  handleSubmit: PropTypes.func,
}

export default LoginForm;