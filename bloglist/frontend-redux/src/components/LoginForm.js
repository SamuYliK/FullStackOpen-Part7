import { useDispatch } from 'react-redux'
import { loginUser } from '../reducers/currentUserReducer'
import { TextField, Button } from '@mui/material'

const LoginForm = () => {
  const dispatch = useDispatch()

  const handleLogin = async (event) => {
    event.preventDefault()
    const username = event.target[0].value
    const password = event.target[2].value
    dispatch(loginUser(username, password))
  }

  return (
    <div>
      <h2>Log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>
          <TextField label="username" />
          <TextField type="password" label="password" />
        </div>
        <div>
          <Button variant="contained" color="primary" type="submit">
            login
          </Button>
        </div>
      </form>
    </div>
  )
}

export default LoginForm
