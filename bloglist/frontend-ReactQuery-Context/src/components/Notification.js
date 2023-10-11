import { useNotificationValue } from '../contexts/NotificationContext'
import { Alert } from '@mui/material'

const Notification = () => {
  const notification = useNotificationValue()

  if (notification) {
    if (notification[0] === 'success') {
      return <Alert severity="success">{notification[1]}</Alert>
    }
    return <Alert severity="error">{notification[1]}</Alert>
  }
  return notification
}

export default Notification
