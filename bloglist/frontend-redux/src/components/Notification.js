import { useSelector } from 'react-redux'
import { Alert } from '@mui/material'

const Notification = () => {
  const notification = useSelector((state) => state.notification)

  if (notification) {
    if (notification[1] === 'success') {
      return <Alert severity="success">{notification[0]}</Alert>
    }
    return <Alert severity="error">{notification[0]}</Alert>
  }
  return notification
}

export default Notification
