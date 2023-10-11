import { useDispatch, useSelector } from 'react-redux'
import { Button } from '@mui/material'
import { setToggle } from '../reducers/toggleReducer'

const Togglable = (props) => {
  const dispatch = useDispatch()
  const visible = useSelector((state) => state.toggle)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    dispatch(setToggle(!visible))
  }

  return (
    <div>
      <div style={hideWhenVisible}>
        <Button variant="contained" color="primary" onClick={toggleVisibility}>
          {props.buttonLabel}
        </Button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <Button
          variant="contained"
          size="small"
          color="error"
          onClick={toggleVisibility}
        >
          cancel
        </Button>
      </div>
    </div>
  )
}

export default Togglable
