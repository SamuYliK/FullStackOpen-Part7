import { Link } from 'react-router-dom'
import { AppBar, Toolbar, Button } from '@mui/material'

const NavigationMenu = ({ username, logOut }) => {
  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit" component={Link} to="/">
            blogs
          </Button>
          <Button color="inherit" component={Link} to="/users">
            users
          </Button>
          <em>{username} logged in</em>
          <Button color="inherit" onClick={logOut}>
            logout
          </Button>
        </Toolbar>
      </AppBar>
    </div>
  )
}

export default NavigationMenu
