import { TextField, Button } from '@mui/material'
import blogService from '../services/blogs'
import loginService from '../services/login'
import { useNotificationDispatch } from '../contexts/NotificationContext'
import { useCurrentUserDispatch } from '../contexts/CurrentUserContext'

const LoginForm = () => {
  const dispatchNotification = useNotificationDispatch()
  const dispatchCurrentUser = useCurrentUserDispatch()

  const handleLogin = async (event) => {
    event.preventDefault()
    const username = event.target[0].value
    const password = event.target[2].value

    try {
      const user = await loginService.login({
        username,
        password,
      })
      blogService.setToken(user.token)
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      dispatchCurrentUser({ type: 'USER', payload: user })
      event.target[0].value = ''
      event.target[1].value = ''
      dispatchNotification({
        type: 'NOTIFY',
        payload: ['success', `${user.name} was successfully logged in`],
      })
      setTimeout(() => {
        dispatchNotification({ type: 'RESET' })
      }, 3000)
    } catch (exception) {
      dispatchNotification({
        type: 'NOTIFY',
        payload: ['error', 'wrong username or password'],
      })
      setTimeout(() => {
        dispatchNotification({ type: 'RESET' })
      }, 3000)
    }
    event.target[0].value = ''
    event.target[2].value = ''
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
